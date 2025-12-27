"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { getUserProfile } from "@/app/_lib/actions/profile";

// Dica: mantenha os tipos simples aqui e faça tipos detalhados nos componentes.
export async function listStudentsForRecepcao() {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "recepção") throw new Error("Sem permissão.");

  const supabase = await createServerSupabaseClient();

  // TODO SUPABASE:
  // Padrão mais simples: usar profiles como fonte de alunos (role = 'aluno')
  // const { data, error } = await supabase
  //   .from("profiles")
  //   .select("user_id, name, email, telefone")
  //   .eq("role", "aluno")
  //   .order("name");
  // if (error) throw new Error(error.message);
  // return (data ?? []).map(p => ({
  //   id: p.user_id,
  //   name: p.name ?? p.email ?? p.user_id,
  //   email: p.email ?? "-",
  //   telefone: p.telefone ?? null,
  // }));

  return [];
}

export async function listPendingMensalidades() {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "recepção") throw new Error("Sem permissão.");

  const supabase = await createServerSupabaseClient();

  // TODO SUPABASE:
  // Tabela: mensalidade
  // Você vai decidir se quer listar só pendentes ou pendentes+pago (a UI suporta ambos).
  // const { data, error } = await supabase
  //   .from("mensalidade")
  //   .select("id, student_id, competence_year, competence_month, status, valor_mensalidade, valor_pago, forma_pagamento, data_pagamento")
  //   .order("competence_year", { ascending: false })
  //   .order("competence_month", { ascending: false });
  // if (error) throw new Error(error.message);
  //
  // TODO SUPABASE:
  // Se mensalidade não tiver student_name, buscar em profiles e montar o label.
  //
  // return data ??

  return [];
}

export async function listNoticesReadOnly() {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "recepção") throw new Error("Sem permissão.");

  const supabase = await createServerSupabaseClient();

  // TODO SUPABASE:
  // Tabela: aviso (ou notices)
  // const { data, error } = await supabase
  //   .from("aviso")
  //   .select("id, title, message, created_at, author_role, author_id")
  //   .order("created_at", { ascending: false });
  // if (error) throw new Error(error.message);
  //
  // TODO SUPABASE: buscar author_name em profiles pelo author_id
  // return data enriquecida

  return [];
}

export async function markMensalidadeAsPaid(input: {
  mensalidadeId: string;
  valorPago: number;
  formaPagamento: "dinheiro" | "pix" | "debito" | "credito";
  dataPagamento: string; // YYYY-MM-DD
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "recepção") throw new Error("Sem permissão.");

  const supabase = await createServerSupabaseClient();

  // TODO SUPABASE:
  // Atualizar mensalidade:
  // const { error } = await supabase
  //   .from("mensalidade")
  //   .update({
  //     status: "pago",
  //     valor_pago: input.valorPago,
  //     forma_pagamento: input.formaPagamento,
  //     data_pagamento: input.dataPagamento,
  //     updated_at: new Date().toISOString(),
  //   })
  //   .eq("id", input.mensalidadeId);
  // if (error) throw new Error(error.message);

  revalidatePath("/recepcao");
}

// Criar/editar aluno
// IMPORTANTE: criar usuário no Auth exige supabase.auth.admin.* (service role).
// Se você não quer service role aqui, crie um cadastro "pré-aluno" e depois faça onboarding.
export async function createStudent(_input: {
  name: string;
  email: string;
  telefone?: string | null;
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "recepção") throw new Error("Sem permissão.");

  // TODO SUPABASE (opção A - recomendada com segurança):
  // Criar um registro em tabela "student_preload" e depois gerar convite via fluxo controlado pelo administrativo.
  //
  // TODO SUPABASE (opção B - cria auth user):
  // Requer SUPABASE_SERVICE_ROLE_KEY no server e uso de supabase.auth.admin.createUser()

  revalidatePath("/recepcao");
}

export async function updateStudentProfile(_input: {
  studentId: string;
  name?: string;
  telefone?: string | null;
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "recepção") throw new Error("Sem permissão.");

  const supabase = await createServerSupabaseClient();

  // TODO SUPABASE:
  // Atualizar profiles:
  // await supabase.from("profiles").update({ ... }).eq("user_id", _input.studentId)

  revalidatePath("/recepcao");
}

export type NoticeRow = {
  id: string;
  title: string;
  message: string;
  created_at: string;
  author_role: string;
  author_name: string;
};
