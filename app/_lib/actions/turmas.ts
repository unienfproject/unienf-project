"use server";

import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import type { PaginatedResult } from "@/app/_lib/actions/pagination";

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
      name: t.tag,
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
        start_date,
        end_date,
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

  const items: TurmaRow[] = (data ?? []).map((r: any) => {
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
      startDate: String(r.start_date ?? ""),
      endDate: String(r.end_date ?? ""),
      status: String(r.status ?? ""),
      disciplinaName: disc?.name ?? null,
      professorName: prof?.name ?? null,
      createdAt: String(r.created_at ?? ""),
    };
  });

  return { items, total, page, pageSize, totalPages };
}
