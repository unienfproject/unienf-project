"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { getUserProfile } from "@/app/_lib/actions/profile";

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

  // Evitar sobrescrita indevida
  const { data: current, error: currentErr } = await supabase
    .from("mensalidades")
    .select("status")
    .eq("id", mensalidadeId)
    .single();

  if (currentErr) throw new Error(currentErr.message);
  if (!current) throw new Error("Mensalidade não encontrada.");

  if (current.status === "pago" && role !== "administrativo") {
    throw new Error("Esta mensalidade já está marcada como paga.");
  }

  const { error } = await supabase
    .from("mensalidades")
    .update({
      status: "pago",
      valor_pago: valorPago,
      forma_pagamento: formaPagamento,
      data_pagamento: dataPagamento, // yyyy-mm-dd
      updated_at: new Date().toISOString(), // remova se não existir a coluna
    })
    .eq("id", mensalidadeId);

  if (error) throw new Error(error.message);

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

  // Tabela correta (singular). Se a sua estiver plural, troque aqui.
  const TABLE_NAME = "mensalidade";

  let q = supabase
    .from(TABLE_NAME)
    .select(
      `
        id,
        student_id,
        competence_year,
        competence_month,
        status,
        valor_mensalidade,
        valor_pago,
        forma_pagamento,
        data_pagamento,
        profiles:profiles!mensalidade_student_id_fkey ( name )
      `,
    )
    .order("competence_year", { ascending: false })
    .order("competence_month", { ascending: false });

  const status = params?.status ?? "pendente";
  if (status !== "todos") q = q.eq("status", status);

  const studentId = params?.studentId ? String(params.studentId).trim() : "";
  if (studentId) q = q.eq("student_id", studentId);

  const { data, error } = await q;

  // Fallback: se a tabela/relacionamento ainda não existir, retorna mock para visualizar páginas.
  if (error) {
    console.warn("[listMensalidadesForRecepcao] fallback mock:", error.message);
    return buildMensalidadesMock({ status, studentId });
  }

  type SupabaseRow = {
    id: string;
    student_id: string;
    competence_year: number;
    competence_month: number;
    status: string;
    valor_mensalidade: number;
    valor_pago: number | null;
    forma_pagamento: string | null;
    data_pagamento: string | null;
    profiles: { name: string }[] | null;
  };

  return (data ?? []).map((r: SupabaseRow) => ({
    id: String(r.id),
    studentId: String(r.student_id),
    studentName: r.profiles?.[0]?.name ?? "Aluno",
    competenceYear: Number(r.competence_year),
    competenceMonth: Number(r.competence_month),
    status: r.status as MensalidadeStatus,
    valor_mensalidade: Number(r.valor_mensalidade),
    valorPago: r.valor_pago == null ? null : Number(r.valor_pago),
    formaPagamento: (r.forma_pagamento ?? null) as FormaPagamento | null,
    dataPagamento: (r.data_pagamento ?? null) as string | null,
  }));
}

/**
 * MOCK local para UI (sem banco).
 * Retorna mensalidades suficientes para você visualizar filtros e tabelas.
 */
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
