"use server";

import { createServerSupabaseClient } from "@/app/_lib/supabase/server";

export type RegistrationStats = {
  label: string;
  count: number;
};

export type DashboardStats = {
  totalAlunos: number;
  turmasAtivas: number;
  totalProfessores: number;
  documentosPendentes: number;
};

export async function DashboardStats(): Promise<DashboardStats> {
  const supabase = await createServerSupabaseClient();

  const [
    { count: totalAlunos },
    { count: turmasAtivas },
    { count: totalProfessores },
    { count: documentosPendentes },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "aluno"),
    supabase
      .from("turmas")
      .select("*", { count: "exact", head: true })
      .eq("status", "ativa"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "professor"),
    supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  return {
    totalAlunos: totalAlunos ?? 0,
    turmasAtivas: turmasAtivas ?? 0,
    totalProfessores: totalProfessores ?? 0,
    documentosPendentes: documentosPendentes ?? 0,
  };
}

export async function getStudentRegistrationsStats(
  from: Date,
  to: Date,
): Promise<RegistrationStats[]> {
  const supabase = await createServerSupabaseClient();

  const toISO = new Date(to);
  toISO.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("profiles")
    .select("created_at")
    .eq("role", "aluno")
    .gte("created_at", from.toISOString())
    .lte("created_at", toISO.toISOString())
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  const statsMap = new Map<string, number>();

  const current = new Date(from);
  current.setDate(1);
  const end = new Date(to);
  end.setDate(1);

  while (current <= end) {
    const month = current.getMonth() + 1;
    const year = current.getFullYear();
    const key = `${String(month).padStart(2, "0")}/${year}`;
    statsMap.set(key, 0);
    current.setMonth(current.getMonth() + 1);
  }

  (data ?? []).forEach((p) => {
    const d = new Date(p.created_at);
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const key = `${String(month).padStart(2, "0")}/${year}`;
    if (statsMap.has(key)) {
      statsMap.set(key, (statsMap.get(key) || 0) + 1);
    }
  });

  return Array.from(statsMap.entries()).map(([label, count]) => ({
    label,
    count,
  }));
}