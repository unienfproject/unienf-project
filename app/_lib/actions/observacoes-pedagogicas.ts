"use server";

import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";

export type ObservacaoPedagogica = {
  id: string;
  aluno_id: string;
  autor_id: string;
  autor_name: string;
  autor_role: string;
  conteudo: string;
  created_at: string;
  updated_at: string;
};

export async function listObservacoesPedagogicasDoAluno(
  studentId: string,
): Promise<ObservacaoPedagogica[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("observacoes_pedagogicas")
    .select(
      `
      id,
      aluno_id,
      autor_id,
      conteudo,
      created_at,
      updated_at,
      autor:profiles!observacoes_pedagogicas_autor_id_fkey(name, role)
    `,
    )
    .eq("aluno_id", studentId)
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === "42P01") {
      return [];
    }
    throw new Error(error.message);
  }

  return (data ?? []).map((obs: any) => {
    const autor = Array.isArray(obs.autor) ? obs.autor[0] : obs.autor;
    return {
      id: obs.id,
      aluno_id: obs.aluno_id,
      autor_id: obs.autor_id,
      autor_name: autor?.name ?? "Desconhecido",
      autor_role: autor?.role ?? "desconhecido",
      conteudo: obs.conteudo,
      created_at: obs.created_at,
      updated_at: obs.updated_at,
    };
  });
}

export async function canEditObservacoesPedagogicas(): Promise<boolean> {
  const profile = await getUserProfile();
  if (!profile) return false;

  return (
    profile.role === "coordenação" || profile.role === "administrativo"
  );
}

