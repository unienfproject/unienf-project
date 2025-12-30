"use server";

import { logAudit } from "@/app/_lib/actions/audit";
import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { revalidatePath } from "next/cache";

async function requireNoteEditPermission() {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const allowedRoles = ["professor", "administrativo"];
  if (!allowedRoles.includes(profile.role)) {
    throw new Error("Sem permissão para editar notas.");
  }

  return profile;
}

export async function listNotasByAvaliacao(avaliacaoId: string) {
  const profile = await requireNoteEditPermission();
  const supabase = await createServerSupabaseClient();

  const { data: avaliacao, error: avaliacaoErr } = await supabase
    .from("avaliacoes")
    .select("id, turma_id, turmas!inner(professor_id)")
    .eq("id", avaliacaoId)
    .single();

  if (avaliacaoErr) throw new Error(avaliacaoErr.message);
  if (!avaliacao) throw new Error("Avaliação não encontrada.");

  // Se for professor, verificar se é o professor da turma
  if (profile.role === "professor") {
    const turma = avaliacao.turmas as any;
    if (turma?.professor_id !== profile.user_id) {
      throw new Error("Você não tem permissão para ver notas desta turma.");
    }
  }

  const { data: notas, error: notasErr } = await supabase
    .from("notas")
    .select(
      `
      id,
      avaliacao_id,
      aluno_id,
      value,
      created_at,
      updated_at,
      profiles!notas_aluno_id_fkey(name, email)
    `,
    )
    .eq("avaliacao_id", avaliacaoId)
    .order("profiles(name)");

  if (notasErr) throw new Error(notasErr.message);

  return (notas ?? []).map((n) => ({
    id: n.id,
    avaliacaoId: n.avaliacao_id,
    alunoId: n.aluno_id,
    value: Number(n.value),
    alunoName: (n.profiles as any)?.name ?? "",
    alunoEmail: (n.profiles as any)?.email ?? "",
    createdAt: n.created_at,
    updatedAt: n.updated_at,
  }));
}

export async function upsertNota(input: {
  avaliacaoId: string;
  alunoId: string;
  value: number;
}) {
  const profile = await requireNoteEditPermission();
  const supabase = await createServerSupabaseClient();

  const value = Number(input.value);
  if (isNaN(value) || value < 0 || value > 10) {
    throw new Error("Nota deve estar entre 0 e 10.");
  }

  const { data: avaliacao, error: avaliacaoErr } = await supabase
    .from("avaliacoes")
    .select("id, turma_id, turmas!inner(professor_id)")
    .eq("id", input.avaliacaoId)
    .single();

  if (avaliacaoErr) throw new Error(avaliacaoErr.message);
  if (!avaliacao) throw new Error("Avaliação não encontrada.");

  // Se for professor, verificar se é o professor da turma
  if (profile.role === "professor") {
    const turma = avaliacao.turmas as any;
    if (turma?.professor_id !== profile.user_id) {
      throw new Error("Você não tem permissão para editar notas desta turma.");
    }
  }

  const { data: existingNota } = await supabase
    .from("notas")
    .select("id")
    .eq("avaliacao_id", input.avaliacaoId)
    .eq("aluno_id", input.alunoId)
    .single();

  if (existingNota) {
    const { data: oldNota } = await supabase
      .from("notas")
      .select("value")
      .eq("id", existingNota.id)
      .single();

    const { error: updateErr } = await supabase
      .from("notas")
      .update({
        value: value,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingNota.id);

    if (updateErr) throw new Error(updateErr.message);

    await logAudit({
      action: "update",
      entity: "nota",
      entityId: existingNota.id,
      oldValue: oldNota ? { value: oldNota.value } : null,
      newValue: { value: value },
      description: `Nota atualizada de ${oldNota?.value ?? "N/A"} para ${value}`,
    });
  } else {
    const { data: newNota, error: insertErr } = await supabase
      .from("notas")
      .insert({
        avaliacao_id: input.avaliacaoId,
        aluno_id: input.alunoId,
        value: value,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (insertErr) throw new Error(insertErr.message);

    if (newNota) {
      await logAudit({
        action: "create",
        entity: "nota",
        entityId: newNota.id,
        newValue: {
          value: value,
          avaliacao_id: input.avaliacaoId,
          aluno_id: input.alunoId,
        },
        description: `Nova nota ${value} criada para aluno ${input.alunoId}`,
      });
    }
  }

  revalidatePath("/professores/notas");
  revalidatePath("/admin");
}

export async function deleteNota(notaId: string) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  if (profile.role !== "administrativo") {
    throw new Error("Apenas administrativo pode deletar notas.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: nota } = await supabase
    .from("notas")
    .select("id, value, aluno_id, avaliacao_id")
    .eq("id", notaId)
    .single();

  const { error } = await supabase.from("notas").delete().eq("id", notaId);

  if (error) throw new Error(error.message);

  if (nota) {
    await logAudit({
      action: "delete",
      entity: "nota",
      entityId: notaId,
      oldValue: {
        value: nota.value,
        aluno_id: nota.aluno_id,
        avaliacao_id: nota.avaliacao_id,
      },
      description: `Nota ${nota.value} deletada`,
    });
  }

  revalidatePath("/professores/notas");
  revalidatePath("/admin");
}
