"use server";

import { logAudit } from "@/app/_lib/actions/audit";
import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { revalidatePath } from "next/cache";

async function requireNoteEditPermission() {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const allowedRoles = ["professor", "administrativo"];
  const role = profile.role ?? "";
  if (!allowedRoles.includes(role)) {
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

  if (profile.role === "professor") {
    const turma = avaliacao.turmas as unknown as { professor_id: string };
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
    alunoName: (n.profiles as unknown as { name: string })?.name ?? "",
    alunoEmail: (n.profiles as unknown as { email: string })?.email ?? "",
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

  if (profile.role === "professor") {
    const turma = avaliacao.turmas as unknown as { professor_id: string };
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

export type MyNotasByTurma = {
  turmaId: string;
  turmaName: string;
  disciplinaName: string;
  a1: number | null;
  a2: number | null;
  a3: number | null;
  rec: number | null;
  media: number | null;
  status: "aprovado" | "reprovado" | "em_andamento";
};

export async function listMyNotas(): Promise<MyNotasByTurma[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  if (profile.role !== "aluno") {
    throw new Error("Esta função é apenas para alunos.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: turmasAluno, error: turmasError } = await supabase
    .from("turma_alunos")
    .select(
      `
      turma_id,
      turmas:turmas!turma_alunos_turma_id_fkey(
        id,
        name,
        disciplinas:disciplinas!turmas_disciplina_id_fkey(id, name)
      )
    `,
    )
    .eq("aluno_id", profile.user_id);

  if (turmasError) {
    if (turmasError.code === "42P01") {
      return [];
    }
    throw new Error(turmasError.message);
  }

  if (!turmasAluno || turmasAluno.length === 0) {
    return [];
  }

  const resultados: MyNotasByTurma[] = [];

  for (const ta of turmasAluno) {
    const turma = Array.isArray(ta.turmas) ? ta.turmas[0] : ta.turmas;
    if (!turma) continue;

    const disciplina = Array.isArray(turma.disciplinas)
      ? turma.disciplinas[0]
      : turma.disciplinas;

    const { data: avaliacoes, error: avaliacoesError } = await supabase
      .from("avaliacoes")
      .select("id, type")
      .eq("turma_id", turma.id)
      .in("type", ["A1", "A2", "A3", "REC"]);

    if (avaliacoesError) {
      console.warn(
        `[listMyNotas] Erro ao buscar avaliações da turma ${turma.id}:`,
        avaliacoesError.message,
      );
      continue;
    }

    if (!avaliacoes || avaliacoes.length === 0) {
      resultados.push({
        turmaId: turma.id,
        turmaName: turma.name,
        disciplinaName: disciplina?.name || "Disciplina",
        a1: null,
        a2: null,
        a3: null,
        rec: null,
        media: null,
        status: "em_andamento",
      });
      continue;
    }

    const avaliacaoIds = avaliacoes.map((a) => a.id);
    const { data: notas, error: notasError } = await supabase
      .from("notas")
      .select("avaliacao_id, value")
      .eq("aluno_id", profile.user_id)
      .in("avaliacao_id", avaliacaoIds);

    if (notasError) {
      console.warn(
        `[listMyNotas] Erro ao buscar notas da turma ${turma.id}:`,
        notasError.message,
      );
      continue;
    }

    const notasMap = new Map<string, number>();
    if (notas) {
      for (const avaliacao of avaliacoes) {
        const nota = notas.find((n) => n.avaliacao_id === avaliacao.id);
        if (nota && nota.value !== null) {
          notasMap.set(avaliacao.type, Number(nota.value));
        }
      }
    }

    const a1 = notasMap.get("A1") ?? null;
    const a2 = notasMap.get("A2") ?? null;
    const a3 = notasMap.get("A3") ?? null;
    const rec = notasMap.get("REC") ?? null;

    let media: number | null = null;
    if (a1 !== null && a2 !== null && a3 !== null) {
      const mediaParcial = (a1 + a2 + a3) / 3;
      if (rec !== null && rec > mediaParcial) {
        media = rec;
      } else {
        media = mediaParcial;
      }
    }

    let status: "aprovado" | "reprovado" | "em_andamento" = "em_andamento";
    if (media !== null) {
      status = media >= 7 ? "aprovado" : "reprovado";
    } else if (a1 !== null || a2 !== null || a3 !== null) {
      status = "em_andamento";
    }

    resultados.push({
      turmaId: turma.id,
      turmaName: turma.name,
      disciplinaName: disciplina?.name || "Disciplina",
      a1,
      a2,
      a3,
      rec,
      media,
      status,
    });
  }

  return resultados;
}
