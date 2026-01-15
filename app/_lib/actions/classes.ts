"use server";

import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { revalidatePath } from "next/cache";

type PickerItem = { id: string; label: string };

type ClassRow = {
  id: string;
  name: string;
  tag: string;
  start_date: string;
  end_date: string;
  status: "ativa" | "finalizada";
};

export async function listTeacherClasses(
  teacherId: string,
): Promise<ClassRow[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== teacherId) throw new Error("Acesso inválido.");

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("turmas")
    .select(
      `
      id,
      tag,
      start_date,
      end_date,
      status,
      disciplina_id,
      professor_id
    `,
    )
    .eq("professor_id", teacherId)
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === "42P01") {
      return [];
    }
    throw new Error(error.message);
  }

  return (data ?? []).map((t) => ({
    id: t.id,
    name: t.tag,
    tag: t.tag,
    start_date: t.start_date,
    end_date: t.end_date,
    status: t.status as "ativa" | "finalizada",
  }));
}

export async function listSubjectsForPicker(): Promise<PickerItem[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("disciplinas")
    .select("id, name")
    .order("name");

  if (error) throw new Error(error.message);

  return (data ?? []).map((d) => ({ id: d.id, label: d.name }));
}

export async function listStudentsForPicker(): Promise<PickerItem[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, name, email")
    .eq("role", "aluno")
    .order("name");

  if (error) throw new Error(error.message);

  return (data ?? []).map((p) => ({
    id: p.user_id,
    label: p.name ?? p.email ?? p.user_id,
  }));
}

export async function createClass(input: {
  teacherId: string;
  name: string;
  tag: string;
  startDate: string;
  endDate: string;
  subjectIds: string[];
  studentIds: string[];
}): Promise<{ turmaId: string }> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== input.teacherId) throw new Error("Acesso inválido.");

  const supabase = await createServerSupabaseClient();

  const tagTrimmed = input.tag.trim();
  const periodMatch = tagTrimmed.match(/\d{4}\.\d$/);
  const period = periodMatch
    ? periodMatch[0]
    : new Date().getFullYear().toString() + ".1";

  const { data: turma, error: turmaError } = await supabase
    .from("turmas")
    .insert({
      name: input.name.trim(),
      tag: tagTrimmed,
      period: period,
      start_date: input.startDate,
      end_date: input.endDate,
      status: "ativa",
      professor_id: input.teacherId,
      disciplina_id: input.subjectIds[0] || null,
      created_by: profile.user_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (turmaError) throw new Error(turmaError.message);
  if (!turma) throw new Error("Falha ao criar turma.");

  if (input.studentIds.length > 0) {
    const turmaAlunos = input.studentIds.map((alunoId) => ({
      turma_id: turma.id,
      aluno_id: alunoId,
      created_at: new Date().toISOString(),
    }));

    const { error: alunosError } = await supabase
      .from("turma_alunos")
      .insert(turmaAlunos);

    if (alunosError) throw new Error(alunosError.message);
  }

  revalidatePath("/professores/turmas");
  return { turmaId: turma.id };
}

export async function createTurmaAdmin(input: {
  name: string;
  tag: string;
  startDate: string;
  endDate: string;
  professorId: string;
  disciplinaId: string;
  studentIds?: string[];
}): Promise<{ turmaId: string }> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "administrativo") {
    throw new Error("Sem permissão para criar turmas.");
  }

  const supabase = await createServerSupabaseClient();

  // Extrair período do tag (ex: "Primeiros_Socorros_2026.2" -> "2026.2")
  // Se não houver padrão no tag, usar ano atual + semestre
  const tagTrimmed = input.tag.trim();
  const periodMatch = tagTrimmed.match(/\d{4}\.\d$/);
  const period = periodMatch
    ? periodMatch[0]
    : new Date().getFullYear().toString() + ".1";

  const { data: turma, error: turmaError } = await supabase
    .from("turmas")
    .insert({
      name: input.name.trim(),
      tag: tagTrimmed,
      period: period,
      start_date: input.startDate,
      end_date: input.endDate,
      status: "ativa",
      professor_id: input.professorId,
      disciplina_id: input.disciplinaId,
      created_by: profile.user_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (turmaError) throw new Error(turmaError.message);
  if (!turma) throw new Error("Falha ao criar turma.");

  if (input.studentIds && input.studentIds.length > 0) {
    const turmaAlunos = input.studentIds.map((alunoId) => ({
      turma_id: turma.id,
      aluno_id: alunoId,
      created_at: new Date().toISOString(),
    }));

    const { error: alunosError } = await supabase
      .from("turma_alunos")
      .insert(turmaAlunos);

    if (alunosError) throw new Error(alunosError.message);
  }

  revalidatePath("/admin/turmas");
  return { turmaId: turma.id };
}

export async function finalizeClass(input: {
  classId: string;
  teacherId: string;
}): Promise<void> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== input.teacherId) throw new Error("Acesso inválido.");

  const supabase = await createServerSupabaseClient();

  const { data: turmaData, error: turmaError } = await supabase
    .from("turmas")
    .select("id, professor_id, status")
    .eq("id", input.classId)
    .single();

  if (turmaError) throw new Error(turmaError.message);
  if (!turmaData) throw new Error("Turma não encontrada.");
  if (turmaData.professor_id !== input.teacherId) {
    throw new Error("Você não tem permissão para finalizar esta turma.");
  }

  const { error: updateError } = await supabase
    .from("turmas")
    .update({
      status: "finalizada",
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.classId);

  if (updateError) throw new Error(updateError.message);

  revalidatePath("/professores/turmas");
}

export async function addStudentToClass(input: {
  classId: string;
  studentId: string;
  teacherId: string;
}): Promise<void> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== input.teacherId) throw new Error("Acesso inválido.");

  const supabase = await createServerSupabaseClient();

  const { data: turma, error: turmaError } = await supabase
    .from("turmas")
    .select("id, professor_id, status")
    .eq("id", input.classId)
    .single();

  if (turmaError) throw new Error(turmaError.message);
  if (!turma) throw new Error("Turma não encontrada.");
  if (turma.professor_id !== input.teacherId) {
    throw new Error(
      "Você não tem permissão para adicionar alunos nesta turma.",
    );
  }
  if (turma.status === "finalizada") {
    throw new Error("Não é possível adicionar alunos em turma finalizada.");
  }

  const { data: existingStudent } = await supabase
    .from("turma_alunos")
    .select("aluno_id")
    .eq("turma_id", input.classId)
    .eq("aluno_id", input.studentId)
    .single();

  if (existingStudent) {
    throw new Error("Aluno já está vinculado a esta turma.");
  }

  const { error: insertError } = await supabase.from("turma_alunos").insert({
    turma_id: input.classId,
    aluno_id: input.studentId,
    created_at: new Date().toISOString(),
  });

  if (insertError) throw new Error(insertError.message);

  revalidatePath(`/professores/turmas/${input.classId}`);
  revalidatePath("/professores/turmas");
}

export async function removeStudentFromClass(input: {
  classId: string;
  studentId: string;
  teacherId: string;
}): Promise<void> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== input.teacherId) throw new Error("Acesso inválido.");

  const supabase = await createServerSupabaseClient();

  const { data: turma, error: turmaError } = await supabase
    .from("turmas")
    .select("id, professor_id, status")
    .eq("id", input.classId)
    .single();

  if (turmaError) throw new Error(turmaError.message);
  if (!turma) throw new Error("Turma não encontrada.");
  if (turma.professor_id !== input.teacherId) {
    throw new Error("Você não tem permissão para remover alunos desta turma.");
  }
  if (turma.status === "finalizada") {
    throw new Error("Não é possível remover alunos de turma finalizada.");
  }

  const { error: deleteError } = await supabase
    .from("turma_alunos")
    .delete()
    .eq("turma_id", input.classId)
    .eq("aluno_id", input.studentId);

  if (deleteError) throw new Error(deleteError.message);

  revalidatePath(`/professores/turmas/${input.classId}`);
  revalidatePath("/professores/turmas");
}

export async function getClassDetails(input: {
  classId: string;
  teacherId: string;
}): Promise<{
  id: string;
  tag: string;
  start_date: string;
  end_date: string;
  status: "ativa" | "finalizada";
  disciplinaName: string | null;
  students: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== input.teacherId) throw new Error("Acesso inválido.");

  const supabase = await createServerSupabaseClient();

  type TurmaComDisciplinaRow = {
    id: string;
    tag: string;
    start_date: string;
    end_date: string;
    status: string;
    professor_id: string;
    disciplina_id: string;
    disciplinas: { name: string } | { name: string }[];
  };

  const { data: turma, error: turmaError } = await supabase
    .from("turmas")
    .select(
      `
      id,
      tag,
      start_date,
      end_date,
      status,
      professor_id,
      disciplina_id,
      disciplinas:disciplinas!turmas_disciplina_id_fkey(name)
    `,
    )
    .eq("id", input.classId)
    .single();

  if (turmaError) throw new Error(turmaError.message);
  if (!turma) throw new Error("Turma não encontrada.");

  const turmaData = turma as TurmaComDisciplinaRow;
  if (turmaData.professor_id !== input.teacherId) {
    throw new Error("Você não tem permissão para acessar esta turma.");
  }

  const disciplina = Array.isArray(turmaData.disciplinas)
    ? turmaData.disciplinas[0]
    : turmaData.disciplinas;

  const { data: turmaAlunos, error: alunosError } = await supabase
    .from("turma_alunos")
    .select(
      `
      aluno_id,
      profiles:profiles!turma_alunos_aluno_id_fkey(user_id, name, email)
    `,
    )
    .eq("turma_id", input.classId);

  if (alunosError) throw new Error(alunosError.message);

  type TurmaAlunoRow = {
    aluno_id: string;
    profiles:
      | { user_id: string; name: string | null; email: string | null }
      | { user_id: string; name: string | null; email: string | null }[];
  };

  const students = (turmaAlunos ?? []).map((turmaAluno: TurmaAlunoRow) => {
    const profileAluno = Array.isArray(turmaAluno.profiles)
      ? turmaAluno.profiles[0]
      : turmaAluno.profiles;
    return {
      id: turmaAluno.aluno_id,
      name: profileAluno?.name ?? "",
      email: profileAluno?.email ?? "",
    };
  });

  return {
    id: turmaData.id,
    tag: turmaData.tag,
    start_date: turmaData.start_date,
    end_date: turmaData.end_date,
    status: turmaData.status as "ativa" | "finalizada",
    disciplinaName: disciplina?.name ?? null,
    students,
  };
}

export type StudentFromMyClasses = {
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
  }>;
};

export async function listStudentsFromMyClasses(
  teacherId: string,
): Promise<StudentFromMyClasses[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== teacherId) throw new Error("Acesso inválido.");

  const supabase = await createServerSupabaseClient();

  const { data: turmasProfessor, error: turmasError } = await supabase
    .from("turmas")
    .select("id")
    .eq("professor_id", teacherId);

  if (turmasError) {
    if (turmasError.code === "42P01") {
      return [];
    }
    throw new Error(turmasError.message);
  }

  if (!turmasProfessor || turmasProfessor.length === 0) {
    return [];
  }

  const turmaIds = turmasProfessor.map((turma) => turma.id);

  const { data: turmaAlunos, error: alunosError } = await supabase
    .from("turma_alunos")
    .select(
      `
      aluno_id,
      turma_id,
      profiles:profiles!turma_alunos_aluno_id_fkey(
        user_id,
        name,
        email,
        phone
      ),
      alunos:alunos!turma_alunos_aluno_id_fkey(age, date_of_birth),
      turmas:turmas!turma_alunos_turma_id_fkey(id, tag)
    `,
    )
    .in("turma_id", turmaIds);

  if (alunosError) {
    if (alunosError.code === "42P01") {
      return [];
    }
    throw new Error(alunosError.message);
  }

  type TurmaAlunoCompletoRow = {
    aluno_id: string;
    turma_id: string;
    profiles:
      | {
          user_id: string;
          name: string | null;
          email: string | null;
          phone: string | null;
        }
      | {
          user_id: string;
          name: string | null;
          email: string | null;
          phone: string | null;
        }[];
    alunos:
      | { age: number | null; date_of_birth: string | null }
      | { age: number | null; date_of_birth: string | null }[];
    turmas: { id: string; tag: string } | { id: string; tag: string }[];
  };

  const alunosAgrupados = new Map<string, StudentFromMyClasses>();

  (turmaAlunos ?? []).forEach((turmaAluno: TurmaAlunoCompletoRow) => {
    const alunoId = turmaAluno.aluno_id;
    const profileAluno = Array.isArray(turmaAluno.profiles)
      ? turmaAluno.profiles[0]
      : turmaAluno.profiles;
    const dadosAluno = Array.isArray(turmaAluno.alunos)
      ? turmaAluno.alunos[0]
      : turmaAluno.alunos;
    const turma = Array.isArray(turmaAluno.turmas)
      ? turmaAluno.turmas[0]
      : turmaAluno.turmas;

    if (!alunosAgrupados.has(alunoId)) {
      alunosAgrupados.set(alunoId, {
        id: alunoId,
        name: profileAluno?.name ?? "",
        email: profileAluno?.email ?? "",
        telefone: profileAluno?.phone ?? null,
        age: dadosAluno?.age ?? null,
        dateOfBirth: dadosAluno?.date_of_birth ?? null,
        turmas: [],
      });
    }

    const alunoAtual = alunosAgrupados.get(alunoId)!;
    if (turma && !alunoAtual.turmas.find((t) => t.id === turma.id)) {
      alunoAtual.turmas.push({
        id: turma.id,
        name: turma.tag,
        tag: turma.tag,
      });
    }
  });

  return Array.from(alunosAgrupados.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}
