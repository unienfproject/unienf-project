"use server";

import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { getUserProfile } from "@/app/_lib/actions/profile";

export type DisciplinaRow = {
  id: string;
  name: string;
  conteudo: string | null;
  created_at: string;
};

export type ProfessorDisciplinaRow = DisciplinaRow & {
  turmaCount: number;
  createdByMe: boolean;
};

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}

export async function createDisciplina(data: {
  name: string;
  conteudo: string;
  curso_id?: string | null;
  workload_hours?: number | null;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );

  const name = data.name.trim();
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const payload = {
    name,
    slug,
    conteudo: data.conteudo.trim(),
    curso_id: data.curso_id ?? null,
    workload_hours: data.workload_hours ?? null,
    created_by: user.id,
  };

  const { error } = await supabaseAdmin.from("disciplinas").insert(payload);

  if (error?.code === "PGRST204" || error?.code === "42703") {
    const fallbackPayload = {
      name: payload.name,
      slug: payload.slug,
      conteudo: payload.conteudo,
      curso_id: payload.curso_id,
      workload_hours: payload.workload_hours,
    };
    const { error: fallbackError } = await supabaseAdmin
      .from("disciplinas")
      .insert(fallbackPayload);

    if (fallbackError) {
      console.error("Erro ao criar disciplina:", fallbackError);
      throw new Error(fallbackError.message);
    }

    revalidatePath("/professores/disciplinas");
    return;
  }

  if (error) {
    console.error("Erro ao criar disciplina:", error);
    throw new Error(error.message);
  }

  revalidatePath("/professores/disciplinas");
}

async function listProfessorDisciplinaIdsFromTurmas(teacherId: string) {
  const supabaseAdmin = getAdminClient();

  const { data, error } = await supabaseAdmin
    .from("turmas")
    .select("disciplina_id")
    .eq("professor_id", teacherId)
    .not("disciplina_id", "is", null);

  if (error) throw new Error(error.message);

  return Array.from(
    new Set((data ?? []).map((row) => String(row.disciplina_id)).filter(Boolean)),
  );
}

export async function listProfessorDisciplinas(): Promise<
  ProfessorDisciplinaRow[]
> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") {
    throw new Error("Sem permissão para listar disciplinas.");
  }

  const supabaseAdmin = getAdminClient();
  const teacherId = profile.user_id;
  const disciplinaIdsFromTurmas =
    await listProfessorDisciplinaIdsFromTurmas(teacherId);

  async function fetchWithCreatedBy() {
    let query = supabaseAdmin
      .from("disciplinas")
      .select("id, name, conteudo, created_at, created_by")
      .order("created_at", { ascending: false });

    if (disciplinaIdsFromTurmas.length > 0) {
      query = query.or(
        `created_by.eq.${teacherId},id.in.(${disciplinaIdsFromTurmas.join(",")})`,
      );
    } else {
      query = query.eq("created_by", teacherId);
    }

    return query;
  }

  const { data, error } = await fetchWithCreatedBy();

  if (error?.code === "PGRST204" || error?.code === "42703") {
    if (disciplinaIdsFromTurmas.length === 0) return [];

    const { data: fallbackData, error: fallbackError } = await supabaseAdmin
      .from("disciplinas")
      .select("id, name, conteudo, created_at")
      .in("id", disciplinaIdsFromTurmas)
      .order("created_at", { ascending: false });

    if (fallbackError) throw new Error(fallbackError.message);

    return (fallbackData ?? []).map((disciplina) => ({
      id: String(disciplina.id),
      name: String(disciplina.name ?? ""),
      conteudo: disciplina.conteudo ?? null,
      created_at: String(disciplina.created_at),
      turmaCount: disciplinaIdsFromTurmas.includes(String(disciplina.id)) ? 1 : 0,
      createdByMe: false,
    }));
  }

  if (error) throw new Error(error.message);

  const turmaCountByDisciplina = new Map<string, number>();
  for (const id of disciplinaIdsFromTurmas) {
    turmaCountByDisciplina.set(id, (turmaCountByDisciplina.get(id) ?? 0) + 1);
  }

  return (data ?? []).map((disciplina) => {
    const id = String(disciplina.id);
    return {
      id,
      name: String(disciplina.name ?? ""),
      conteudo: disciplina.conteudo ?? null,
      created_at: String(disciplina.created_at),
      turmaCount: turmaCountByDisciplina.get(id) ?? 0,
      createdByMe: String(disciplina.created_by ?? "") === teacherId,
    };
  });
}

export async function updateProfessorDisciplinaEmenta(input: {
  disciplinaId: string;
  conteudo: string;
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") {
    throw new Error("Sem permissão para editar ementa.");
  }

  const disciplinaId = String(input.disciplinaId ?? "").trim();
  const conteudo = String(input.conteudo ?? "").trim();

  if (!disciplinaId) throw new Error("Disciplina inválida.");
  if (!conteudo) throw new Error("Ementa é obrigatória.");

  const supabaseAdmin = getAdminClient();
  const disciplinaIdsFromTurmas =
    await listProfessorDisciplinaIdsFromTurmas(profile.user_id);

  const { data: disciplina, error: disciplinaError } = await supabaseAdmin
    .from("disciplinas")
    .select("id, created_by")
    .eq("id", disciplinaId)
    .single();

  if (
    disciplinaError &&
    disciplinaError.code !== "PGRST204" &&
    disciplinaError.code !== "42703"
  ) {
    throw new Error(disciplinaError.message);
  }

  const createdByMe =
    disciplina && String((disciplina as { created_by?: string | null }).created_by ?? "") ===
      profile.user_id;
  const linkedToMyClass = disciplinaIdsFromTurmas.includes(disciplinaId);

  if (!createdByMe && !linkedToMyClass) {
    throw new Error("Você não tem permissão para editar esta ementa.");
  }

  const { error } = await supabaseAdmin
    .from("disciplinas")
    .update({ conteudo })
    .eq("id", disciplinaId);

  if (error) throw new Error(error.message);

  revalidatePath("/professores/disciplinas");
  revalidatePath("/professores/turmas");
}


export async function listDisciplinas(): Promise<DisciplinaRow[]> {
  const supabaseAdmin = getAdminClient();

  const { data, error } = await supabaseAdmin
    .from("disciplinas")
    .select("id, name, conteudo, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao listar disciplinas:", error);
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function updateDisciplina(data: {
  disciplinaId: string;
  name: string;
  conteudo: string;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const supabaseAdmin = getAdminClient();

  const { error } = await supabaseAdmin
    .from("disciplinas")
    .update({
      name: data.name.trim(),
      conteudo: data.conteudo.trim(),
    })
    .eq("id", data.disciplinaId);

  if (error) {
    console.error("Erro ao atualizar disciplina:", error);
    throw new Error(error.message);
  }

  revalidatePath("/professores/disciplinas");
}

export async function deleteDisciplina(disciplinaId: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const supabaseAdmin = getAdminClient();

  const { error } = await supabaseAdmin
    .from("disciplinas")
    .delete()
    .eq("id", disciplinaId);

  if (error) {
    console.error("Erro ao excluir disciplina:", error);
    throw new Error(error.message);
  }

  revalidatePath("/professores/disciplinas");
}

export async function listTurmasByDisciplina(disciplinaId: string): Promise<
  { id: string; name: string }[]
> {
  const supabaseAdmin = getAdminClient();

  /**
   * Pressuposto de schema:
   * tabela: turmas_disciplinas
   *  - turma_id
   *  - disciplina_id
   * relação com turmas (id, name)
   */

  const { data, error } = await supabaseAdmin
    .from("turmas_disciplinas")
    .select(
      `
      turmas (
        id,
        name
      )
    `,
    )
    .eq("disciplina_id", disciplinaId);

  if (error) {
    console.error("Erro ao buscar turmas da disciplina:", error);
    throw new Error(error.message);
  }

  return (
    data
      ?.map((row: any) => row.turmas)
      .filter(Boolean) ?? []
  );
}
