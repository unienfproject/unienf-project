"use server";

import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { revalidatePath } from "next/cache";

async function requireNoteEditPermission() {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const role = profile.role ?? "";
  const allowed = ["professor", "administrativo", "coordenação"];
  if (!allowed.includes(role)) {
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
      nota,
      released_at,
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
    value: Number(n.nota),
    alunoName: (n.profiles as unknown as { name: string })?.name ?? "",
    alunoEmail: (n.profiles as unknown as { email: string })?.email ?? "",
    createdAt: n.released_at,
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

  const avaliacaoId = String(input.avaliacaoId ?? "").trim();
  const alunoId = String(input.alunoId ?? "").trim();
  const value = Number(input.value);

  if (!avaliacaoId) throw new Error("avaliacaoId inválido.");
  if (!alunoId) throw new Error("alunoId inválido.");
  if (isNaN(value) || value < 0 || value > 10) {
    throw new Error("Nota inválida. Deve estar entre 0 e 10.");
  }

  // Verificar se o professor tem acesso à turma desta avaliação
  if (profile.role === "professor") {
    const { data: avaliacao, error: avaliacaoErr } = await supabase
      .from("avaliacoes")
      .select("turma_id, turmas!inner(professor_id)")
      .eq("id", avaliacaoId)
      .single();

    if (avaliacaoErr) throw new Error(avaliacaoErr.message);
    if (!avaliacao) throw new Error("Avaliação não encontrada.");

    const turma = avaliacao.turmas as unknown as { professor_id: string };
    if (turma?.professor_id !== profile.user_id) {
      throw new Error("Você não tem permissão para editar notas desta turma.");
    }
  }

  const now = new Date().toISOString();

  const { data: existing, error: existingErr } = await supabase
    .from("notas")
    .select("id, nota")
    .eq("avaliacao_id", avaliacaoId)
    .eq("aluno_id", alunoId)
    .single();

  if (existingErr && existingErr.code !== "PGRST116") {
    throw new Error(existingErr.message);
  }

  if (existing) {
    // UPDATE
    const { error: updateErr } = await supabase
      .from("notas")
      .update({
        nota: value,
        updated_at: now,
      })
      .eq("id", existing.id);

    if (updateErr) throw new Error(updateErr.message);
  } else {
    // INSERT
    const { error: insertErr } = await supabase.from("notas").insert({
      avaliacao_id: avaliacaoId,
      aluno_id: alunoId,
      nota: value,
      released_by: profile.user_id,
      released_at: now,
      updated_at: now,
    });

    if (insertErr) throw new Error(insertErr.message);
  }

  revalidatePath("/professores/notas");
  revalidatePath("/admin");
}

export async function deleteNota(notaId: string) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  if (profile.role !== "administrativo" && profile.role !== "coordenação") {
    throw new Error(
      "Apenas administrativo ou coordenação podem deletar notas.",
    );
  }

  const supabase = await createServerSupabaseClient();

  const { data: nota } = await supabase
    .from("notas")
    .select("id, nota, aluno_id, avaliacao_id")
    .eq("id", notaId)
    .single();

  const { error } = await supabase.from("notas").delete().eq("id", notaId);

  if (error) throw new Error(error.message);

  // Nota deletada com sucesso

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

export type NotasByTurmaForStaff = {
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

export async function listNotasByStudent(
  studentId: string,
): Promise<NotasByTurmaForStaff[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const allowedRoles = ["recepção", "administrativo", "coordenação"];
  if (!allowedRoles.includes(profile.role ?? "")) {
    throw new Error("Sem permissão para listar notas do aluno.");
  }

  const supabase = await createServerSupabaseClient();

  // Buscar turmas do aluno
  const { data: turmaAlunos, error: turmasError } = await supabase
    .from("turma_alunos")
    .select("turma_id")
    .eq("aluno_id", studentId);

  if (turmasError) {
    if (turmasError.code === "42P01") return [];
    throw new Error(turmasError.message);
  }

  if (!turmaAlunos || turmaAlunos.length === 0) {
    return [];
  }

  const turmaIds = turmaAlunos.map((ta) => ta.turma_id);

  // Buscar dados das turmas
  const { data: turmas, error: turmasDataError } = await supabase
    .from("turmas")
    .select(
      `
      id,
      tag,
      disciplina_id,
      disciplinas:disciplinas!turmas_disciplina_id_fkey(name)
    `,
    )
    .in("id", turmaIds);

  if (turmasDataError) {
    console.warn(
      "[listNotasByStudent] Erro ao buscar turmas:",
      turmasDataError.message,
    );
    return [];
  }

  const resultados: NotasByTurmaForStaff[] = [];

  for (const turma of turmas ?? []) {
    const disciplina = Array.isArray(turma.disciplinas)
      ? turma.disciplinas[0]
      : turma.disciplinas;

    // Buscar avaliações da turma
    const { data: avaliacoes, error: avaliacoesError } = await supabase
      .from("avaliacoes")
      .select("id, type")
      .eq("turma_id", turma.id)
      .in("type", ["A1", "A2", "A3", "REC"]);

    if (avaliacoesError) {
      console.warn(
        `[listNotasByStudent] Erro ao buscar avaliações da turma ${turma.id}:`,
        avaliacoesError.message,
      );
      continue;
    }

    if (!avaliacoes || avaliacoes.length === 0) {
      resultados.push({
        turmaId: turma.id,
        turmaName: turma.tag,
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
      .select("avaliacao_id, nota")
      .eq("aluno_id", studentId)
      .in("avaliacao_id", avaliacaoIds);

    if (notasError) {
      console.warn(
        `[listNotasByStudent] Erro ao buscar notas da turma ${turma.id}:`,
        notasError.message,
      );
      continue;
    }

    const notasMap = new Map<string, number>();
    if (notas) {
      for (const avaliacao of avaliacoes) {
        const nota = notas.find((n) => n.avaliacao_id === avaliacao.id);
        if (nota && nota.nota !== null) {
          notasMap.set(avaliacao.type, Number(nota.nota));
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
    }

    resultados.push({
      turmaId: turma.id,
      turmaName: turma.tag,
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

export async function listMyNotas(): Promise<MyNotasByTurma[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  if (profile.role !== "aluno") {
    throw new Error("Esta função é apenas para alunos.");
  }

  const supabase = await createServerSupabaseClient();

  // Buscar turmas do aluno - query separada para evitar problemas
  const { data: turmaAlunos, error: turmasError } = await supabase
    .from("turma_alunos")
    .select("turma_id")
    .eq("aluno_id", profile.user_id);

  if (turmasError) {
    if (turmasError.code === "42P01") {
      return [];
    }
    throw new Error(turmasError.message);
  }

  if (!turmaAlunos || turmaAlunos.length === 0) {
    return [];
  }

  const turmaIds = turmaAlunos.map((ta) => ta.turma_id);

  // Buscar dados das turmas
  const { data: turmas, error: turmasDataError } = await supabase
    .from("turmas")
    .select(
      `
      id,
      tag,
      disciplina_id,
      disciplinas:disciplinas!turmas_disciplina_id_fkey(name)
    `,
    )
    .in("id", turmaIds);

  if (turmasDataError) {
    console.warn(
      "[listMyNotas] Erro ao buscar turmas:",
      turmasDataError.message,
    );
    return [];
  }

  const resultados: MyNotasByTurma[] = [];

  for (const turma of turmas ?? []) {
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
        turmaName: turma.tag,
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
      .select("avaliacao_id, nota")
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
        if (nota && nota.nota !== null) {
          notasMap.set(avaliacao.type, Number(nota.nota));
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
    }

    resultados.push({
      turmaId: turma.id,
      turmaName: turma.tag,
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
