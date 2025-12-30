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

export async function listNoticesForTeacher(teacherId: string) {
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
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== input.teacherId) throw new Error("Acesso inválido.");

  const supabase = await createServerSupabaseClient();

  revalidatePath("/professores/avisos");
}
