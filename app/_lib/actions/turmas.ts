"use server";

import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";

type PickerItem = { id: string; label: string };

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
  startDate: string;
  endDate: string;
  status: string;
  disciplinaName: string | null;
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
      name,
      tag,
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
      name: t.name,
      tag: t.tag,
      startDate: t.start_date,
      endDate: t.end_date,
      status: t.status,
      disciplinaName: disciplina?.name || null,
      professorName: profile?.name || null,
      createdAt: t.created_at,
    };
  });
}
