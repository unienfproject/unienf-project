"use server";

import { logAudit } from "@/app/_lib/actions/audit";
import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { PaginatedResult } from "@/app/_lib/actions/pagination";

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

export async function updateCurso(input: {
  id: string;
  name: string;
  description?: string | null;
  durationMonths?: number | null;
}): Promise<void> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessao invalida.");
  if (profile.role !== "administrativo") {
    throw new Error("Sem permissao para atualizar cursos.");
  }

  const supabase = await createServerSupabaseClient();

  const name = input.name.trim();
  if (!name) throw new Error("Nome do curso e obrigatorio.");

  const payload = {
    name,
    description: input.description?.trim() || null,
    duration_months: input.durationMonths ?? null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("cursos")
    .update(payload)
    .eq("id", input.id);

  if (error) throw new Error(error.message);

  await logAudit({
    action: "update",
    entity: "turma",
    entityId: input.id,
    newValue: payload,
    description: `Curso ${name} atualizado`,
  });

  revalidatePath("/admin/cursos");
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

export async function listCursosPaginated(params: {
  page: number;
  pageSize: number;
  search?: string;
}): Promise<PaginatedResult<CursoRow>> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const allowedRoles = ["recepção", "administrativo", "coordenação"];
  const role = profile.role ?? "";
  if (!allowedRoles.includes(role)) {
    throw new Error("Sem permissão para listar cursos.");
  }

  const supabase = await createServerSupabaseClient();

  const page = Math.max(1, params.page);
  const pageSize = Math.min(50, Math.max(1, params.pageSize));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const search = params.search?.trim();
  const orFilter = search
    ? `name.ilike.%${search}%,description.ilike.%${search}%`
    : null;

  // COUNT
  let countQuery = supabase
    .from("cursos")
    .select("*", { count: "exact", head: true });

  if (orFilter) countQuery = countQuery.or(orFilter);

  const { count, error: countError } = await countQuery;
  if (countError) throw new Error(countError.message);

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // DATA
  let dataQuery = supabase
    .from("cursos")
    .select("id, name, description, duration_months, created_at")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (orFilter) dataQuery = dataQuery.or(orFilter);

  const { data, error } = await dataQuery;
  if (error) throw new Error(error.message);

  const items: CursoRow[] = (data ?? []).map((r: any) => ({
    id: String(r.id),
    name: r.name ?? null,
    description: r.description ?? null,
    durationMonths: r.duration_months ?? null,
  }));

  return { items, total, page, pageSize, totalPages };
}
