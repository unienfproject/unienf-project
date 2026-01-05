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

  const { data: pagamento, error: pagamentoErr } = await supabase
    .from("pagamentos")
    .insert({
      mensalidade_id: mensalidadeId,
      valor_pago: valorPago,
      forma_pagamento: formaPagamento,
      data_pagamento: dataPagamento,
      created_by: (await getUserProfile())?.user_id ?? null,
      created_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (pagamentoErr) throw new Error(pagamentoErr.message);

  const { error } = await supabase
    .from("mensalidades")
    .update({
      status: "pago",
      valor_pago: valorPago,
      data_pagamento: dataPagamento,
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
      valor_pago: valorPago,
      forma_pagamento: formaPagamento,
      data_pagamento: dataPagamento,
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
        valor_mensalidade,
        valor_pago,
        data_vencimento,
        data_pagamento,
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

  type SupabaseRow = {
    id: unknown;
    aluno_id: unknown;
    competence_year: unknown;
    competence_month: unknown;
    status: unknown;
    valor_mensalidade: unknown;
    valor_pago: unknown;
    data_vencimento: unknown;
    data_pagamento: unknown;
    profiles: { name: unknown } | { name: unknown }[] | null;
  };

  return ((data as unknown as SupabaseRow[]) ?? []).map((r) => {
    const profile = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
    return {
      id: String(r.id),
      studentId: String(r.aluno_id),
      studentName: (profile?.name as string | undefined) ?? "Aluno",
      competenceYear: Number(r.competence_year),
      competenceMonth: Number(r.competence_month),
      status: r.status as MensalidadeStatus,
      valor_mensalidade: Number(r.valor_mensalidade),
      valorPago: r.valor_pago == null ? null : Number(r.valor_pago),
      formaPagamento: null as FormaPagamento | null,
      dataPagamento: (r.data_pagamento ?? null) as string | null,
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
  const profile = await requireUserRole(["administrativo"]);

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
    updates.valor_mensalidade = valor;
  }

  if (input.dataVencimento !== undefined) {
    const data = String(input.dataVencimento).trim();
    if (!isValidYYYYMMDD(data)) {
      throw new Error("Data de vencimento inválida (formato: YYYY-MM-DD).");
    }
    updates.data_vencimento = data;
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
  const profile = await requireUserRole(["administrativo"]);

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
    updates.valor_pago = valor;
  }

  if (input.formaPagamento !== undefined) {
    assertFormaPagamento(input.formaPagamento);
    updates.forma_pagamento = input.formaPagamento;
  }

  if (input.dataPagamento !== undefined) {
    const data = String(input.dataPagamento).trim();
    if (!isValidYYYYMMDD(data)) {
      throw new Error("Data de pagamento inválida (formato: YYYY-MM-DD).");
    }
    updates.data_pagamento = data;
  }

  if (input.observacao !== undefined) {
    updates.observacao = input.observacao;
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

  if (input.valorPago !== undefined || input.dataPagamento !== undefined) {
    const { data: pagamento } = await supabase
      .from("pagamentos")
      .select("valor_pago, data_pagamento")
      .eq("id", pagamentoId)
      .single();

    if (pagamento) {
      await supabase
        .from("mensalidades")
        .update({
          valor_pago: pagamento.valor_pago,
          data_pagamento: pagamento.data_pagamento,
          status: "pago",
          updated_at: new Date().toISOString(),
        })
        .eq("id", current.mensalidade_id);
    }
  }

  revalidatePath("/admin/financeiro");
  revalidatePath("/recepcao/financeiro");
}

export async function deletePagamento(pagamentoId: string) {
  const profile = await requireUserRole(["administrativo"]);

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
        valor_pago: null,
        data_pagamento: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", pagamento.mensalidade_id);
  }

  revalidatePath("/admin/financeiro");
  revalidatePath("/recepcao/financeiro");
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
      "id, aluno_id, competence_year, competence_month, status, valor_mensalidade, valor_pago, data_vencimento, data_pagamento",
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
    .select("mensalidade_id, forma_pagamento")
    .in("mensalidade_id", mensalidadeIds)
    .order("created_at", { ascending: false });

  if (pagamentosError) {
    console.warn(
      "[listMyMensalidades] Erro ao buscar pagamentos:",
      pagamentosError.message,
    );
  }

  const formaPagamentoMap = new Map<string, FormaPagamento | null>();
  if (pagamentos) {
    for (const pagamento of pagamentos) {
      if (!formaPagamentoMap.has(pagamento.mensalidade_id)) {
        formaPagamentoMap.set(
          pagamento.mensalidade_id,
          (pagamento.forma_pagamento as FormaPagamento) || null,
        );
      }
    }
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("name")
    .eq("user_id", profile.user_id)
    .single();

  const studentName = profileData?.name || profile.name || "Aluno";

  return mensalidades.map((m) => ({
    id: String(m.id),
    studentId: String(m.aluno_id),
    studentName,
    competenceYear: Number(m.competence_year),
    competenceMonth: Number(m.competence_month),
    status: m.status as MensalidadeStatus,
    valor_mensalidade: Number(m.valor_mensalidade),
    valorPago: m.valor_pago == null ? null : Number(m.valor_pago),
    formaPagamento: formaPagamentoMap.get(m.id) || null,
    dataPagamento: m.data_pagamento || null,
  }));
}
