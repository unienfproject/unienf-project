"use server";

import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import type { PaginatedResult } from "@/app/_lib/actions/pagination";
import { revalidatePath } from "next/cache";

type PickerItem = { id: string; label: string };

function buildPeriodFromStartDate(startDate: string): string {
  const [yearStr, monthStr] = startDate.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);

  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    const now = new Date();
    const semester = now.getMonth() + 1 <= 6 ? 1 : 2;
    return `${now.getFullYear()}.${semester}`;
  }

  const semester = month <= 6 ? 1 : 2;
  return `${year}.${semester}`;
}

function buildTurmaTag(params: {
  disciplinaName: string;
  professorName: string;
  startDate: string;
  endDate: string;
}) {
  return `${params.disciplinaName} - ${params.professorName} - ${params.startDate} - ${params.endDate}`;
}

export async function listProfessoresForPicker(): Promise<PickerItem[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, name, email")
    .eq("role", "professor")
    .order("name");

  if (error) throw new Error(error.message);

  return (data ?? []).map((p) => ({
    id: p.user_id,
    label: p.name ?? p.email ?? p.user_id,
  }));
}

export type TurmaRow = {
  id: string;
  name: string;
  tag: string;
  period: string;
  startDate: string;
  endDate: string;
  status: string;
  disciplinaId: string | null;
  disciplinaName: string | null;
  professorId: string | null;
  professorName: string | null;
  createdAt: string;
};

export async function listTurmas(): Promise<TurmaRow[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "administrativo") {
    throw new Error("Sem permissão para listar turmas.");
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("turmas")
    .select(
      `
      id,
      tag,
      period,
      start_date,
      end_date,
      status,
      disciplina_id,
      professor_id,
      created_at,
      disciplinas:disciplinas!turmas_disciplina_id_fkey(name),
      profiles:profiles!turmas_professor_id_fkey(name)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((t) => {
    const disciplina = Array.isArray(t.disciplinas)
      ? t.disciplinas[0]
      : t.disciplinas;
    const profile = Array.isArray(t.profiles) ? t.profiles[0] : t.profiles;

    return {
      id: t.id,
      name: t.tag,
      tag: t.tag,
      period: t.period ?? "",
      startDate: t.start_date,
      endDate: t.end_date,
      status: t.status,
      disciplinaId: t.disciplina_id ? String(t.disciplina_id) : null,
      disciplinaName: disciplina?.name || null,
      professorId: t.professor_id ? String(t.professor_id) : null,
      professorName: profile?.name || null,
      createdAt: t.created_at,
    };
  });
}

export async function listTurmasPaginated(params: {
  page: number;
  pageSize: number;
  search?: string;
}): Promise<PaginatedResult<TurmaRow>> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const allowedRoles = ["recepção", "administrativo", "coordenação"];
  const role = profile.role ?? "";
  if (!allowedRoles.includes(role)) {
    throw new Error("Sem permissão para listar turmas.");
  }

  const supabase = await createServerSupabaseClient();

  const page = Math.max(1, params.page);
  const pageSize = Math.min(50, Math.max(1, params.pageSize));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const search = params.search?.trim();
  const searchOr = search
    ? `tag.ilike.%${search}%,disciplinas.name.ilike.%${search}%,professor_profile.name.ilike.%${search}%`
    : null;

  // COUNT
  let countQuery = supabase
    .from("turmas")
    .select("*", { count: "exact", head: true });

  if (searchOr) countQuery = countQuery.or(searchOr);

  const { count, error: countError } = await countQuery;
  if (countError) throw new Error(countError.message);

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // DATA
  let dataQuery = supabase
    .from("turmas")
    .select(
      `
        id,
        tag,
        period,
        start_date,
        end_date,
        disciplina_id,
        professor_id,
        status,
        created_at,
        disciplinas:disciplinas!turmas_disciplina_id_fkey (
          name
        ),
        professor_profile:profiles!turmas_professor_id_fkey (
          name
        )
      `,
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (searchOr) dataQuery = dataQuery.or(searchOr);

  const { data, error } = await dataQuery;
  if (error) throw new Error(error.message);

  type TurmaPaginatedRow = {
    id: unknown;
    tag: unknown;
    period: unknown;
    start_date: unknown;
    end_date: unknown;
    status: unknown;
    disciplina_id: unknown;
    professor_id: unknown;
    created_at: unknown;
    disciplinas: { name: string | null } | { name: string | null }[] | null;
    professor_profile: { name: string | null } | { name: string | null }[] | null;
  };

  const items: TurmaRow[] = ((data ?? []) as TurmaPaginatedRow[]).map((r) => {
    const disc = Array.isArray(r.disciplinas)
      ? r.disciplinas[0]
      : r.disciplinas;
    const prof = Array.isArray(r.professor_profile)
      ? r.professor_profile[0]
      : r.professor_profile;

    return {
      id: String(r.id),
      name: String(r.tag ?? ""),
      tag: String(r.tag ?? ""),
      period: String(r.period ?? ""),
      startDate: String(r.start_date ?? ""),
      endDate: String(r.end_date ?? ""),
      status: String(r.status ?? ""),
      disciplinaId: r.disciplina_id ? String(r.disciplina_id) : null,
      disciplinaName: disc?.name ?? null,
      professorId: r.professor_id ? String(r.professor_id) : null,
      professorName: prof?.name ?? null,
      createdAt: String(r.created_at ?? ""),
    };
  });

  return { items, total, page, pageSize, totalPages };
}

export async function updateTurmaAdmin(input: {
  turmaId: string;
  tag?: string;
  period?: string;
  startDate: string;
  endDate: string;
  disciplinaId: string;
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const allowedRoles = ["administrativo", "coordenação"];
  if (!allowedRoles.includes(profile.role ?? "")) {
    throw new Error("Sem permissão para editar turmas.");
  }

  const turmaId = String(input.turmaId ?? "").trim();
  const disciplinaId = String(input.disciplinaId ?? "").trim();
  const startDate = String(input.startDate ?? "").trim();
  const endDate = String(input.endDate ?? "").trim() || startDate;

  if (!turmaId) throw new Error("Turma inválida.");
  if (!disciplinaId) throw new Error("Selecione uma disciplina.");
  if (!startDate) throw new Error("Informe a data de início.");
  if (!endDate) throw new Error("Informe a data de término.");

  const supabase = await createServerSupabaseClient();

  const { data: turma, error: turmaError } = await supabase
    .from("turmas")
    .select(
      `
        id,
        tag,
        start_date,
        end_date,
        professor_id,
        disciplinas:disciplinas!turmas_disciplina_id_fkey(name),
        professor_profile:profiles!turmas_professor_id_fkey(name, email)
      `,
    )
    .eq("id", turmaId)
    .single();

  if (turmaError) throw new Error(turmaError.message);
  if (!turma) throw new Error("Turma não encontrada.");

  const { data: disciplina, error: disciplinaError } = await supabase
    .from("disciplinas")
    .select("name")
    .eq("id", disciplinaId)
    .single();

  if (disciplinaError || !disciplina?.name) {
    throw new Error("Disciplina selecionada não encontrada.");
  }

  type JoinedName = { name: string | null; email?: string | null };
  type TurmaEditRow = {
    tag: string | null;
    start_date: string | null;
    end_date: string | null;
    professor_id: string | null;
    disciplinas: { name: string | null } | { name: string | null }[] | null;
    professor_profile: JoinedName | JoinedName[] | null;
  };

  const turmaRow = turma as TurmaEditRow;
  const oldDisciplina = Array.isArray(turmaRow.disciplinas)
    ? turmaRow.disciplinas[0]
    : turmaRow.disciplinas;
  const professor = Array.isArray(turmaRow.professor_profile)
    ? turmaRow.professor_profile[0]
    : turmaRow.professor_profile;
  const professorName = (professor?.name ?? professor?.email ?? "").trim();

  if (!professorName) {
    throw new Error("Professor da turma sem nome válido para gerar etiqueta.");
  }

  const oldGeneratedTag = buildTurmaTag({
    disciplinaName: String(oldDisciplina?.name ?? "").trim(),
    professorName,
    startDate: String(turmaRow.start_date ?? "").trim(),
    endDate: String(turmaRow.end_date ?? "").trim(),
  });
  const newGeneratedTag = buildTurmaTag({
    disciplinaName: disciplina.name.trim(),
    professorName,
    startDate,
    endDate,
  });

  const submittedTag = String(input.tag ?? "").trim();
  const currentTag = String(turmaRow.tag ?? "").trim();
  const tag =
    !submittedTag || (submittedTag === currentTag && currentTag === oldGeneratedTag)
      ? newGeneratedTag
      : submittedTag;
  const period = String(input.period ?? "").trim() || buildPeriodFromStartDate(startDate);

  const { error } = await supabase
    .from("turmas")
    .update({
      tag,
      period,
      start_date: startDate,
      end_date: endDate,
      disciplina_id: disciplinaId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", turmaId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/turmas");
  revalidatePath(`/admin/turmas/${turmaId}`);
  revalidatePath("/recepcao/turmas");
  revalidatePath(`/recepcao/turmas/${turmaId}`);
  revalidatePath("/professores/turmas");
  revalidatePath(`/professores/turmas/${turmaId}`);
  revalidatePath("/admin/financeiro");
  revalidatePath("/recepcao/financeiro");
  revalidatePath("/aluno/financeiro");
}

export type TurmaDetailForStaff = {
  id: string;
  tag: string;
  startDate: string;
  endDate: string;
  status: "ativa" | "finalizada" | string;
  disciplinaName: string | null;
  professorId: string | null;
  professorName: string | null;
  students: Array<{
    id: string;
    name: string;
    email: string;
  }>;
};

export async function getTurmaDetailForStaff(
  turmaId: string,
): Promise<TurmaDetailForStaff> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const allowedRoles = ["recepção", "administrativo", "coordenação"];
  if (!allowedRoles.includes(profile.role ?? "")) {
    throw new Error("Sem permissão para acessar turma.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: turma, error } = await supabase
    .from("turmas")
    .select(
      `
        id,
        tag,
        start_date,
        end_date,
        status,
        professor_id,
        disciplinas:disciplinas!turmas_disciplina_id_fkey(name),
        professor_profile:profiles!turmas_professor_id_fkey(name, email)
      `,
    )
    .eq("id", turmaId)
    .single();

  if (error) throw new Error(error.message);
  if (!turma) throw new Error("Turma não encontrada.");

  const { data: turmaAlunos, error: alunosError } = await supabase
    .from("turma_alunos")
    .select(
      `
        aluno_id,
        profiles:profiles!turma_alunos_aluno_id_fkey(user_id, name, email)
      `,
    )
    .eq("turma_id", turmaId);

  if (alunosError) throw new Error(alunosError.message);

  type JoinedName = { name: string | null; email?: string | null };
  type TurmaDetailRow = {
    id: string;
    tag: string | null;
    start_date: string | null;
    end_date: string | null;
    status: string | null;
    professor_id: string | null;
    disciplinas: { name: string | null } | { name: string | null }[] | null;
    professor_profile: JoinedName | JoinedName[] | null;
  };
  type TurmaAlunoDetailRow = {
    aluno_id: string;
    profiles: JoinedName | JoinedName[] | null;
  };

  const turmaRow = turma as TurmaDetailRow;
  const disciplina = Array.isArray(turmaRow.disciplinas)
    ? turmaRow.disciplinas[0]
    : turmaRow.disciplinas;
  const professor = Array.isArray(turmaRow.professor_profile)
    ? turmaRow.professor_profile[0]
    : turmaRow.professor_profile;

  const students = ((turmaAlunos ?? []) as TurmaAlunoDetailRow[]).map((row) => {
    const aluno = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: String(row.aluno_id),
      name: String(aluno?.name ?? aluno?.email ?? "Aluno"),
      email: String(aluno?.email ?? ""),
    };
  });

  students.sort((a, b) => a.name.localeCompare(b.name));

  return {
    id: String(turmaRow.id),
    tag: String(turmaRow.tag ?? ""),
    startDate: String(turmaRow.start_date ?? ""),
    endDate: String(turmaRow.end_date ?? ""),
    status: String(turmaRow.status ?? ""),
    disciplinaName: disciplina?.name ?? null,
    professorId: turmaRow.professor_id ? String(turmaRow.professor_id) : null,
    professorName: professor?.name ?? professor?.email ?? null,
    students,
  };
}
