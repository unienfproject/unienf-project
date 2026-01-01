"use server";

import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { revalidatePath } from "next/cache";

type PickerItem = { id: string; label: string };

export type NoticeRow = {
  id: string;
  title: string;
  message: string;
  created_at: string; // ISO
  author_role: "professor" | "coordenação" | "administrativo";
  author_name: string;
  audience:
    | { type: "turma"; classId: string; classLabel: string }
    | { type: "alunos"; studentCount: number };
};

export async function listNoticesForTeacher(
  teacherId: string,
): Promise<NoticeRow[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== teacherId) throw new Error("Acesso inválido.");

  const supabase = await createServerSupabaseClient();

  return [];
}

export async function listTeacherClassesForPicker(
  teacherId: string,
): Promise<PickerItem[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== teacherId) throw new Error("Acesso inválido.");

  const supabase = await createServerSupabaseClient();

  return [];
}

export async function listStudentsForPicker(): Promise<PickerItem[]> {
  const supabase = await createServerSupabaseClient();

  return [];
}

export async function createNotice(input: {
  teacherId: string;
  title: string;
  message: string;
  target:
    | { type: "turma"; classId: string }
    | { type: "alunos"; studentIds: string[] };
}): Promise<{ avisoId: string }> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== input.teacherId) throw new Error("Acesso inválido.");

  const supabase = await createServerSupabaseClient();

  const { data: aviso, error: avisoError } = await supabase
    .from("avisos")
    .insert({
      title: input.title.trim(),
      message: input.message.trim(),
      author_id: profile.user_id,
      scope_type: input.target.type,
      turma_id: input.target.type === "turma" ? input.target.classId : null,
      created_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (avisoError) throw new Error(avisoError.message);
  if (!aviso) throw new Error("Falha ao criar aviso.");

  if (input.target.type === "alunos") {
    if (input.target.studentIds.length > 0) {
      const avisoAlunos = input.target.studentIds.map((alunoId) => ({
        aviso_id: aviso.id,
        aluno_id: alunoId,
      }));

      const { error } = await supabase.from("aviso_alunos").insert(avisoAlunos);
      if (error) throw new Error(error.message);
    }
  }

  revalidatePath("/professores/avisos");
  return { avisoId: aviso.id };
}

export async function createAvisoAdmin(input: {
  title: string;
  message: string;
  target:
    | { type: "turma"; classId: string }
    | { type: "alunos"; studentIds: string[] };
}): Promise<{ avisoId: string }> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "administrativo") {
    throw new Error("Sem permissão para criar avisos.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: aviso, error: avisoError } = await supabase
    .from("avisos")
    .insert({
      title: input.title.trim(),
      message: input.message.trim(),
      author_id: profile.user_id,
      scope_type: input.target.type,
      turma_id: input.target.type === "turma" ? input.target.classId : null,
      created_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (avisoError) throw new Error(avisoError.message);
  if (!aviso) throw new Error("Falha ao criar aviso.");

  if (input.target.type === "alunos") {
    if (input.target.studentIds.length > 0) {
      const avisoAlunos = input.target.studentIds.map((alunoId) => ({
        aviso_id: aviso.id,
        aluno_id: alunoId,
      }));

      const { error } = await supabase.from("aviso_alunos").insert(avisoAlunos);
      if (error) throw new Error(error.message);
    }
  }

  revalidatePath("/admin/avisos");
  return { avisoId: aviso.id };
}
