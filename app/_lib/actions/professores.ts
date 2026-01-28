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

export async function createProfessor(input: {
  name: string;
  cpf: string;
  telefone: string;
  email: string;
  password: string;
}): Promise<{ userId: string }> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "administrativo") {
    throw new Error("Sem permissão para cadastrar professores.");
  }

  const supabase = await createServerSupabaseClient();

  const name = input.name.trim();
  const cpf = normalizeCpf(input.cpf);
  const telefone = input.telefone.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!name) throw new Error("Nome é obrigatório.");
  if (cpf.length !== 11) throw new Error("CPF inválido.");
  if (!telefone) throw new Error("Telefone é obrigatório.");
  if (!isValidEmail(email)) throw new Error("E-mail inválido.");
  if (password.length < 6) throw new Error("Senha muito curta.");

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
        role: "professor",
      },
    },
  );

  if (createErr) throw new Error(createErr.message);
  if (!created.user) throw new Error("Falha ao criar usuário.");

  const userId = created.user.id;

  const { error: profileErr } = await supabase
    .from("profiles")
    .update({
      name,
      phone: telefone,
      email,
      role: "professor",
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (profileErr) throw new Error(profileErr.message);

  await logAudit({
    action: "create",
    entity: "user",
    entityId: userId,
    newValue: { name, email, role: "professor" },
    description: `Professor ${name} criado`,
  });

  revalidatePath("/admin/professores");
  return { userId };
}

export type ProfessorRow = {
  id: string;
  name: string;
  email: string;
  telefone: string | null;
  createdAt: string;
};

export async function listProfessores(): Promise<ProfessorRow[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "administrativo" && profile.role !== "coordenação") {
    throw new Error("Sem permissão para listar professores.");
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, name, email, phone, created_at")
    .eq("role", "professor")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((p) => ({
    id: p.user_id,
    name: p.name ?? "",
    email: p.email ?? "",
    telefone: p.phone,
    createdAt: p.created_at,
  }));
}

export async function updateProfessorProfile(input: {
  professorId: string;
  name?: string;
  telefone?: string | null;
  email?: string | null;
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "administrativo" && profile.role !== "coordenação") {
    throw new Error("Sem permissão para editar dados de professores.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: currentProfile, error: fetchError } = await supabase
    .from("profiles")
    .select("user_id, name, phone, email, role")
    .eq("user_id", input.professorId)
    .single();

  if (fetchError) throw new Error(fetchError.message);
  if (!currentProfile) throw new Error("Professor não encontrado.");
  if (currentProfile.role !== "professor") {
    throw new Error("Usuário não é um professor.");
  }

  const oldValue = {
    name: currentProfile.name,
    telefone: currentProfile.phone,
    email: currentProfile.email,
  };

  const updateData: {
    name?: string;
    phone?: string | null;
    email?: string | null;
    updated_at: string;
  } = {
    updated_at: new Date().toISOString(),
  };

  if (input.name !== undefined) {
    updateData.name = input.name.trim();
  }
  if (input.telefone !== undefined) {
    updateData.phone = input.telefone ? input.telefone.trim() : null;
  }
  if (input.email !== undefined) {
    updateData.email = input.email ? input.email.trim().toLowerCase() : null;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("user_id", input.professorId);

  if (updateError) throw new Error(updateError.message);

  await logAudit({
    action: "update",
    entity: "professor",
    entityId: input.professorId,
    oldValue,
    newValue: {
      name: updateData.name ?? currentProfile.name,
      telefone: updateData.phone ?? currentProfile.phone,
      email: updateData.email ?? currentProfile.email,
    },
    description: `Dados pessoais do professor atualizados por ${profile.name ?? profile.email}`,
  });

  revalidatePath("/admin/professores");
  revalidatePath("/admin");
}

export async function listProfessoresPaginated(params: {
  page: number;
  pageSize: number;
  search?: string;
}): Promise<
  PaginatedResult<{
    id: string;
    name: string | null;
    email: string | null;
    telefone: string | null;
    cpf?: string | null;
  }>
> {
  const supabase = await createServerSupabaseClient();

  const page = Math.max(1, params.page);
  const pageSize = Math.min(50, Math.max(1, params.pageSize));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let countQuery = supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "professor");

  const search = params.search?.trim();
  if (search) {
    countQuery = countQuery.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`,
    );
  }

  const { count, error: countError } = await countQuery;
  if (countError) throw new Error(countError.message);

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  let dataQuery = supabase
    .from("profiles")
    .select("user_id, name, email, phone")
    .eq("role", "professor")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) {
    dataQuery = dataQuery.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`,
    );
  }

  const { data, error } = await dataQuery;
  if (error) throw new Error(error.message);

  const items = (data ?? []).map((r) => ({
    id: r.user_id,
    name: r.name,
    email: r.email,
    telefone: r.phone,
  }));

  return { items, total, page, pageSize, totalPages };
}

type TurmaResumo = {
  id: string;
  titulo: string;
  horario: string | null;
  totalAlunos: number;
};

export type ProfessorOverviewData = {
  professorName: string;
  stats: { minhasTurmas: number; totalAlunos: number };
  turmas: TurmaResumo[];
};

function safeString(v: unknown, fallback = "") {
  return typeof v === "string" ? v : fallback;
}

type TurmaRowFromDB = {
  id: unknown;
  tag?: unknown;
  nome?: unknown;
  NOME?: unknown;
  titulo?: unknown;
  TITULO?: unknown;
  horario?: unknown;
  HORARIO?: unknown;
  turno?: unknown;
  TURNO?: unknown;
};

type TurmaAlunoRowFromDB = {
  turma_id: unknown;
  aluno_id: unknown;
  TURMA_ID?: unknown;
  ALUNO_ID?: unknown;
};

export async function getProfessorOverview(): Promise<ProfessorOverviewData> {
  const supabase = await createServerSupabaseClient();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Sessão inválida.");

  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("user_id, name, role")
    .eq("user_id", auth.user.id)
    .single();

  if (profileErr) throw new Error(profileErr.message);
  if (!profile) throw new Error("Perfil não encontrado.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");

  const professorId = String(profile.user_id);
  const professorName = safeString(profile.name, "Professor");

  const { data: turmasData, error: turmasErr } = await supabase
    .from("turmas")
    .select("*")
    .eq("professor_id", professorId);

  if (turmasErr) throw new Error(turmasErr.message);

  const turmasDoProfessor = (turmasData ?? []) as TurmaRowFromDB[];
  const idsDasTurmas = turmasDoProfessor.map((turma) => String(turma.id ?? ""));
  const quantidadeDeTurmas = idsDasTurmas.length;

  let totalDeAlunos = 0;
  const contadorDeAlunosPorTurma = new Map<string, number>();

  if (idsDasTurmas.length > 0) {
    const { data: vinculosTurmaAluno, error: vincErr } = await supabase
      .from("turma_alunos")
      .select("turma_id, aluno_id")
      .in("turma_id", idsDasTurmas);

    if (vincErr) throw new Error(vincErr.message);

    const alunosUnicos = new Set<string>();
    const vinculos = (vinculosTurmaAluno ?? []) as TurmaAlunoRowFromDB[];

    for (const vinculo of vinculos) {
      const idDaTurma = String(vinculo.turma_id ?? vinculo.TURMA_ID ?? "");
      const idDoAluno = String(vinculo.aluno_id ?? vinculo.ALUNO_ID ?? "");

      alunosUnicos.add(idDoAluno);
      const contadorAtual = contadorDeAlunosPorTurma.get(idDaTurma) ?? 0;
      contadorDeAlunosPorTurma.set(idDaTurma, contadorAtual + 1);
    }

    totalDeAlunos = alunosUnicos.size;
  }

  const turmasFormatadas: TurmaResumo[] = turmasDoProfessor.map((turma) => {
    const idDaTurma = String(turma.id ?? "");

    const tituloDaTurma =
      safeString(turma.nome) ||
      safeString(turma.NOME) ||
      safeString(turma.titulo) ||
      safeString(turma.TITULO) ||
      safeString(turma.tag) ||
      safeString(turma.tag) ||
      "Turma";

    const horarioDaTurma =
      safeString(turma.horario, "") ||
      safeString(turma.HORARIO, "") ||
      safeString(turma.turno, "") ||
      safeString(turma.TURNO, "") ||
      null;

    const quantidadeDeAlunosNaTurma =
      contadorDeAlunosPorTurma.get(idDaTurma) ?? 0;

    return {
      id: idDaTurma,
      titulo: tituloDaTurma,
      horario: horarioDaTurma,
      totalAlunos: quantidadeDeAlunosNaTurma,
    };
  });

  return {
    professorName,
    stats: { minhasTurmas: quantidadeDeTurmas, totalAlunos: totalDeAlunos },
    turmas: turmasFormatadas,
  };
}

export type ProfessorProfileData = {
  id: string;
  name: string;
  email: string;
  telefone: string | null;
  turmas: Array<{
    id: string;
    tag: string;
    disciplinaName: string | null;
    status: string | null;
    totalAlunos: number;
  }>;
  createdAt: string;
  updatedAt: string;
};

type TurmaComDisciplinaRow = {
  id: unknown;
  tag: unknown;
  status: unknown;
  disciplina_id: unknown;
  disciplinas: { name: unknown } | { name: unknown }[] | null;
};

type VinculoTurmaAlunoRow = {
  turma_id: unknown;
};

export async function getProfessorProfile(
  professorId: string,
): Promise<ProfessorProfileData> {
  const idDoProfessor = String(professorId ?? "").trim();
  if (
    !idDoProfessor ||
    idDoProfessor === "undefined" ||
    idDoProfessor === "null"
  ) {
    throw new Error("ID do professor inválido.");
  }

  const perfilDoUsuario = await getUserProfile();
  if (!perfilDoUsuario) throw new Error("Sessão inválida.");

  // Permitir admin e coordenação
  const rolesPermitidos = ["administrativo", "coordenação"];
  if (!rolesPermitidos.includes(perfilDoUsuario.role ?? "")) {
    throw new Error("Sem permissão para visualizar perfil de professor.");
  }

  const supabase = await createServerSupabaseClient();

  // Buscar dados do profile
  const { data: dadosDoPerfil, error: erroDoPerfil } = await supabase
    .from("profiles")
    .select("user_id, name, email, phone, created_at, updated_at")
    .eq("user_id", idDoProfessor)
    .eq("role", "professor")
    .single();

  if (erroDoPerfil) throw new Error(erroDoPerfil.message);
  if (!dadosDoPerfil) throw new Error("Professor não encontrado.");

  // Buscar turmas do professor
  const { data: turmasDoProfessor, error: erroDasTurmas } = await supabase
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
    .eq("professor_id", idDoProfessor)
    .order("created_at", { ascending: false });

  if (erroDasTurmas) throw new Error(erroDasTurmas.message);

  const idsDasTurmas = (turmasDoProfessor ?? []).map((turma) =>
    String(turma.id),
  );
  const contadorDeAlunosPorTurma = new Map<string, number>();

  if (idsDasTurmas.length > 0) {
    const { data: vinculosTurmaAluno, error: erroDosVinculos } = await supabase
      .from("turma_alunos")
      .select("turma_id")
      .in("turma_id", idsDasTurmas);

    if (!erroDosVinculos && vinculosTurmaAluno) {
      const vinculos = vinculosTurmaAluno as VinculoTurmaAlunoRow[];
      for (const vinculo of vinculos) {
        const idDaTurma = String(vinculo.turma_id);
        const contadorAtual = contadorDeAlunosPorTurma.get(idDaTurma) ?? 0;
        contadorDeAlunosPorTurma.set(idDaTurma, contadorAtual + 1);
      }
    }
  }

  const turmasFormatadas = (turmasDoProfessor ?? []).map(
    (turma: TurmaComDisciplinaRow) => {
      const dadosDaDisciplina = Array.isArray(turma.disciplinas)
        ? turma.disciplinas[0]
        : turma.disciplinas;

      const idDaTurma = String(turma.id);
      const tagDaTurma = String(turma.tag ?? "");
      const nomeDaDisciplina = dadosDaDisciplina?.name
        ? String(dadosDaDisciplina.name)
        : null;
      const statusDaTurma = turma.status ? String(turma.status) : null;
      const quantidadeDeAlunos = contadorDeAlunosPorTurma.get(idDaTurma) ?? 0;

      return {
        id: idDaTurma,
        tag: tagDaTurma,
        disciplinaName: nomeDaDisciplina,
        status: statusDaTurma,
        totalAlunos: quantidadeDeAlunos,
      };
    },
  );

  return {
    id: dadosDoPerfil.user_id,
    name: dadosDoPerfil.name ?? "",
    email: dadosDoPerfil.email ?? "",
    telefone: dadosDoPerfil.phone,
    turmas: turmasFormatadas,
    createdAt: dadosDoPerfil.created_at,
    updatedAt: dadosDoPerfil.updated_at,
  };
}

export async function deleteProfessor(professorId: string) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  if (profile.role !== "administrativo") {
    throw new Error("Sem permissão para excluir professores.");
  }

  const supabase = await createServerSupabaseClient();
  const admin = getAdminSupabase();

  const { data: currentProfile, error } = await supabase
    .from("profiles")
    .select("user_id, name, email, role")
    .eq("user_id", professorId)
    .single();

  if (error) throw new Error(error.message);
  if (!currentProfile || currentProfile.role !== "professor") {
    throw new Error("Professor não encontrado.");
  }

  const { error: authError } =
    await admin.auth.admin.deleteUser(professorId);

  if (authError) throw new Error(authError.message);

  await logAudit({
    action: "delete",
    entity: "professor",
    entityId: professorId,
    oldValue: {
      name: currentProfile.name,
      email: currentProfile.email,
    },
    description: `Professor ${currentProfile.name ?? ""} excluído`,
  });

  revalidatePath("/admin/professores");
}
