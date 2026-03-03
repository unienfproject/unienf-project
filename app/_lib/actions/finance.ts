"use server";

import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";

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
      .eq("competence_month", m);

    if (mensalidadesError) {
      console.warn("[getMonthlySummary] erro:", mensalidadesError.message);
      return 0;
    }

    if (!mensalidades || mensalidades.length === 0) {
      return 0;
    }

    // Buscar pagamentos relacionados apenas das mensalidades pagas
    const mensalidadeIdsPagas = mensalidades
      .filter((m) => m.status === "pago")
      .map((m) => m.id);

    if (mensalidadeIdsPagas.length === 0) {
      return 0;
    }

    const { data: pagamentos, error: pagamentosError } = await supabase
      .from("pagamentos")
      .select("amount_paid")
      .in("mensalidade_id", mensalidadeIdsPagas);

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

export async function getCostsByMonth(
  year: number,
  month: number,
): Promise<Cost[]> {
  await requireAdmin();
  return [];
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
        if (!pagamentoMap.has(mid)) {
          pagamentoMap.set(mid, {
            amount_paid: safeNumber(p.amount_paid),
            payment_method: p.payment_method as FormaPagamento,
            paid_at: String(p.paid_at),
          });
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

      return {
        id: String(m.id),
        studentId: String(m.aluno_id),
        studentName: String(profile?.name ?? "Aluno"),
        competenceYear: safeNumber(m.competence_year),
        competenceMonth: safeNumber(m.competence_month),
        status: (m.status as MensalidadeStatus) ?? "pendente",
        valor_mensalidade: safeNumber(m.predicted_value),
        valorPago: pagamento?.amount_paid ?? null,
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
  return [];
}
