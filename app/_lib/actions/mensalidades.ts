"use server";

import { logAudit } from "@/app/_lib/actions/audit";
import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { revalidatePath } from "next/cache";

import type {
  FormaPagamento,
  MensalidadeRow,
  MensalidadeStatus,
} from "@/app/_lib/actions/finance";

export type PaymentStatus = MensalidadeStatus;
export type PaymentMethod = FormaPagamento;
export type TuitionInstallment = MensalidadeRow;

const ALLOWED_FORMS: readonly FormaPagamento[] = [
  "dinheiro",
  "pix",
  "debito",
  "credito",
] as const;

function isValidYYYYMMDD(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function assertFormaPagamento(value: unknown): asserts value is FormaPagamento {
  if (!ALLOWED_FORMS.includes(value as FormaPagamento)) {
    throw new Error("Forma de pagamento inválida.");
  }
}

async function requireUserRole(allowedRoles: string[]) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const role = profile.role ?? "";
  if (!allowedRoles.includes(role)) {
    throw new Error("Sem permissão.");
  }

  return { profile, role };
}

function normalizeNumber(value: unknown) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return n;
}

export async function markMensalidadeAsPaid(input: {
  mensalidadeId: string;
  valorPago: number;
  formaPagamento: FormaPagamento;
  dataPagamento: string; // yyyy-mm-dd
}) {
  const { role } = await requireUserRole(["recepção", "administrativo"]);

  const mensalidadeId = String(input.mensalidadeId ?? "").trim();
  if (!mensalidadeId) throw new Error("mensalidadeId inválido.");

  const valorPago = normalizeNumber(input.valorPago);
  if (valorPago === null || valorPago <= 0) {
    throw new Error("Valor inválido, deve ser maior que zero.");
  }

  assertFormaPagamento(input.formaPagamento);
  const formaPagamento = input.formaPagamento;

  const dataPagamento = String(input.dataPagamento ?? "").trim();
  if (!isValidYYYYMMDD(dataPagamento)) {
    throw new Error("Data de pagamento inválida.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: current, error: currentErr } = await supabase
    .from("mensalidades")
    .select("status, aluno_id")
    .eq("id", mensalidadeId)
    .single();

  if (currentErr) throw new Error(currentErr.message);
  if (!current) throw new Error("Mensalidade não encontrada.");

  if (current.status === "pago" && role !== "administrativo") {
    throw new Error("Esta mensalidade já está marcada como paga.");
  }

  const profile = await getUserProfile();
  const paidAtTimestamp = new Date(dataPagamento + "T00:00:00Z").toISOString();

  const { error: pagamentoErr } = await supabase.from("pagamentos").insert({
    mensalidade_id: mensalidadeId,
    amount_paid: valorPago,
    payment_method: formaPagamento,
    paid_at: paidAtTimestamp,
    received_by: profile?.user_id ?? null,
    created_at: new Date().toISOString(),
  });

  if (pagamentoErr) throw new Error(pagamentoErr.message);

  const { error } = await supabase
    .from("mensalidades")
    .update({
      status: "pago",
      updated_at: new Date().toISOString(),
    })
    .eq("id", mensalidadeId);

  if (error) throw new Error(error.message);

  await logAudit({
    action: "payment",
    entity: "mensalidade",
    entityId: mensalidadeId,
    newValue: {
      status: "pago",
      amount_paid: valorPago,
      payment_method: formaPagamento,
      paid_at: paidAtTimestamp,
    },
    description: `Pagamento de R$ ${valorPago.toFixed(2)} registrado (${formaPagamento})`,
  });

  revalidatePath("/recepcao/financeiro");
  revalidatePath("/recepcao");
  revalidatePath("/admin/financeiro");
}

export async function listMensalidadesForRecepcao(params?: {
  status?: "pendente" | "pago" | "todos";
  studentId?: string | null;
}): Promise<MensalidadeRow[]> {
  await requireUserRole(["recepção", "administrativo"]);

  const supabase = await createServerSupabaseClient();

  let q = supabase
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
    .order("competence_year", { ascending: false })
    .order("competence_month", { ascending: false });

  const status = params?.status ?? "pendente";
  if (status !== "todos") q = q.eq("status", status);

  const studentId = params?.studentId ? String(params.studentId).trim() : "";
  if (studentId) q = q.eq("aluno_id", studentId);

  const { data, error } = await q;

  if (error) {
    console.warn("[listMensalidadesForRecepcao] fallback mock:", error.message);
    return buildMensalidadesMock({ status, studentId });
  }

  if (!data || data.length === 0) {
    return [];
  }

  const mensalidadeIds = data.map((r: { id: unknown }) => String(r.id));
  const { data: pagamentos } = await supabase
    .from("pagamentos")
    .select("mensalidade_id, amount_paid, payment_method, paid_at")
    .in("mensalidade_id", mensalidadeIds)
    .order("paid_at", { ascending: false });

  const pagamentoMap = new Map<
    string,
    {
      amount_paid: number;
      payment_method: FormaPagamento;
      paid_at: string;
    } | null
  >();

  if (pagamentos) {
    for (const pagamento of pagamentos) {
      const mid = String(pagamento.mensalidade_id);
      if (!pagamentoMap.has(mid)) {
        pagamentoMap.set(mid, {
          amount_paid: Number(pagamento.amount_paid),
          payment_method: pagamento.payment_method as FormaPagamento,
          paid_at: String(pagamento.paid_at),
        });
      }
    }
  }

  type SupabaseRow = {
    id: unknown;
    aluno_id: unknown;
    competence_year: unknown;
    competence_month: unknown;
    status: unknown;
    predicted_value: unknown;
    due_date: unknown;
    profiles: { name: unknown } | { name: unknown }[] | null;
  };

  return ((data as unknown as SupabaseRow[]) ?? []).map((r) => {
    const profile = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
    const pagamento = pagamentoMap.get(String(r.id));
    const paidAtDate = pagamento?.paid_at
      ? new Date(pagamento.paid_at).toISOString().split("T")[0]
      : null;

    return {
      id: String(r.id),
      studentId: String(r.aluno_id),
      studentName: (profile?.name as string | undefined) ?? "Aluno",
      competenceYear: Number(r.competence_year),
      competenceMonth: Number(r.competence_month),
      status: r.status as MensalidadeStatus,
      valor_mensalidade: Number(r.predicted_value),
      valorPago: pagamento?.amount_paid ?? null,
      formaPagamento: pagamento?.payment_method ?? null,
      dataVencimento: (r.due_date ?? null) as string | null,
      dataPagamento: paidAtDate,
    };
  });
}

function buildMensalidadesMock(input: {
  status: "pendente" | "pago" | "todos";
  studentId?: string;
}): MensalidadeRow[] {
  const base: MensalidadeRow[] = [
    {
      id: "m1",
      studentId: input.studentId || "student-1",
      studentName: "Maria Silva",
      competenceYear: 2025,
      competenceMonth: 2,
      status: "pendente",
      valor_mensalidade: 450,
      valorPago: null,
      formaPagamento: null,
      dataVencimento: "2025-02-10",
      dataPagamento: null,
    },
    {
      id: "m2",
      studentId: input.studentId || "student-1",
      studentName: "Maria Silva",
      competenceYear: 2025,
      competenceMonth: 1,
      status: "pago",
      valor_mensalidade: 450,
      valorPago: 450,
      formaPagamento: "pix",
      dataVencimento: "2025-01-10",
      dataPagamento: "2025-01-10",
    },
    {
      id: "m3",
      studentId: input.studentId || "student-2",
      studentName: "João Pereira",
      competenceYear: 2025,
      competenceMonth: 2,
      status: "pago",
      valor_mensalidade: 450,
      valorPago: 450,
      formaPagamento: "credito",
      dataVencimento: "2025-02-10",
      dataPagamento: "2025-02-05",
    },
    {
      id: "m4",
      studentId: input.studentId || "student-3",
      studentName: "Ana Costa",
      competenceYear: 2025,
      competenceMonth: 2,
      status: "pendente",
      valor_mensalidade: 450,
      valorPago: null,
      formaPagamento: null,
      dataVencimento: "2025-02-10",
      dataPagamento: null,
    },
  ];

  if (input.status === "todos") return base;
  return base.filter((m) => m.status === input.status);
}

export async function updateMensalidade(input: {
  mensalidadeId: string;
  valorMensalidade?: number;
  dataVencimento?: string; // yyyy-mm-dd
  status?: "pendente" | "pago";
}) {
  await requireUserRole(["administrativo"]);

  const mensalidadeId = String(input.mensalidadeId ?? "").trim();
  if (!mensalidadeId) throw new Error("mensalidadeId inválido.");

  const supabase = await createServerSupabaseClient();

  const { data: current, error: currentErr } = await supabase
    .from("mensalidades")
    .select("id")
    .eq("id", mensalidadeId)
    .single();

  if (currentErr) throw new Error(currentErr.message);
  if (!current) throw new Error("Mensalidade não encontrada.");

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.valorMensalidade !== undefined) {
    const valor = normalizeNumber(input.valorMensalidade);
    if (valor === null || valor <= 0) {
      throw new Error("Valor da mensalidade deve ser maior que zero.");
    }
    updates.predicted_value = valor;
  }

  if (input.dataVencimento !== undefined) {
    const data = String(input.dataVencimento).trim();
    if (!isValidYYYYMMDD(data)) {
      throw new Error("Data de vencimento inválida (formato: YYYY-MM-DD).");
    }
    updates.due_date = data;
  }

  if (input.status !== undefined) {
    updates.status = input.status;
  }

  const { error } = await supabase
    .from("mensalidades")
    .update(updates)
    .eq("id", mensalidadeId);

  if (error) throw new Error(error.message);

  await logAudit({
    action: "update",
    entity: "mensalidade",
    entityId: mensalidadeId,
    newValue: updates,
    description: `Mensalidade atualizada: ${Object.keys(updates).join(", ")}`,
  });

  revalidatePath("/admin/financeiro");
  revalidatePath("/recepcao/financeiro");
}

export async function updatePagamento(input: {
  pagamentoId: string;
  valorPago?: number;
  formaPagamento?: FormaPagamento;
  dataPagamento?: string; // yyyy-mm-dd
  observacao?: string | null;
}) {
  await requireUserRole(["administrativo"]);

  const pagamentoId = String(input.pagamentoId ?? "").trim();
  if (!pagamentoId) throw new Error("pagamentoId inválido.");

  const supabase = await createServerSupabaseClient();

  const { data: current, error: currentErr } = await supabase
    .from("pagamentos")
    .select("id, mensalidade_id")
    .eq("id", pagamentoId)
    .single();

  if (currentErr) throw new Error(currentErr.message);
  if (!current) throw new Error("Pagamento não encontrado.");

  const updates: Record<string, unknown> = {};

  if (input.valorPago !== undefined) {
    const valor = normalizeNumber(input.valorPago);
    if (valor === null || valor <= 0) {
      throw new Error("Valor pago deve ser maior que zero.");
    }
    updates.amount_paid = valor;
  }

  if (input.formaPagamento !== undefined) {
    assertFormaPagamento(input.formaPagamento);
    updates.payment_method = input.formaPagamento;
  }

  if (input.dataPagamento !== undefined) {
    const data = String(input.dataPagamento).trim();
    if (!isValidYYYYMMDD(data)) {
      throw new Error("Data de pagamento inválida (formato: YYYY-MM-DD).");
    }
    updates.paid_at = new Date(data + "T00:00:00Z").toISOString();
  }

  if (input.observacao !== undefined) {
    updates.observation = input.observacao;
  }

  const { error } = await supabase
    .from("pagamentos")
    .update(updates)
    .eq("id", pagamentoId);

  if (error) throw new Error(error.message);

  await logAudit({
    action: "update",
    entity: "pagamento",
    entityId: pagamentoId,
    newValue: updates,
    description: `Pagamento atualizado: ${Object.keys(updates).join(", ")}`,
  });

  // Verificar se há pagamentos para atualizar status da mensalidade
  const { data: pagamentos } = await supabase
    .from("pagamentos")
    .select("id")
    .eq("mensalidade_id", current.mensalidade_id)
    .limit(1);

  if (pagamentos && pagamentos.length > 0) {
    await supabase
      .from("mensalidades")
      .update({
        status: "pago",
        updated_at: new Date().toISOString(),
      })
      .eq("id", current.mensalidade_id);
  }

  revalidatePath("/admin/financeiro");
  revalidatePath("/recepcao/financeiro");
}

export async function deletePagamento(pagamentoId: string) {
  await requireUserRole(["administrativo"]);

  const supabase = await createServerSupabaseClient();

  const { data: pagamento, error: findErr } = await supabase
    .from("pagamentos")
    .select("id, mensalidade_id")
    .eq("id", pagamentoId)
    .single();

  if (findErr) throw new Error(findErr.message);
  if (!pagamento) throw new Error("Pagamento não encontrado.");

  const { error: deleteErr } = await supabase
    .from("pagamentos")
    .delete()
    .eq("id", pagamentoId);

  if (deleteErr) throw new Error(deleteErr.message);

  await logAudit({
    action: "delete",
    entity: "pagamento",
    entityId: pagamentoId,
    description: `Pagamento deletado`,
  });

  const { data: outrosPagamentos } = await supabase
    .from("pagamentos")
    .select("id")
    .eq("mensalidade_id", pagamento.mensalidade_id);

  if (!outrosPagamentos || outrosPagamentos.length === 0) {
    await supabase
      .from("mensalidades")
      .update({
        status: "pendente",
        updated_at: new Date().toISOString(),
      })
      .eq("id", pagamento.mensalidade_id);
  }

  revalidatePath("/admin/financeiro");
  revalidatePath("/recepcao/financeiro");
}

export async function listMensalidadesByStudent(
  studentId: string,
): Promise<MensalidadeRow[]> {
  const id = String(studentId ?? "").trim();
  if (!id || id === "undefined" || id === "null") {
    throw new Error("ID do aluno inválido.");
  }

  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const allowedRoles = ["recepção", "administrativo", "coordenação"];
  if (!allowedRoles.includes(profile.role ?? "")) {
    throw new Error("Sem permissão para listar mensalidades.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: mensalidades, error: mensalidadesError } = await supabase
    .from("mensalidades")
    .select(
      "id, aluno_id, competence_year, competence_month, status, predicted_value, due_date",
    )
    .eq("aluno_id", id)
    .order("competence_year", { ascending: false })
    .order("competence_month", { ascending: false });

  if (mensalidadesError) {
    throw new Error(mensalidadesError.message);
  }

  if (!mensalidades || mensalidades.length === 0) {
    return [];
  }

  const mensalidadeIds = mensalidades.map((m) => m.id);

  const { data: pagamentos, error: pagamentosError } = await supabase
    .from("pagamentos")
    .select("mensalidade_id, amount_paid, payment_method, paid_at")
    .in("mensalidade_id", mensalidadeIds)
    .order("paid_at", { ascending: false });

  if (pagamentosError) {
    console.warn(
      "[listMensalidadesByStudent] Erro ao buscar pagamentos:",
      pagamentosError.message,
    );
  }

  const pagamentoMap = new Map<
    string,
    {
      amount_paid: number;
      payment_method: FormaPagamento;
      paid_at: string;
    }
  >();

  if (pagamentos) {
    for (const pagamento of pagamentos) {
      const mid = String(pagamento.mensalidade_id);
      if (!pagamentoMap.has(mid)) {
        pagamentoMap.set(mid, {
          amount_paid: Number(pagamento.amount_paid),
          payment_method: pagamento.payment_method as FormaPagamento,
          paid_at: String(pagamento.paid_at),
        });
      }
    }
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("name")
    .eq("user_id", id)
    .single();

  const studentName = profileData?.name || "Aluno";

  return mensalidades.map((m) => {
    const pagamento = pagamentoMap.get(m.id);
    const paidAtDate = pagamento?.paid_at
      ? new Date(pagamento.paid_at).toISOString().split("T")[0]
      : null;

    return {
      id: String(m.id),
      studentId: String(m.aluno_id),
      studentName,
      competenceYear: Number(m.competence_year),
      competenceMonth: Number(m.competence_month),
      status: m.status as MensalidadeStatus,
      valor_mensalidade: Number(m.predicted_value),
      valorPago: pagamento?.amount_paid ?? null,
      formaPagamento: pagamento?.payment_method ?? null,
      dataVencimento: m.due_date || null,
      dataPagamento: paidAtDate,
    };
  });
}

export async function listMyMensalidades(): Promise<MensalidadeRow[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  if (profile.role !== "aluno") {
    throw new Error("Esta função é apenas para alunos.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: mensalidades, error: mensalidadesError } = await supabase
    .from("mensalidades")
    .select(
      "id, aluno_id, competence_year, competence_month, status, predicted_value, due_date",
    )
    .eq("aluno_id", profile.user_id)
    .order("competence_year", { ascending: false })
    .order("competence_month", { ascending: false });

  if (mensalidadesError) {
    throw new Error(mensalidadesError.message);
  }

  if (!mensalidades || mensalidades.length === 0) {
    return [];
  }

  const mensalidadeIds = mensalidades.map((m) => m.id);

  const { data: pagamentos, error: pagamentosError } = await supabase
    .from("pagamentos")
    .select("mensalidade_id, amount_paid, payment_method, paid_at")
    .in("mensalidade_id", mensalidadeIds)
    .order("paid_at", { ascending: false });

  if (pagamentosError) {
    console.warn(
      "[listMyMensalidades] Erro ao buscar pagamentos:",
      pagamentosError.message,
    );
  }

  const pagamentoMap = new Map<
    string,
    {
      amount_paid: number;
      payment_method: FormaPagamento;
      paid_at: string;
    }
  >();

  if (pagamentos) {
    for (const pagamento of pagamentos) {
      const mid = String(pagamento.mensalidade_id);
      if (!pagamentoMap.has(mid)) {
        pagamentoMap.set(mid, {
          amount_paid: Number(pagamento.amount_paid),
          payment_method: pagamento.payment_method as FormaPagamento,
          paid_at: String(pagamento.paid_at),
        });
      }
    }
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("name")
    .eq("user_id", profile.user_id)
    .single();

  const studentName = profileData?.name || profile.name || "Aluno";

  return mensalidades.map((m) => {
    const pagamento = pagamentoMap.get(m.id);
    const paidAtDate = pagamento?.paid_at
      ? new Date(pagamento.paid_at).toISOString().split("T")[0]
      : null;

    return {
      id: String(m.id),
      studentId: String(m.aluno_id),
      studentName,
      competenceYear: Number(m.competence_year),
      competenceMonth: Number(m.competence_month),
      status: m.status as MensalidadeStatus,
      valor_mensalidade: Number(m.predicted_value),
      valorPago: pagamento?.amount_paid ?? null,
      formaPagamento: pagamento?.payment_method ?? null,
      dataVencimento: m.due_date || null,
      dataPagamento: paidAtDate,
    };
  });
}
