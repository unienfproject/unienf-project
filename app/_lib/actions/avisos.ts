"use server";

import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";

type PickerItem = { id: string; label: string };

export async function listTurmasForAvisoPicker(): Promise<PickerItem[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("turmas")
    .select("id, name, tag")
    .eq("status", "ativa")
    .order("name");

  if (error) throw new Error(error.message);

  return (data ?? []).map((t) => ({
    id: t.id,
    label: `${t.name} (${t.tag})`,
  }));
}

export async function listAlunosForAvisoPicker(): Promise<PickerItem[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, name, email")
    .eq("role", "aluno")
    .order("name");

  if (error) throw new Error(error.message);

  return (data ?? []).map((p) => ({
    id: p.user_id,
    label: p.name ?? p.email ?? p.user_id,
  }));
}

export type AvisoStatus = "enviado" | "falhou" | "rascunho";

export type AvisoListRow = {
  id: string;
  titulo: string;
  mensagem: string;
  status: AvisoStatus;
  createdAt: string;
  createdByName: string | null;
  targetLabel: string | null;
  deliveredCount: number;
  totalTargets: number;
};

async function requireAllowedRoles() {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const role = profile.role ?? "";
  const allowed = ["administrativo", "coordenação", "recepção", "professor"];
  if (!allowed.includes(role)) throw new Error("Sem permissão.");

  return profile;
}

export async function listAvisos(): Promise<AvisoListRow[]> {
  await requireAllowedRoles();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("avisos")
    .select(
      `
      id,
      title,
      message,
      created_at,
      scope_type,
      turma_id,
      author_id,
      profiles:profiles!avisos_author_id_fkey ( name )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("[listAvisos] erro:", error.message);
    return [];
  }

  type AvisoRow = {
    id: unknown;
    title: unknown;
    message: unknown;
    created_at: unknown;
    scope_type: unknown;
    turma_id: unknown;
    author_id: unknown;
    profiles: { name: unknown } | { name: unknown }[] | null;
  };

  const rows = (data ?? []) as AvisoRow[];

  const targetCountMap = new Map<string, number>();

  for (const aviso of rows) {
    const id = String(aviso.id);
    if (aviso.scope_type === "turma" && aviso.turma_id) {
      const { count } = await supabase
        .from("turma_alunos")
        .select("*", { count: "exact", head: true })
        .eq("turma_id", aviso.turma_id);
      targetCountMap.set(id, count ?? 0);
    } else if (aviso.scope_type === "alunos") {
      const { count } = await supabase
        .from("aviso_alunos")
        .select("*", { count: "exact", head: true })
        .eq("aviso_id", id);
      targetCountMap.set(id, count ?? 0);
    } else {
      targetCountMap.set(id, 0);
    }
  }

  return rows.map((r) => {
    const profile = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
    const id = String(r.id);
    const totalTargets = targetCountMap.get(id) ?? 0;

    let targetLabel: string | null = null;
    if (r.scope_type === "turma" && r.turma_id) {
      targetLabel = `Turma: ${String(r.turma_id)}`;
    } else if (r.scope_type === "alunos") {
      targetLabel = "Todos os alunos";
    }

    return {
      id,
      titulo: String(r.title ?? ""),
      mensagem: String(r.message ?? ""),
      status: "enviado" as AvisoStatus,
      createdAt: String(r.created_at ?? ""),
      createdByName: profile?.name ? String(profile.name) : null,
      targetLabel,
      deliveredCount: totalTargets,
      totalTargets,
    };
  });
}
