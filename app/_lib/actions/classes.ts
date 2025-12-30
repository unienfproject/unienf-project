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

  return [];
}

export async function listStudentsForPicker(): Promise<PickerItem[]> {
  const supabase = await createServerSupabaseClient();

  return [];
}

export async function createClass(input: {
  teacherId: string;
  name: string;
  tag: string;
  startDate: string;
  endDate: string;
  subjectIds: string[];
  studentIds: string[];
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== input.teacherId) throw new Error("Acesso inválido.");

  const supabase = await createServerSupabaseClient();

  revalidatePath("/professores/turmas");
}

export async function finalizeClass(input: {
  classId: string;
  teacherId: string;
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== input.teacherId) throw new Error("Acesso inválido.");

  const supabase = await createServerSupabaseClient();

  revalidatePath("/professores/turmas");
}
