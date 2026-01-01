"use server";

import { logAudit } from "@/app/_lib/actions/audit";
import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCurso(input: {
  name: string;
  description?: string | null;
  durationMonths?: number | null;
}): Promise<{ cursoId: string }> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "administrativo") {
    throw new Error("Sem permissão para cadastrar cursos.");
  }

  const supabase = await createServerSupabaseClient();

  const name = input.name.trim();
  if (!name) throw new Error("Nome do curso é obrigatório.");

  const { data: curso, error } = await supabase
    .from("cursos")
    .insert({
      name,
      description: input.description?.trim() || null,
      duration_months: input.durationMonths || null,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  if (!curso) throw new Error("Falha ao criar curso.");

  await logAudit({
    action: "create",
    entity: "turma",
    entityId: curso.id,
    newValue: {
      name,
      description: input.description,
      duration_months: input.durationMonths,
    },
    description: `Curso ${name} criado`,
  });

  revalidatePath("/admin/cursos");
  return { cursoId: curso.id };
}

export type CursoRow = {
  id: string;
  name: string;
  description: string | null;
  durationMonths: number | null;
  active: boolean;
  createdAt: string;
};

export async function listCursos(): Promise<CursoRow[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("cursos")
    .select("id, name, description, duration_months, active, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    durationMonths: c.duration_months,
    active: c.active,
    createdAt: c.created_at,
  }));
}
