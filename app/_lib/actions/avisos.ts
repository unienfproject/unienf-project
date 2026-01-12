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
      titulo,
      mensagem,
      status,
      created_at,
      target_label,
      created_by,
      profiles:profiles!avisos_created_by_fkey ( name )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("[listAvisos] erro:", error.message);
    return [];
  }

  const rows = (data ?? []) as any[];

  // Contagem de entregas por aviso (se você não tiver a tabela, deixe sempre 0/0 ou ajuste para outro método)
  const avisoIds = rows.map((r) => String(r.id));
  const deliveredMap = new Map<string, number>();

  if (avisoIds.length) {
    const { data: entregas, error: entregasErr } = await supabase
      .from("aviso_entregas")
      .select("aviso_id", { count: "exact" })
      .in("aviso_id", avisoIds);

    // Se o select acima não funcionar no seu schema, a alternativa é:
    // .select("aviso_id") e depois contar em memória.
    if (entregasErr) {
      console.warn("[listAvisos] entregas erro:", entregasErr.message);
    } else {
      // Quando o PostgREST não retorna "count" por grupo, contamos manualmente
      for (const e of (entregas ?? []) as any[]) {
        const id = String(e.aviso_id);
        deliveredMap.set(id, (deliveredMap.get(id) ?? 0) + 1);
      }
    }
  }

  // Total de destinatários: se você tiver uma tabela de targets (ex: aviso_targets), você calcula aqui.
  // Por enquanto deixo totalTargets como deliveredCount para não “inventar” números.
  return rows.map((r) => {
    const profile = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
    const id = String(r.id);
    const deliveredCount = deliveredMap.get(id) ?? 0;

    return {
      id,
      titulo: String(r.titulo ?? ""),
      mensagem: String(r.mensagem ?? ""),
      status: (r.status as AvisoStatus) ?? "enviado",
      createdAt: String(r.created_at ?? ""),
      createdByName: profile?.name ? String(profile.name) : null,
      targetLabel: r.target_label ? String(r.target_label) : null,
      deliveredCount,
      totalTargets: deliveredCount, // ajuste quando você tiver a fonte real do total
    };
  });
}
