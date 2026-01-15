"use server";

import { logAudit } from "@/app/_lib/actions/audit";
import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { revalidatePath } from "next/cache";

export type StudentRowForRecepcao = {
  id: string;
  name: string;
  email: string;
  telefone?: string | null;
  turmaAtual?: string | null;
  matricula?: string | null;
};

export async function listStudentsForRecepcao(
  searchTerm?: string,
): Promise<StudentRowForRecepcao[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "recepção") throw new Error("Sem permissão.");

  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("profiles")
    .select(
      `
      user_id,
      name,
      email,
      phone,
      created_at,
      alunos:alunos!alunos_user_id_fkey(age, date_of_birth)
    `,
    )
    .eq("role", "aluno")
    .order("name", { ascending: true });

  if (searchTerm && searchTerm.trim()) {
    const term = searchTerm.trim().toLowerCase();
    query = query.or(
      `name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`,
    );
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  const studentIds = (data ?? []).map((p) => p.user_id);

  const turmasData: Record<string, string> = {};
  if (studentIds.length > 0) {
    const { data: turmaAlunos, error: turmaAlunosError } = await supabase
      .from("turma_alunos")
      .select("aluno_id, turma_id")
      .in("aluno_id", studentIds);

    if (!turmaAlunosError && turmaAlunos && turmaAlunos.length > 0) {
      const turmaIds = [
        ...new Set(turmaAlunos.map((ta) => ta.turma_id)),
      ] as string[];

      const { data: turmas, error: turmasError } = await supabase
        .from("turmas")
        .select("id, tag, status")
        .in("id", turmaIds)
        .eq("status", "ativa");

      if (!turmasError && turmas) {
        const turmaMap = new Map(turmas.map((t) => [t.id, t.tag || ""]));
        turmaAlunos.forEach((ta) => {
          const turmaTag = turmaMap.get(ta.turma_id);
          if (turmaTag && !turmasData[ta.aluno_id]) {
            turmasData[ta.aluno_id] = turmaTag;
          }
        });
      }
    }
  }

  return (data ?? []).map((p) => {
    const aluno = Array.isArray(p.alunos) ? p.alunos[0] : p.alunos;

    return {
      id: p.user_id,
      name: p.name ?? "",
      email: p.email ?? "",
      telefone: p.phone,
      turmaAtual: turmasData[p.user_id] || null,
      matricula: p.user_id.slice(0, 8).toUpperCase(),
    };
  });
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

export async function updateStudentProfile(input: {
  studentId: string;
  name?: string;
  telefone?: string | null;
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "recepção") throw new Error("Sem permissão.");

  const supabase = await createServerSupabaseClient();

  const { data: currentData, error: fetchError } = await supabase
    .from("profiles")
    .select("name, phone")
    .eq("user_id", input.studentId)
    .single();

  if (fetchError) throw new Error(fetchError.message);
  if (!currentData) throw new Error("Aluno não encontrado.");

  const oldValue = {
    name: currentData.name,
    telefone: currentData.phone,
  };

  const updateData: {
    name?: string;
    phone?: string | null;
    updated_at: string;
  } = {
    updated_at: new Date().toISOString(),
  };

  if (input.name !== undefined) {
    updateData.name = input.name.trim();
  }

  if (input.telefone !== undefined) {
    updateData.phone = input.telefone ? input.telefone.trim() : null;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("user_id", input.studentId);

  if (updateError) throw new Error(updateError.message);

  await logAudit({
    action: "update",
    entity: "aluno",
    entityId: input.studentId,
    oldValue,
    newValue: {
      name: updateData.name ?? currentData.name,
      telefone: updateData.phone ?? currentData.phone,
    },
    description: `Dados pessoais do aluno atualizados por ${profile.name ?? profile.email}`,
  });

  revalidatePath("/recepcao/alunos");
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
