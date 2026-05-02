"use server";

import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { revalidatePath } from "next/cache";

export type MensalidadeStatus = "pendente" | "pago";
export type FormaPagamento = "dinheiro" | "pix" | "debito" | "credito";

export type MensalidadeRow = {
  id: string;
  studentId: string;
  studentName: string;
  turmaId?: string | null;
  turmaTag?: string | null;
  disciplinaName?: string | null;

  competenceYear: number;
  competenceMonth: number;

  status: MensalidadeStatus;

  valor_mensalidade: number;

  valorPago: number | null;
  valorFaltante: number;
  formaPagamento: FormaPagamento | null;

  dataVencimento: string | null;
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

type CostRow = {
  id: unknown;
  category: unknown;
  description: unknown;
  amount: unknown;
  incurred_at: unknown;
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

function assertCompetence(year: number, month: number) {
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    throw new Error("Ano de competencia invalido.");
  }

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error("Mes de competencia invalido.");
  }
}

function isValidYYYYMMDD(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function dateOnly(date: Date) {
  return startOfDay(date).toISOString().slice(0, 10);
}

function assertValidDateRange(from: Date, to: Date) {
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    throw new Error("Periodo invalido.");
  }

  if (startOfDay(to) < startOfDay(from)) {
    throw new Error("Data final nao pode ser anterior a data inicial.");
  }
}

function previousRange(from: Date, to: Date) {
  const start = startOfDay(from);
  const end = endOfDay(to);
  const rangeMs = end.getTime() - start.getTime() + 1;
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - rangeMs + 1);

  return { from: prevStart, to: prevEnd };
}

/**
 * ENTRADAS: soma os valores de pagamentos relacionados a mensalidades
 * da competência especificada.
 */
export async function getMonthlySummary(
  year: number,
  month: number,
): Promise<MonthlySummary> {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();

  async function sumPaid(y: number, m: number) {
    // Buscar mensalidades da competência
    const { data: mensalidades, error: mensalidadesError } = await supabase
      .from("mensalidades")
      .select("id, status")
    .eq("competence_year", y)
      .eq("competence_month", m)
      .neq("status", "cancelado");

    if (mensalidadesError) {
      console.warn("[getMonthlySummary] erro:", mensalidadesError.message);
      return 0;
    }

    if (!mensalidades || mensalidades.length === 0) {
      return 0;
    }

    const mensalidadeIds = mensalidades.map((m) => m.id);

    if (mensalidadeIds.length === 0) {
      return 0;
    }

    const { data: pagamentos, error: pagamentosError } = await supabase
      .from("pagamentos")
      .select("amount_paid")
      .in("mensalidade_id", mensalidadeIds);

    if (pagamentosError) {
      console.warn("[getMonthlySummary] erro pagamentos:", pagamentosError.message);
      return 0;
    }

    return (pagamentos ?? []).reduce((acc, p) => {
      return acc + safeNumber(p.amount_paid, 0);
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

export async function getFinancialSummaryByRange(
  from: Date,
  to: Date,
): Promise<MonthlySummary> {
  await requireAdmin();
  assertValidDateRange(from, to);

  const supabase = await createServerSupabaseClient();

  async function sumPaid(rangeFrom: Date, rangeTo: Date) {
    const { data, error } = await supabase
      .from("pagamentos")
      .select("mensalidade_id, amount_paid")
      .gte("paid_at", startOfDay(rangeFrom).toISOString())
      .lte("paid_at", endOfDay(rangeTo).toISOString());

    if (error) {
      console.warn("[getFinancialSummaryByRange] erro:", error.message);
      return 0;
    }

    const pagamentos = (data ?? []) as {
      mensalidade_id: unknown;
      amount_paid: unknown;
    }[];
    const mensalidadeIds = Array.from(
      new Set(pagamentos.map((p) => String(p.mensalidade_id))),
    );

    if (!mensalidadeIds.length) return 0;

    const { data: mensalidades, error: mensalidadesError } = await supabase
      .from("mensalidades")
      .select("id, status")
      .in("id", mensalidadeIds);

    if (mensalidadesError) {
      console.warn(
        "[getFinancialSummaryByRange] erro mensalidades:",
        mensalidadesError.message,
      );
      return 0;
    }

    const activeMensalidadeIds = new Set(
      (mensalidades ?? [])
        .filter((m: { status: unknown }) => m.status !== "cancelado")
        .map((m: { id: unknown }) => String(m.id)),
    );

    return pagamentos.reduce((acc, row) => {
      if (!activeMensalidadeIds.has(String(row.mensalidade_id))) return acc;
      return acc + safeNumber(row.amount_paid, 0);
    }, 0);
  }

  const totalPaid = await sumPaid(from, to);
  const prev = previousRange(from, to);
  const prevMonthTotalPaid = await sumPaid(prev.from, prev.to);
  const delta = totalPaid - prevMonthTotalPaid;
  const deltaPct =
    prevMonthTotalPaid > 0 ? (delta / prevMonthTotalPaid) * 100 : null;

  return {
    year: to.getFullYear(),
    month: to.getMonth() + 1,
    totalPaid,
    prevMonthTotalPaid,
    delta,
    deltaPct,
  };
}

export async function getCostsByMonth(
  year: number,
  month: number,
): Promise<Cost[]> {
  await requireAdmin();
  assertCompetence(year, month);

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("custos_internos")
    .select("id, category, description, amount, incurred_at")
    .eq("competence_year", year)
    .eq("competence_month", month)
    .order("incurred_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    if (
      error.code === "42P01" ||
      error.code === "PGRST205" ||
      error.message.includes("schema cache")
    ) {
      console.warn(
        "[getCostsByMonth] tabela custos_internos nao encontrada. Execute a migration 2026-05-02_create_custos_internos.sql.",
      );
      return [];
    }

    throw new Error(error.message);
  }

  return ((data ?? []) as CostRow[]).map((row) => ({
    id: String(row.id),
    category: String(row.category ?? ""),
    description: String(row.description ?? ""),
    amount: safeNumber(row.amount),
    incurredAt: String(row.incurred_at ?? ""),
  }));
}

export async function getCostsByRange(from: Date, to: Date): Promise<Cost[]> {
  await requireAdmin();
  assertValidDateRange(from, to);

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("custos_internos")
    .select("id, category, description, amount, incurred_at")
    .gte("incurred_at", dateOnly(from))
    .lte("incurred_at", dateOnly(to))
    .order("incurred_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    if (
      error.code === "42P01" ||
      error.code === "PGRST205" ||
      error.message.includes("schema cache")
    ) {
      console.warn(
        "[getCostsByRange] tabela custos_internos nao encontrada. Execute a migration 2026-05-02_create_custos_internos.sql.",
      );
      return [];
    }

    throw new Error(error.message);
  }

  return ((data ?? []) as CostRow[]).map((row) => ({
    id: String(row.id),
    category: String(row.category ?? ""),
    description: String(row.description ?? ""),
    amount: safeNumber(row.amount),
    incurredAt: String(row.incurred_at ?? ""),
  }));
}

export async function createInternalCost(input: {
  competenceYear: number;
  competenceMonth: number;
  category: string;
  description: string;
  amount: number;
  incurredAt: string;
}) {
  const profile = await requireAdmin();
  const supabase = await createServerSupabaseClient();

  const competenceYear = safeNumber(input.competenceYear);
  const competenceMonth = safeNumber(input.competenceMonth);
  assertCompetence(competenceYear, competenceMonth);

  const category = String(input.category ?? "").trim();
  if (!category) throw new Error("Informe a categoria do custo.");
  if (category.length > 120) {
    throw new Error("Categoria deve ter no maximo 120 caracteres.");
  }

  const description = String(input.description ?? "").trim();
  if (!description) throw new Error("Informe a descricao do custo.");
  if (description.length > 240) {
    throw new Error("Descricao deve ter no maximo 240 caracteres.");
  }

  const amount = safeNumber(input.amount, Number.NaN);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Valor invalido, deve ser maior que zero.");
  }

  const incurredAt = String(input.incurredAt ?? "").trim();
  if (!isValidYYYYMMDD(incurredAt)) {
    throw new Error("Data do custo invalida.");
  }

  const { data, error } = await supabase
    .from("custos_internos")
    .insert({
      competence_year: competenceYear,
      competence_month: competenceMonth,
      category,
      description,
      amount,
      incurred_at: incurredAt,
      created_by: profile.user_id,
    })
    .select("id")
    .single();

  if (error) {
    if (
      error.code === "42P01" ||
      error.code === "PGRST205" ||
      error.message.includes("schema cache")
    ) {
      throw new Error(
        "Tabela custos_internos nao encontrada. Execute a migration 2026-05-02_create_custos_internos.sql no Supabase.",
      );
    }

    throw new Error(error.message);
  }

  revalidatePath("/admin/financeiro");

  return { id: String(data.id) };
}

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
      predicted_value,
      due_date,
      profiles:profiles!mensalidades_aluno_id_fkey ( name )
    `,
    )
    .eq("competence_year", year)
    .eq("competence_month", month)
    .neq("status", "cancelado")
    .order("status", { ascending: true });

  if (error) {
    console.warn("[getMensalidadesByMonth] erro:", error.message);
    return [];
  }

  const mensalidadeIds = (data ?? []).map((m: { id: unknown }) => String(m.id));
  const pagamentoMap = new Map<
    string,
    {
      amount_paid: number;
      payment_method: FormaPagamento;
      paid_at: string;
    }
  >();

  if (mensalidadeIds.length) {
    const { data: pagamentos, error: payErr } = await supabase
      .from("pagamentos")
      .select("mensalidade_id, amount_paid, payment_method, paid_at")
      .in("mensalidade_id", mensalidadeIds)
      .order("paid_at", { ascending: false });

    if (!payErr && pagamentos) {
      for (const p of pagamentos as {
        mensalidade_id: unknown;
        amount_paid: unknown;
        payment_method: unknown;
        paid_at: unknown;
      }[]) {
        const mid = String(p.mensalidade_id);
        const current = pagamentoMap.get(mid);
        if (!current) {
          pagamentoMap.set(mid, {
            amount_paid: safeNumber(p.amount_paid),
            payment_method: p.payment_method as FormaPagamento,
            paid_at: String(p.paid_at),
          });
        } else {
          current.amount_paid += safeNumber(p.amount_paid);
        }
      }
    }
  }

  return (data ?? []).map(
    (m: {
      id: unknown;
      aluno_id: unknown;
      competence_year: unknown;
      competence_month: unknown;
      status: unknown;
      predicted_value: unknown;
      due_date: unknown;
      profiles: { name: unknown } | { name: unknown }[] | null;
    }) => {
      const profile = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
      const pagamento = pagamentoMap.get(String(m.id));
      const paidAtDate = pagamento?.paid_at
        ? new Date(pagamento.paid_at).toISOString().split("T")[0]
        : null;

      const valorMensalidade = safeNumber(m.predicted_value);
      const valorPago = pagamento?.amount_paid ?? null;

      return {
        id: String(m.id),
        studentId: String(m.aluno_id),
        studentName: String(profile?.name ?? "Aluno"),
        competenceYear: safeNumber(m.competence_year),
        competenceMonth: safeNumber(m.competence_month),
        status: (m.status as MensalidadeStatus) ?? "pendente",
        valor_mensalidade: valorMensalidade,
        valorPago,
        valorFaltante: Math.max(0, valorMensalidade - (valorPago ?? 0)),
        formaPagamento: pagamento?.payment_method ?? null,
        dataVencimento: (m.due_date ?? null) as string | null,
        dataPagamento: paidAtDate,
      };
    },
  );
}

export async function getMensalidadesByRange(
  from: Date,
  to: Date,
): Promise<MensalidadeRow[]> {
  await requireAdmin();
  assertValidDateRange(from, to);

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
      predicted_value,
      due_date,
      profiles:profiles!mensalidades_aluno_id_fkey ( name )
    `,
    )
    .gte("due_date", dateOnly(from))
    .lte("due_date", dateOnly(to))
    .neq("status", "cancelado")
    .order("due_date", { ascending: true });

  if (error) {
    console.warn("[getMensalidadesByRange] erro:", error.message);
    return [];
  }

  const mensalidadeIds = (data ?? []).map((m: { id: unknown }) => String(m.id));
  const pagamentoMap = new Map<
    string,
    {
      amount_paid: number;
      payment_method: FormaPagamento;
      paid_at: string;
    }
  >();

  if (mensalidadeIds.length) {
    const { data: pagamentos, error: payErr } = await supabase
      .from("pagamentos")
      .select("mensalidade_id, amount_paid, payment_method, paid_at")
      .in("mensalidade_id", mensalidadeIds)
      .gte("paid_at", startOfDay(from).toISOString())
      .lte("paid_at", endOfDay(to).toISOString())
      .order("paid_at", { ascending: false });

    if (!payErr && pagamentos) {
      for (const p of pagamentos as {
        mensalidade_id: unknown;
        amount_paid: unknown;
        payment_method: unknown;
        paid_at: unknown;
      }[]) {
        const mid = String(p.mensalidade_id);
        const current = pagamentoMap.get(mid);
        if (!current) {
          pagamentoMap.set(mid, {
            amount_paid: safeNumber(p.amount_paid),
            payment_method: p.payment_method as FormaPagamento,
            paid_at: String(p.paid_at),
          });
        } else {
          current.amount_paid += safeNumber(p.amount_paid);
        }
      }
    }
  }

  return (data ?? []).map(
    (m: {
      id: unknown;
      aluno_id: unknown;
      competence_year: unknown;
      competence_month: unknown;
      status: unknown;
      predicted_value: unknown;
      due_date: unknown;
      profiles: { name: unknown } | { name: unknown }[] | null;
    }) => {
      const profile = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
      const pagamento = pagamentoMap.get(String(m.id));
      const paidAtDate = pagamento?.paid_at
        ? new Date(pagamento.paid_at).toISOString().split("T")[0]
        : null;

      const valorMensalidade = safeNumber(m.predicted_value);
      const valorPago = pagamento?.amount_paid ?? null;

      return {
        id: String(m.id),
        studentId: String(m.aluno_id),
        studentName: String(profile?.name ?? "Aluno"),
        competenceYear: safeNumber(m.competence_year),
        competenceMonth: safeNumber(m.competence_month),
        status: (m.status as MensalidadeStatus) ?? "pendente",
        valor_mensalidade: valorMensalidade,
        valorPago,
        valorFaltante: Math.max(0, valorMensalidade - (valorPago ?? 0)),
        formaPagamento: pagamento?.payment_method ?? null,
        dataVencimento: (m.due_date ?? null) as string | null,
        dataPagamento: paidAtDate,
      };
    },
  );
}

export async function getFinanceiroEntriesByMonth(
  year: number,
  month: number,
): Promise<FinanceiroEntry[]> {
  await requireAdmin();
  void year;
  void month;
  return [];
}
