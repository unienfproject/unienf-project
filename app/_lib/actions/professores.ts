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
        telefone,
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
      telefone,
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
    .select("user_id, name, email, telefone, created_at")
    .eq("role", "professor")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((p) => ({
    id: p.user_id,
    name: p.name ?? "",
    email: p.email ?? "",
    telefone: p.telefone,
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
    .select("user_id, name, telefone, email, role")
    .eq("user_id", input.professorId)
    .single();

  if (fetchError) throw new Error(fetchError.message);
  if (!currentProfile) throw new Error("Professor não encontrado.");
  if (currentProfile.role !== "professor") {
    throw new Error("Usuário não é um professor.");
  }

  const oldValue = {
    name: currentProfile.name,
    telefone: currentProfile.telefone,
    email: currentProfile.email,
  };

  const updateData: {
    name?: string;
    telefone?: string | null;
    email?: string | null;
    updated_at: string;
  } = {
    updated_at: new Date().toISOString(),
  };

  if (input.name !== undefined) {
    updateData.name = input.name.trim();
  }
  if (input.telefone !== undefined) {
    updateData.telefone = input.telefone ? input.telefone.trim() : null;
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
      telefone: updateData.telefone ?? currentProfile.telefone,
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
      `name.ilike.%${search}%,email.ilike.%${search}%,telefone.ilike.%${search}%`,
    );
  }

  const { count, error: countError } = await countQuery;
  if (countError) throw new Error(countError.message);

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  let dataQuery = supabase
    .from("profiles")
    .select("user_id, name, email, telefone")
    .eq("role", "professor")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) {
    dataQuery = dataQuery.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,telefone.ilike.%${search}%`,
    );
  }

  const { data, error } = await dataQuery;
  if (error) throw new Error(error.message);

  const items = (data ?? []).map((r) => ({
    id: r.user_id,
    name: r.name,
    email: r.email,
    telefone: r.telefone,
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

  const turmaIds = (turmasData ?? []).map((t: any) => String(t.id ?? t.ID));
  const minhasTurmas = turmaIds.length;

  let totalAlunos = 0;
  const turmaToCount = new Map<string, number>();

  if (turmaIds.length) {
    const { data: vinculos, error: vincErr } = await supabase
      .from("turma_alunos")
      .select("turma_id, aluno_id")
      .in("turma_id", turmaIds);

    if (vincErr) throw new Error(vincErr.message);

    const alunosDistinct = new Set<string>();

    for (const v of vinculos ?? []) {
      const tid = String((v as any).turma_id ?? (v as any).TURMA_ID);
      const aid = String((v as any).aluno_id ?? (v as any).ALUNO_ID);

      alunosDistinct.add(aid);
      turmaToCount.set(tid, (turmaToCount.get(tid) ?? 0) + 1);
    }

    totalAlunos = alunosDistinct.size;
  }

  const turmas: TurmaResumo[] = (turmasData ?? []).map((t: any) => {
    const id = String(t.id ?? t.ID);

    const titulo =
      safeString(t.nome) ||
      safeString(t.NOME) ||
      safeString(t.titulo) ||
      safeString(t.TITULO) ||
      safeString(t.tag) ||
      safeString(t.TAG) ||
      "Turma";

    const horario =
      safeString(t.horario, "") ||
      safeString(t.HORARIO, "") ||
      safeString(t.turno, "") ||
      safeString(t.TURNO, "") ||
      null;

    return {
      id,
      titulo,
      horario,
      totalAlunos: turmaToCount.get(id) ?? 0,
    };
  });

  return {
    professorName,
    stats: { minhasTurmas, totalAlunos },
    turmas,
  };
}
