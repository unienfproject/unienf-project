"use server";

import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function listStudentsForRecepcao() {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "recepção") throw new Error("Sem permissão.");

  const supabase = await createServerSupabaseClient();

  return [];
}

export async function listPendingMensalidades() {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "recepção") throw new Error("Sem permissão.");

  const supabase = await createServerSupabaseClient();

  return [];
}

export async function listNoticesReadOnly() {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "recepção") throw new Error("Sem permissão.");

  const supabase = await createServerSupabaseClient();

  return [];
}

export async function markMensalidadeAsPaid(input: {
  mensalidadeId: string;
  valorPago: number;
  formaPagamento: "dinheiro" | "pix" | "debito" | "credito";
  dataPagamento: string;
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "recepção") throw new Error("Sem permissão.");

  const supabase = await createServerSupabaseClient();

  revalidatePath("/recepcao");
}

export async function createStudent(_input: {
  name: string;
  email: string;
  telefone?: string | null;
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "recepção") throw new Error("Sem permissão.");

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
