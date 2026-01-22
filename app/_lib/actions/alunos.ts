"use server";

import { logAudit } from "@/app/_lib/actions/audit";
import type { PaginatedResult } from "@/app/_lib/actions/pagination";
import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createAdminClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

function normalizeCpf(cpf: string) {
  return cpf.replace(/\D/g, "");
}

function isValidEmail(email: string) {
  return email.includes("@");
}

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export async function createAluno(input: {
  name: string;
  cpf: string;
  telefone: string;
  email: string;
  password: string;
  dateOfBirth: string;
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "administrativo") {
    throw new Error("Sem permissão para cadastrar alunos.");
  }

  const supabase = await createServerSupabaseClient();

  const name = input.name.trim();
  const cpf = normalizeCpf(input.cpf);
  const telefone = input.telefone.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  const dateOfBirth = input.dateOfBirth;

  if (!name) throw new Error("Nome é obrigatório.");
  if (cpf.length !== 11) throw new Error("CPF inválido.");
  if (!telefone) throw new Error("Telefone é obrigatório.");
  if (!isValidEmail(email)) throw new Error("E-mail inválido.");
  if (password.length < 6) throw new Error("Senha muito curta.");
  if (!dateOfBirth) throw new Error("Data de nascimento é obrigatória.");

  const age = calculateAge(dateOfBirth);

  const admin = getAdminSupabase();

  const { data: created, error: createErr } = await admin.auth.admin.createUser(
    {
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        phone: telefone,
      },
      app_metadata: {
        role: "aluno",
      },
    },
  );

  if (createErr) throw new Error(createErr.message);
  if (!created.user) throw new Error("Falha ao criar usuário.");

  const userId = created.user.id;

  const { error: alunoError } = await supabase.from("alunos").insert({
    user_id: userId,
    age,
    date_of_birth: dateOfBirth,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (alunoError) throw new Error(alunoError.message);

  await logAudit({
    action: "create",
    entity: "user",
    entityId: userId,
    newValue: { name, email, role: "aluno", dateOfBirth },
    description: `Aluno ${name} matriculado`,
  });

  revalidatePath("/admin/alunos");
  return { userId };
}

export type AlunoRow = {
  id: string;
  name: string;
  email: string;
  telefone: string | null;
  cpf?: string | null;
  age?: number | null;
  dateOfBirth?: string | null;
  createdAt: string;
};

export async function listAlunos(): Promise<AlunoRow[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "administrativo" && profile.role !== "coordenação") {
    throw new Error("Sem permissão para listar alunos.");
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
      user_id,
      name,
      email,
      phone,
      created_at,
      alunos:alunos!alunos_user_id_fkey(age, date_of_birth)
    `,
    )
    .eq("role", "aluno")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((p) => {
    const aluno = Array.isArray(p.alunos) ? p.alunos[0] : p.alunos;

    return {
      id: p.user_id,
      name: p.name ?? "",
      email: p.email ?? "",
      telefone: p.phone,
      age: aluno?.age ?? null,
      dateOfBirth: aluno?.date_of_birth ?? null,
      createdAt: p.created_at,
    };
  });
}

export type MyProfile = {
  id: string;
  name: string;
  email: string;
  telefone: string | null;
  age: number | null;
  dateOfBirth: string | null;
  turmaAtual: {
    id: string;
    name: string;
    tag: string;
  } | null;
};

export async function getMyProfile(): Promise<MyProfile> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  if (profile.role !== "aluno") {
    throw new Error("Esta função é apenas para alunos.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select(
      `
      user_id,
      name,
      email,
      phone,
      alunos:alunos!alunos_user_id_fkey(age, date_of_birth)
    `,
    )
    .eq("user_id", profile.user_id)
    .single();

  if (profileError) throw new Error(profileError.message);
  if (!profileData) throw new Error("Perfil não encontrado.");

  const aluno = Array.isArray(profileData.alunos)
    ? profileData.alunos[0]
    : profileData.alunos;

  const { data: turmaData, error: turmaError } = await supabase
    .from("turma_alunos")
    .select(
      `
      turma_id,
      turmas:turmas!turma_alunos_turma_id_fkey(id, tag, status)
    `,
    )
    .eq("aluno_id", profile.user_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  let turmaAtual = null;
  if (!turmaError && turmaData) {
    const turma = Array.isArray(turmaData.turmas)
      ? turmaData.turmas[0]
      : turmaData.turmas;
    if (turma && turma.status === "ativa") {
      turmaAtual = {
        id: turma.id,
        name: turma.tag,
        tag: turma.tag,
      };
    }
  }

  return {
    id: profile.user_id,
    name: profileData.name ?? "",
    email: profileData.email ?? "",
    telefone: profileData.phone,
    age: aluno?.age ?? null,
    dateOfBirth: aluno?.date_of_birth ?? null,
    turmaAtual,
  };
}

export type StudentPersonalData = {
  id: string;
  name: string;
  email: string;
  telefone: string | null;
  age: number | null;
  dateOfBirth: string | null;
  turmas: Array<{
    id: string;
    name: string;
    tag: string;
    disciplinaName: string | null;
  }>;
};

export type AlunoProfileData = {
  id: string;
  name: string;
  email: string;
  telefone: string | null;
  age: number | null;
  dateOfBirth: string | null;
  turmas: Array<{
    id: string;
    name: string;
    tag: string;
    disciplinaName: string | null;
    status: string | null;
  }>;
  createdAt: string;
  updatedAt: string;
};

export async function getStudentPersonalData(
  studentId: string,
  teacherId: string,
): Promise<StudentPersonalData> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== teacherId) throw new Error("Acesso inválido.");

  const supabase = await createServerSupabaseClient();

  const { data: turmasProfessor, error: turmasError } = await supabase
    .from("turmas")
    .select("id")
    .eq("professor_id", teacherId);

  if (turmasError) throw new Error(turmasError.message);
  if (!turmasProfessor || turmasProfessor.length === 0) {
    throw new Error("Você não tem turmas cadastradas.");
  }

  const turmaIds = turmasProfessor.map((turma) => turma.id);

  const { data: turmaAluno, error: turmaAlunoError } = await supabase
    .from("turma_alunos")
    .select("turma_id")
    .eq("aluno_id", studentId)
    .in("turma_id", turmaIds)
    .limit(1)
    .single();

  if (turmaAlunoError || !turmaAluno) {
    throw new Error(
      "Você não tem permissão para visualizar dados deste aluno.",
    );
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select(
      `
      user_id,
      name,
      email,
      phone,
      alunos:alunos!alunos_user_id_fkey(age, date_of_birth)
    `,
    )
    .eq("user_id", studentId)
    .single();

  if (profileError) throw new Error(profileError.message);
  if (!profileData) throw new Error("Aluno não encontrado.");

  const dadosAluno = Array.isArray(profileData.alunos)
    ? profileData.alunos[0]
    : profileData.alunos;

  const { data: turmasAluno, error: turmasAlunoError } = await supabase
    .from("turma_alunos")
    .select(
      `
      turma_id,
      turmas:turmas!turma_alunos_turma_id_fkey(
        id,
        name,
        tag,
        disciplinas:disciplinas!turmas_disciplina_id_fkey(name)
      )
    `,
    )
    .eq("aluno_id", studentId)
    .in("turma_id", turmaIds);

  if (turmasAlunoError) throw new Error(turmasAlunoError.message);

  type TurmaAlunoComTurmaRow = {
    turma_id: string;
    turmas:
      | {
          id: string;
          name: string;
          tag: string;
          disciplinas: { name: string } | { name: string }[];
        }
      | {
          id: string;
          name: string;
          tag: string;
          disciplinas: { name: string } | { name: string }[];
        }[];
  };

  const turmas = (turmasAluno ?? []).map(
    (turmaAluno: TurmaAlunoComTurmaRow) => {
      const turma = Array.isArray(turmaAluno.turmas)
        ? turmaAluno.turmas[0]
        : turmaAluno.turmas;
      const disciplina = Array.isArray(turma?.disciplinas)
        ? turma.disciplinas[0]
        : turma?.disciplinas;

      return {
        id: turma?.id ?? "",
        name: turma?.name ?? "",
        tag: turma?.tag ?? "",
        disciplinaName: disciplina?.name ?? null,
      };
    },
  );

  return {
    id: profileData.user_id,
    name: profileData.name ?? "",
    email: profileData.email ?? "",
    telefone: profileData.phone,
    age: dadosAluno?.age ?? null,
    dateOfBirth: dadosAluno?.date_of_birth ?? null,
    turmas,
  };
}

export async function getAlunoProfile(
  studentId: string,
): Promise<AlunoProfileData> {
  // Validar studentId
  const id = String(studentId ?? "").trim();
  if (!id || id === "undefined" || id === "null") {
    throw new Error("ID do aluno inválido.");
  }

  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  // Permitir admin, coordenação e recepção
  const allowedRoles = ["administrativo", "coordenação", "recepção"];
  if (!allowedRoles.includes(profile.role ?? "")) {
    throw new Error("Sem permissão para visualizar perfil de aluno.");
  }

  const supabase = await createServerSupabaseClient();

  // Buscar dados do profile e aluno
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select(
      `
      user_id,
      name,
      email,
      phone,
      created_at,
      updated_at,
      alunos:alunos!alunos_user_id_fkey(age, date_of_birth)
    `,
    )
    .eq("user_id", id)
    .eq("role", "aluno")
    .single();

  if (profileError) throw new Error(profileError.message);
  if (!profileData) throw new Error("Aluno não encontrado.");

  const dadosAluno = Array.isArray(profileData.alunos)
    ? profileData.alunos[0]
    : profileData.alunos;

  // Buscar turmas do aluno - fazer query separada para evitar problemas com joins aninhados
  const { data: turmasAluno, error: turmasAlunoError } = await supabase
    .from("turma_alunos")
    .select("turma_id")
    .eq("aluno_id", id);

  if (turmasAlunoError) throw new Error(turmasAlunoError.message);

  // Buscar dados das turmas separadamente
  const turmaIds =
    turmasAluno && turmasAluno.length > 0
      ? turmasAluno.map((ta) => ta.turma_id)
      : [];

  let turmasData: Array<{
    id: string;
    name: string;
    tag: string;
    status: string | null;
    disciplinaName: string | null;
  }> = [];

  if (turmaIds.length > 0) {
    const { data: turmas, error: turmasError } = await supabase
      .from("turmas")
      .select(
        `
        id,
        tag,
        status,
        disciplina_id,
        disciplinas:disciplinas!turmas_disciplina_id_fkey(name)
      `,
      )
      .in("id", turmaIds);

    if (turmasError) {
      console.warn(
        "[getAlunoProfile] Erro ao buscar turmas:",
        turmasError.message,
      );
    } else if (turmas) {
      type TurmaRow = {
        id: unknown;
        tag: unknown;
        status: unknown;
        disciplina_id: unknown;
        disciplinas: { name: unknown } | { name: unknown }[] | null;
      };
      turmasData = (turmas as TurmaRow[]).map((t) => {
        const disciplina = Array.isArray(t.disciplinas)
          ? t.disciplinas[0]
          : t.disciplinas;
        return {
          id: String(t.id),
          name: String(t.tag ?? ""),
          tag: String(t.tag ?? ""),
          status: t.status ? String(t.status) : null,
          disciplinaName: disciplina?.name ? String(disciplina.name) : null,
        };
      });
    }
  }

  const turmas = turmasData;

  return {
    id: profileData.user_id,
    name: profileData.name ?? "",
    email: profileData.email ?? "",
    telefone: profileData.phone,
    age: dadosAluno?.age ?? null,
    dateOfBirth: dadosAluno?.date_of_birth ?? null,
    turmas,
    createdAt: profileData.created_at,
    updatedAt: profileData.updated_at,
  };
}

export async function updateAlunoProfile(input: {
  alunoId: string;
  name?: string;
  telefone?: string | null;
  email?: string | null;
  dateOfBirth?: string | null;
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "administrativo" && profile.role !== "coordenação") {
    throw new Error("Sem permissão para editar dados de alunos.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: currentProfile, error: fetchError } = await supabase
    .from("profiles")
    .select("user_id, name, phone, email, role")
    .eq("user_id", input.alunoId)
    .single();

  if (fetchError) throw new Error(fetchError.message);
  if (!currentProfile) throw new Error("Aluno não encontrado.");
  if (currentProfile.role !== "aluno") {
    throw new Error("Usuário não é um aluno.");
  }

  const oldValue = {
    name: currentProfile.name,
    telefone: currentProfile.phone,
    email: currentProfile.email,
  };

  const updateProfileData: {
    name?: string;
    phone?: string | null;
    email?: string | null;
    updated_at: string;
  } = {
    updated_at: new Date().toISOString(),
  };

  if (input.name !== undefined) {
    updateProfileData.name = input.name.trim();
  }
  if (input.telefone !== undefined) {
    updateProfileData.phone = input.telefone ? input.telefone.trim() : null;
  }
  if (input.email !== undefined) {
    updateProfileData.email = input.email
      ? input.email.trim().toLowerCase()
      : null;
  }

  const { error: updateProfileError } = await supabase
    .from("profiles")
    .update(updateProfileData)
    .eq("user_id", input.alunoId);

  if (updateProfileError) throw new Error(updateProfileError.message);

  let oldAlunoValue: { age?: number | null; date_of_birth?: string | null } =
    {};
  let updateAlunoData: {
    age?: number;
    date_of_birth?: string | null;
    updated_at: string;
  } | null = null;

  if (input.dateOfBirth !== undefined) {
    const { data: currentAluno } = await supabase
      .from("alunos")
      .select("age, date_of_birth")
      .eq("user_id", input.alunoId)
      .single();

    if (currentAluno) {
      oldAlunoValue = {
        age: currentAluno.age,
        date_of_birth: currentAluno.date_of_birth,
      };
    }

    function calculateAge(dateOfBirth: string): number {
      const today = new Date();
      const birth = new Date(dateOfBirth);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }
      return age;
    }

    const age = input.dateOfBirth ? calculateAge(input.dateOfBirth) : null;

    updateAlunoData = {
      date_of_birth: input.dateOfBirth || null,
      age: age ?? undefined,
      updated_at: new Date().toISOString(),
    };

    const { error: updateAlunoError } = await supabase
      .from("alunos")
      .update(updateAlunoData)
      .eq("user_id", input.alunoId);

    if (updateAlunoError) throw new Error(updateAlunoError.message);
  }

  await logAudit({
    action: "update",
    entity: "aluno",
    entityId: input.alunoId,
    oldValue: { ...oldValue, ...oldAlunoValue },
    newValue: {
      name: updateProfileData.name ?? currentProfile.name,
      telefone: updateProfileData.phone ?? currentProfile.phone,
      email: updateProfileData.email ?? currentProfile.email,
      ...(updateAlunoData
        ? {
            date_of_birth: updateAlunoData.date_of_birth,
            age: updateAlunoData.age,
          }
        : {}),
    },
    description: `Dados pessoais do aluno atualizados por ${profile.name ?? profile.email}`,
  });

  revalidatePath("/admin/alunos");
  revalidatePath("/admin");
}

export async function listAlunosPaginated(params: {
  page: number;
  pageSize: number;
  search?: string;
}): Promise<PaginatedResult<AlunoRow>> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const allowedRoles = ["recepção", "administrativo", "coordenação"];
  const role = profile.role ?? "";
  if (!allowedRoles.includes(role)) {
    throw new Error("Sem permissão para listar alunos.");
  }

  const supabase = await createServerSupabaseClient();

  const page = Math.max(1, params.page);
  const pageSize = Math.min(50, Math.max(1, params.pageSize));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const search = params.search?.trim();
  const searchOr = search
    ? `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
    : null;

  // 1) COUNT
  let countQuery = supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "aluno");

  if (searchOr) countQuery = countQuery.or(searchOr);

  const { count, error: countError } = await countQuery;
  if (countError) throw new Error(countError.message);

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // 2) DATA
  let dataQuery = supabase
    .from("profiles")
    .select(
      `
        user_id,
        name,
        email,
        phone,
        created_at,
        alunos:alunos!alunos_user_id_fkey (
          age,
          date_of_birth
        )
      `,
    )
    .eq("role", "aluno")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (searchOr) dataQuery = dataQuery.or(searchOr);

  const { data, error } = await dataQuery;
  if (error) throw new Error(error.message);

  type SupabaseAlunoRow = {
    user_id: unknown;
    name: unknown;
    email: unknown;
    phone: unknown;
    created_at: unknown;
    alunos:
      | { age: unknown; date_of_birth: unknown }
      | { age: unknown; date_of_birth: unknown }[]
      | null;
  };

  const items: AlunoRow[] = (data ?? []).map((r: SupabaseAlunoRow) => {
    const alunoMeta = Array.isArray(r.alunos) ? r.alunos[0] : r.alunos;

    return {
      id: String(r.user_id),
      name: String(r.name ?? ""),
      email: String(r.email ?? ""),
      telefone: r.phone ? String(r.phone) : null,
      age: alunoMeta?.age != null ? Number(alunoMeta.age) : null,
      dateOfBirth: alunoMeta?.date_of_birth
        ? String(alunoMeta.date_of_birth)
        : null,
      createdAt: String(r.created_at),
    };
  });

  return { items, total, page, pageSize, totalPages };
}

export type AlunoDashboardNotaItem = {
  id: string;
  value: number;
  turmaId: string | null;
  turmaLabel: string;
  avaliacaoLabel: string;
  launchedAt: string; // ISO
};

export type AlunoDashboardAvisoItem = {
  id: string;
  title: string;
  createdAt: string; // ISO
};

export type AlunoDashboardDocsResumo = {
  entregues: number;
  pendentes: number;
  pct: number; // 0..100
};

export type AlunoDashboardOverview = {
  alunoName: string;
  turmaAtualLabel: string | null; // ex.: "Técnico 2024.1"
  mediaGeral: number | null; // média simples das notas existentes
  documentos: AlunoDashboardDocsResumo;
  ultimasNotas: AlunoDashboardNotaItem[];
  avisosRecentes: AlunoDashboardAvisoItem[];
};

/**
 * Overview do aluno (Visão Geral).
 * - Turma: via getMyProfile()
 * - Média: média simples das notas existentes (tabela notas)
 * - Últimas notas: notas + avaliações + turma/disciplinas + data via audit_logs (quando existir)
 * - Avisos recentes: tabela avisos (filtra por turma_id ou aluno_id, se existirem)
 * - Documentos: tenta tabela aluno_documentos (fallback 0/0 se não existir)
 */
export async function getAlunoOverviewDashboard(): Promise<AlunoDashboardOverview> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "aluno") throw new Error("Sem permissão.");

  const supabase = await createServerSupabaseClient();
  const alunoId = profile.user_id;

  // 1) Turma atual (reaproveita seu getMyProfile)
  const my = await getMyProfile();
  const turmaAtualLabel = my.turmaAtual?.tag ?? null;

  // 2) Últimas notas + média geral
  // IMPORTANT: não usa turmas.name, usa turmas.tag
  let ultimasNotas: AlunoDashboardNotaItem[] = [];
  let mediaGeral: number | null = null;

  try {
    const { data: notas, error: notasErr } = await supabase
      .from("notas")
      .select(
        `
        id,
        value,
        created_at,
        updated_at,
        avaliacao_id,
        avaliacoes:avaliacoes!notas_avaliacao_id_fkey(
          id,
          type,
          name,
          turma_id,
          turmas:turmas!avaliacoes_turma_id_fkey(id, tag),
          disciplinas:disciplinas!avaliacoes_disciplina_id_fkey(name)
        )
      `,
      )
      .eq("aluno_id", alunoId)
      .order("updated_at", { ascending: false })
      .limit(5);

    if (notasErr) throw notasErr;

    const rows = (notas ?? []) as any[];

    // média simples com as notas existentes
    const valores = rows
      .map((n) => (n.value == null ? null : Number(n.value)))
      .filter((v) => typeof v === "number" && Number.isFinite(v)) as number[];

    if (valores.length) {
      mediaGeral = valores.reduce((a, b) => a + b, 0) / valores.length;
    }

    // tenta pegar "data de lançamento" do audit_logs (se existir)
    const noteIds = rows.map((n) => String(n.id));
    const auditMap = new Map<string, string>();

    if (noteIds.length) {
      try {
        const { data: audits, error: auditErr } = await supabase
          .from("audit_logs")
          .select("entityId, created_at, entity")
          .eq("entity", "nota")
          .in("entityId", noteIds)
          .order("created_at", { ascending: false });

        if (!auditErr && audits) {
          for (const a of audits as any[]) {
            const id = String(a.entityId ?? "");
            if (id && !auditMap.has(id)) {
              auditMap.set(id, String(a.created_at));
            }
          }
        }
      } catch {
        // sem audit_logs, segue com updated_at
      }
    }

    ultimasNotas = rows.map((n) => {
      const avaliacao = Array.isArray(n.avaliacoes) ? n.avaliacoes[0] : n.avaliacoes;

      const turmaObj = Array.isArray(avaliacao?.turmas)
        ? avaliacao.turmas[0]
        : avaliacao?.turmas;

      const disciplinaObj = Array.isArray(avaliacao?.disciplinas)
        ? avaliacao.disciplinas[0]
        : avaliacao?.disciplinas;

      const turmaLabel =
        (turmaObj?.tag ? String(turmaObj.tag) : null) ??
        (turmaAtualLabel ?? "Turma");

      const avaliacaoLabel =
        (avaliacao?.name ? String(avaliacao.name) : null) ??
        (avaliacao?.type ? String(avaliacao.type) : null) ??
        (disciplinaObj?.name ? String(disciplinaObj.name) : "Avaliação");

      const launchedAt =
        auditMap.get(String(n.id)) ??
        (n.updated_at ? String(n.updated_at) : String(n.created_at));

      return {
        id: String(n.id),
        value: Number(n.value),
        turmaId: turmaObj?.id ? String(turmaObj.id) : null,
        turmaLabel,
        avaliacaoLabel,
        launchedAt,
      };
    });
  } catch {
    ultimasNotas = [];
    mediaGeral = null;
  }

  // 3) Documentos (tentativa por tabela padrão; se a sua for outra, me diga o nome)
  // Esperado: aluno_documentos(aluno_id, status)
  let documentos: AlunoDashboardDocsResumo = { entregues: 0, pendentes: 0, pct: 0 };

  try {
    const { data, error } = await supabase
      .from("aluno_documentos")
      .select("id, status")
      .eq("aluno_id", alunoId);

    if (error) {
      // tabela não existe
      if (error.code === "42P01") {
        documentos = { entregues: 0, pendentes: 0, pct: 0 };
      } else {
        throw error;
      }
    } else {
      const rows = (data ?? []) as any[];
      const entregues = rows.filter((r) => String(r.status) === "entregue").length;
      const pendentes = rows.filter((r) => String(r.status) !== "entregue").length;
      const total = entregues + pendentes;
      const pct = total > 0 ? Math.round((entregues / total) * 100) : 0;
      documentos = { entregues, pendentes, pct };
    }
  } catch {
    documentos = { entregues: 0, pendentes: 0, pct: 0 };
  }

  // 4) Avisos recentes (se o seu modelo for por tabela intermediária de destinatários, me avise)
  // Esperado: avisos(id, title, created_at, turma_id?, aluno_id?)
  let avisosRecentes: AlunoDashboardAvisoItem[] = [];

  try {
    const base = supabase
      .from("avisos")
      .select("id, title, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    const { data, error } = turmaAtualLabel
      ? await base.or(`aluno_id.eq.${alunoId},turma_tag.eq.${turmaAtualLabel}`)
      : await base.eq("aluno_id", alunoId);

    // Observação:
    // Eu filtrei por turma_tag porque no seu sistema turma parece ser "tag".
    // Se no seu banco o aviso relaciona por turma_id, trocamos para turma_id.eq.<id>.
    if (error) {
      if (error.code === "42703" || error.code === "42P01") {
        avisosRecentes = [];
      } else {
        throw error;
      }
    } else {
      avisosRecentes = (data ?? []).map((a: any) => ({
        id: String(a.id),
        title: String(a.title ?? "Aviso"),
        createdAt: String(a.created_at),
      }));
    }
  } catch {
    avisosRecentes = [];
  }

  return {
    alunoName: my.name || profile.name || "Aluno(a)",
    turmaAtualLabel,
    mediaGeral,
    documentos,
    ultimasNotas,
    avisosRecentes,
  };
}
