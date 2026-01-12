"use server";

import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";

export type MensalidadeStatus = "pendente" | "pago";
export type FormaPagamento = "dinheiro" | "pix" | "debito" | "credito";

export type MensalidadeRow = {
  id: string;
  studentId: string;
  studentName: string;

  competenceYear: number;
  competenceMonth: number;

  status: MensalidadeStatus;

  valor_mensalidade: number;

  valorPago: number | null;
  formaPagamento: FormaPagamento | null;

  dataPagamento: string | null;
};

export type MonthlySummary = {
  year: number;
  month: number;
  totalPaid: number;
  prevMonthTotalPaid: number;
  delta: number;
  deltaPct: number | null;
};

export type Cost = {
  id: string;
  category: string;
  description: string;
  amount: number;
  incurredAt: string;
};

type FinanceiroEntry = {
  id: string;
  type: "entrada" | "saida";
  description: string;
  amount: number;
  occurredAt: string;
};

async function requireAdmin() {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "administrativo") {
    throw new Error("Sem permissão para ver Financeiro.");
  }
  return profile;
}

function safeNumber(v: unknown, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function prevYearMonth(year: number, month: number) {
  if (month <= 1) return { year: year - 1, month: 12 };
  return { year, month: month - 1 };
}

/**
 * ENTRADAS: por padrão, usa a própria tabela mensalidades (valor_pago),
 * filtrando competence_year/month. É a forma mais simples e consistente com seu schema atual.
 */
export async function getMonthlySummary(
  year: number,
  month: number,
): Promise<MonthlySummary> {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();

  async function sumPaid(y: number, m: number) {
    const { data, error } = await supabase
      .from("mensalidades")
      .select("valor_pago, status")
      .eq("competence_year", y)
      .eq("competence_month", m);

    if (error) {
      // Se tabela/coluna não existir ou RLS bloquear, você vai ver aqui.
      // Mantém resiliente sem quebrar a página.
      console.warn("[getMonthlySummary] erro:", error.message);
      return 0;
    }

    const rows = data ?? [];
    return rows.reduce((acc, r) => {
      // conta só o que está pago; se você quiser somar qualquer valor_pago != null, ajuste aqui.
      if (r.status !== "pago") return acc;
      return acc + safeNumber(r.valor_pago, 0);
    }, 0);
  }

  const totalPaid = await sumPaid(year, month);

  const prev = prevYearMonth(year, month);
  const prevMonthTotalPaid = await sumPaid(prev.year, prev.month);

  const delta = totalPaid - prevMonthTotalPaid;
  const deltaPct =
    prevMonthTotalPaid > 0 ? (delta / prevMonthTotalPaid) * 100 : null;

  return {
    year,
    month,
    totalPaid,
    prevMonthTotalPaid,
    delta,
    deltaPct,
  };
}

/**
 * CUSTOS INTERNOS: aqui estou assumindo uma tabela chamada "costs".
 * Se no seu banco o nome for "custos" (muito provável), troque .from("costs") para .from("custos")
 * e ajuste os nomes de colunas conforme seu schema.
 */
export async function getCostsByMonth(
  year: number,
  month: number,
): Promise<Cost[]> {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();

  // Ajuste aqui o nome da tabela se necessário: "custos" / "finance_costs" etc.
  const { data, error } = await supabase
    .from("custos")
    .select(
      "id, competence_year, competence_month, category, description, amount, incurred_at",
    )
    .eq("competence_year", year)
    .eq("competence_month", month)
    .order("incurred_at", { ascending: false });

  if (error) {
    if (error.code === "42P01") return []; // tabela não existe
    console.warn("[getCostsByMonth] erro:", error.message);
    return [];
  }

  return (data ?? []).map((c: any) => ({
    id: String(c.id),
    category: String(c.category ?? ""),
    description: String(c.description ?? ""),
    amount: safeNumber(c.amount, 0),
    incurredAt: String(c.incurred_at ?? ""),
  }));
}

/**
 * MENSALIDADES DO MÊS: lista + nome do aluno. Aqui assumo mensalidades.aluno_id
 * e join em profiles para pegar name.
 * Se seu FK/relationship tiver outro nome, ajuste o select.
 */
export async function getMensalidadesByMonth(
  year: number,
  month: number,
): Promise<MensalidadeRow[]> {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("mensalidades")
    .select(
      `
      id,
      aluno_id,
      competence_year,
      competence_month,
      status,
      valor_mensalidade,
      valor_pago,
      data_pagamento,
      profiles:profiles!mensalidades_aluno_id_fkey ( name )
    `,
    )
    .eq("competence_year", year)
    .eq("competence_month", month)
    .order("status", { ascending: true });

  if (error) {
    console.warn("[getMensalidadesByMonth] erro:", error.message);
    return [];
  }

  // Para formaPagamento: buscamos a forma mais recente em pagamentos por mensalidade_id
  const mensalidadeIds = (data ?? []).map((m: any) => String(m.id));
  let formaMap = new Map<string, FormaPagamento | null>();

  if (mensalidadeIds.length) {
    const { data: pagamentos, error: payErr } = await supabase
      .from("pagamentos")
      .select("mensalidade_id, forma_pagamento, created_at")
      .in("mensalidade_id", mensalidadeIds)
      .order("created_at", { ascending: false });

    if (!payErr && pagamentos) {
      for (const p of pagamentos as any[]) {
        const mid = String(p.mensalidade_id);
        if (!formaMap.has(mid)) {
          formaMap.set(mid, (p.forma_pagamento as FormaPagamento) ?? null);
        }
      }
    }
  }

  return (data ?? []).map((m: any) => {
    const profile = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
    return {
      id: String(m.id),
      studentId: String(m.aluno_id),
      studentName: String(profile?.name ?? "Aluno"),
      competenceYear: safeNumber(m.competence_year),
      competenceMonth: safeNumber(m.competence_month),
      status: (m.status as MensalidadeStatus) ?? "pendente",
      valor_mensalidade: safeNumber(m.valor_mensalidade),
      valorPago: m.valor_pago == null ? null : safeNumber(m.valor_pago),
      formaPagamento: formaMap.get(String(m.id)) ?? null,
      dataPagamento: (m.data_pagamento ?? null) as string | null,
    };
  });
}

/**
 * OUTRAS MOVIMENTAÇÕES (opcional): se você tem uma tabela "financeiro" para outras receitas/despesas.
 * Se não tiver, pode manter retornando [] sem problema.
 */
export async function getFinanceiroEntriesByMonth(
  year: number,
  month: number,
): Promise<FinanceiroEntry[]> {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("financeiro")
    .select(
      "id, competence_year, competence_month, type, description, amount, occurred_at",
    )
    .eq("competence_year", year)
    .eq("competence_month", month)
    .order("occurred_at", { ascending: false });

  if (error) {
    if (error.code === "42P01") return [];
    console.warn("[getFinanceiroEntriesByMonth] erro:", error.message);
    return [];
  }

  return (data ?? []).map((r: any) => ({
    id: String(r.id),
    type: (r.type as "entrada" | "saida") ?? "entrada",
    description: String(r.description ?? ""),
    amount: safeNumber(r.amount, 0),
    occurredAt: String(r.occurred_at ?? ""),
  }));
}
