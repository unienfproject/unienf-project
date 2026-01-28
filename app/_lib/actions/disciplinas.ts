"use server";

import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

export type DisciplinaRow = {
  id: string;
  name: string;
  conteudo: string | null;
  created_at: string;
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

  const { error } = await supabaseAdmin.from("disciplinas").insert({
    name,
    slug,
    conteudo: data.conteudo.trim(),
    curso_id: data.curso_id ?? null,
    workload_hours: data.workload_hours ?? null,
  });

  if (error) {
    console.error("Erro ao criar disciplina:", error);
    throw new Error(error.message);
  }

  revalidatePath("/professores/disciplinas");
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
