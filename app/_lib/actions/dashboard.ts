"use server";

import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export type DashboardStats = {
  totalAlunos: number;
  totalProfessores: number;
  turmasAtivas: number;
  documentosPendentes: number;
};

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createAdminClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

export async function getDashboardStats(): Promise<DashboardStats> {
  // 1) valida sessão e role do chamador (com client normal, respeitando auth)
  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) throw new Error("Sessão inválida.");

  const { data: callerProfile, error: callerErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", authData.user.id)
    .single();

  if (callerErr) throw new Error(callerErr.message);
  if (!callerProfile || callerProfile.role !== "administrativo") {
    throw new Error("Apenas administrativo pode ver métricas.");
  }

  // 2) usa service role para contagens (não depende de RLS)
  const admin = getAdminSupabase();

  const [alunosCount, profCount, turmasAtivasCount, docsPendentesCount] =
    await Promise.all([
      admin
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "aluno"),

      admin
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "professor"),

      admin
        .from("turmas")
        .select("*", { count: "exact", head: true })
        .eq("status", "ativa"),

      admin
        .from("documentos_aluno")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
    ]);

  // Se algum der erro, melhor explodir com mensagem clara
  if (alunosCount.error) throw new Error(alunosCount.error.message);
  if (profCount.error) throw new Error(profCount.error.message);
  if (turmasAtivasCount.error) throw new Error(turmasAtivasCount.error.message);
  if (docsPendentesCount.error)
    throw new Error(docsPendentesCount.error.message);

  return {
    totalAlunos: alunosCount.count ?? 0,
    totalProfessores: profCount.count ?? 0,
    turmasAtivas: turmasAtivasCount.count ?? 0,
    documentosPendentes: docsPendentesCount.count ?? 0,
  };
}
