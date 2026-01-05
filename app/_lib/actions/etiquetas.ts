"use server";

import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { revalidatePath } from "next/cache";

export type Etiqueta = {
  id: string;
  name: string;
  color?: string | null;
  created_at: string;
};

export async function listEtiquetas(): Promise<Etiqueta[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("etiquetas")
    .select("id, name, color, created_at")
    .order("name", { ascending: true });

  if (error) {
    if (error.code === "42P01") {
      return [];
    }
    throw new Error(error.message);
  }

  return (data ?? []).map((e) => ({
    id: e.id,
    name: e.name,
    color: e.color,
    created_at: e.created_at,
  }));
}

export async function listEtiquetasDoAluno(
  studentId: string,
): Promise<Etiqueta[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("aluno_etiquetas")
    .select(
      `
      etiqueta_id,
      etiquetas:etiquetas!aluno_etiquetas_etiqueta_id_fkey(id, name, color, created_at)
    `,
    )
    .eq("aluno_id", studentId);

  if (error) {
    if (error.code === "42P01") {
      return [];
    }
    throw new Error(error.message);
  }

  const etiquetas: Etiqueta[] = [];

  for (const ae of data ?? []) {
    const etiqueta = Array.isArray(ae.etiquetas)
      ? ae.etiquetas[0]
      : ae.etiquetas;
    if (etiqueta) {
      etiquetas.push({
        id: etiqueta.id,
        name: etiqueta.name,
        color: etiqueta.color,
        created_at: etiqueta.created_at,
      });
    }
  }

  return etiquetas;
}

export async function atribuirEtiquetaAoAluno(input: {
  studentId: string;
  etiquetaId: string;
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "recepção" && profile.role !== "administrativo") {
    throw new Error("Sem permissão para atribuir etiquetas.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: etiqueta, error: etiquetaError } = await supabase
    .from("etiquetas")
    .select("id, name")
    .eq("id", input.etiquetaId)
    .single();

  if (etiquetaError) throw new Error("Etiqueta não encontrada.");
  if (!etiqueta) throw new Error("Etiqueta não encontrada.");

  const { data: existing, error: checkError } = await supabase
    .from("aluno_etiquetas")
    .select("id")
    .eq("aluno_id", input.studentId)
    .eq("etiqueta_id", input.etiquetaId)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    throw new Error(checkError.message);
  }

  if (existing) {
    return;
  }

  const { error: insertError } = await supabase.from("aluno_etiquetas").insert({
    aluno_id: input.studentId,
    etiqueta_id: input.etiquetaId,
    created_at: new Date().toISOString(),
  });

  if (insertError) {
    if (insertError.code === "42P01") {
      throw new Error(
        "Tabela aluno_etiquetas não existe. Crie a tabela no Supabase primeiro.",
      );
    }
    throw new Error(insertError.message);
  }

  revalidatePath(`/recepcao/alunos`);
  revalidatePath(`/dashboard/alunos/${input.studentId}`);
}

export async function removerEtiquetaDoAluno(input: {
  studentId: string;
  etiquetaId: string;
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "recepção" && profile.role !== "administrativo") {
    throw new Error("Sem permissão para remover etiquetas.");
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("aluno_etiquetas")
    .delete()
    .eq("aluno_id", input.studentId)
    .eq("etiqueta_id", input.etiquetaId);

  if (error) {
    if (error.code === "42P01") {
      throw new Error(
        "Tabela aluno_etiquetas não existe. Crie a tabela no Supabase primeiro.",
      );
    }
    throw new Error(error.message);
  }

  revalidatePath(`/recepcao/alunos`);
  revalidatePath(`/dashboard/alunos/${input.studentId}`);
}
