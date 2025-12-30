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

  return [];
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

  const { data: turma, error: turmaError } = await supabase
    .from("turmas")
    .insert({
      name: input.name.trim(),
      tag: input.tag.trim(),
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

  const { data: turma, error: turmaError } = await supabase
    .from("turmas")
    .insert({
      name: input.name.trim(),
      tag: input.tag.trim(),
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

  revalidatePath("/professores/turmas");
}
