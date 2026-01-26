"use server";

import { logAudit } from "@/app/_lib/actions/audit";
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

export type AvaliacaoPickerItem = {
  id: string;
  label: string;
  type: string;
};

export async function listAvaliacoesByTurma(turmaId: string): Promise<AvaliacaoPickerItem[]> {
  const profile = await requireNoteEditPermission();
  const supabase = await createServerSupabaseClient();

  // Garante permissão do professor (se for professor)
  const { data: turma, error: turmaErr } = await supabase
    .from("turmas")
    .select("id, professor_id")
    .eq("id", turmaId)
    .single();

  if (turmaErr) throw new Error(turmaErr.message);
  if (!turma) throw new Error("Turma não encontrada.");

  if (profile.role === "professor" && turma.professor_id !== profile.user_id) {
    throw new Error("Você não tem permissão para acessar avaliações desta turma.");
  }

  // Avaliações: você já usa "type" em listMyNotas (A1/A2/A3/REC)
  const { data, error } = await supabase
    .from("avaliacoes")
    .select("id, type")
    .eq("turma_id", turmaId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  const labelFromType = (t: string) => {
    if (t === "A1") return "A1";
    if (t === "A2") return "A2";
    if (t === "A3") return "A3";
    if (t === "REC") return "REC";
    return t;
  };

  return (data ?? []).map((a: any) => ({
    id: String(a.id),
    type: String(a.type),
    label: labelFromType(String(a.type)),
  }));
}

export type AlunoNotaRow = {
  alunoId: string;
  alunoName: string;
  alunoEmail: string;
  matricula: string | null;
  notaId: string | null;
  value: number | null;
};

export async function listAlunosComNotaByAvaliacao(input: {
  avaliacaoId: string;
}): Promise<AlunoNotaRow[]> {
  const profile = await requireNoteEditPermission();
  const supabase = await createServerSupabaseClient();

  // 1) valida avaliação + ownership (se professor)
  const { data: avaliacao, error: avaliacaoErr } = await supabase
    .from("avaliacoes")
    .select("id, turma_id, turmas!inner(id, professor_id)")
    .eq("id", input.avaliacaoId)
    .single();

  if (avaliacaoErr) throw new Error(avaliacaoErr.message);
  if (!avaliacao) throw new Error("Avaliação não encontrada.");

  const turma = avaliacao.turmas as unknown as { id: string; professor_id: string };
  const turmaId = String(avaliacao.turma_id);

  if (profile.role === "professor" && turma?.professor_id !== profile.user_id) {
    throw new Error("Você não tem permissão para ver notas desta turma.");
  }

  // 2) alunos da turma
  const { data: turmaAlunos, error: turmaAlunosErr } = await supabase
    .from("turma_alunos")
    .select(
      `
      aluno_id,
      profiles:profiles!turma_alunos_aluno_id_fkey(name, email)
    `,
    )
    .eq("turma_id", turmaId);

  if (turmaAlunosErr) throw new Error(turmaAlunosErr.message);

  const alunoIds = (turmaAlunos ?? []).map((ta: any) => String(ta.aluno_id));

  // 3) notas já lançadas para a avaliação
  const notasMap = new Map<string, { notaId: string; value: number }>();

  if (alunoIds.length) {
    const { data: notas, error: notasErr } = await supabase
      .from("notas")
      .select("id, aluno_id, value")
      .eq("avaliacao_id", input.avaliacaoId)
      .in("aluno_id", alunoIds);

    if (notasErr) throw new Error(notasErr.message);

    for (const n of notas ?? []) {
      notasMap.set(String((n as any).aluno_id), {
        notaId: String((n as any).id),
        value: Number((n as any).value),
      });
    }
  }

  // 4) monta resposta
  const rows: AlunoNotaRow[] = (turmaAlunos ?? []).map((ta: any) => {
    const p = Array.isArray(ta.profiles) ? ta.profiles[0] : ta.profiles;
    const alunoId = String(ta.aluno_id);
    const existing = notasMap.get(alunoId);

    return {
      alunoId,
      alunoName: String(p?.name ?? ""),
      alunoEmail: String(p?.email ?? ""),
      matricula: null,
      notaId: existing?.notaId ?? null,
      value: existing?.value ?? null,
    };
  });

  rows.sort((a, b) => a.alunoName.localeCompare(b.alunoName));
  return rows;
}

export async function upsertNotasBulk(input: {
  avaliacaoId: string;
  grades: Array<{ alunoId: string; value: number }>;
}) {
  const profile = await requireNoteEditPermission();
  const supabase = await createServerSupabaseClient();

  const avaliacaoId = String(input.avaliacaoId ?? "").trim();
  if (!avaliacaoId) throw new Error("avaliacaoId inválido.");

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
      throw new Error("Você não tem permissão para editar notas desta turma.");
    }
  }

  const payload = (input.grades ?? []).map((g) => {
    const value = Number(g.value);
    if (!Number.isFinite(value) || value < 0 || value > 10) {
      throw new Error("Nota deve estar entre 0 e 10.");
    }
    const alunoId = String(g.alunoId ?? "").trim();
    if (!alunoId) throw new Error("alunoId inválido.");

    return {
      avaliacao_id: avaliacaoId,
      aluno_id: alunoId,
      value,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
  });

  if (!payload.length) return;

  // IMPORTANTE: isso exige uma constraint unique(avaliacao_id, aluno_id) na tabela notas.
  // Se não existir, me avise que eu adapto para fallback "select+update/insert".
  const { error } = await supabase
    .from("notas")
    .upsert(payload, { onConflict: "avaliacao_id,aluno_id" });

  if (error) throw new Error(error.message);

  await logAudit({
    action: "update",
    entity: "nota",
    entityId: avaliacaoId,
    newValue: { count: payload.length },
    description: `Lançamento/atualização em lote: ${payload.length} nota(s) na avaliação ${avaliacaoId}`,
  });

  revalidatePath("/professores/notas");
  revalidatePath("/admin");
}

export type AssessmentItem = { id: string; label: string };

export type StudentForGradesRow = {
  alunoId: string;
  alunoName: string;
  etiquetas: string | null;
  nota: number | null;
};

/**
 * Lista avaliações de uma turma (para o Select).
 * Mantém o nome que sua PAGE.TSX já está importando.
 */
export async function listAssessmentsForClass(input: {
  turmaId: string;
  teacherId: string;
}): Promise<AssessmentItem[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== input.teacherId) throw new Error("Acesso inválido.");

  const supabase = await createServerSupabaseClient();

  // Garante que a turma é do professor logado
  const { data: turma, error: turmaErr } = await supabase
    .from("turmas")
    .select("id, professor_id")
    .eq("id", input.turmaId)
    .single();

  if (turmaErr) throw new Error(turmaErr.message);
  if (!turma) throw new Error("Turma não encontrada.");
  if (String(turma.professor_id) !== profile.user_id) {
    throw new Error("Você não tem permissão para acessar esta turma.");
  }

  const { data, error } = await supabase
    .from("avaliacoes")
    .select("id, type, name")
    .eq("turma_id", input.turmaId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((a: any) => {
    const type = (a.type ?? "").toString().trim();
    const name = (a.name ?? "").toString().trim();

    // label amigável (ex.: "A1", "Prova 1", etc.)
    const label =
      name ||
      (type ? type : "Avaliação");

    return { id: String(a.id), label };
  });
}

/**
 * Lista alunos da turma e traz a nota (se existir) na avaliação selecionada.
 * Mantém o nome que sua PAGE.TSX já está importando.
 */
export async function listStudentsForGrades(input: {
  turmaId: string;
  avaliacaoId: string;
  teacherId: string;
}): Promise<StudentForGradesRow[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== input.teacherId) throw new Error("Acesso inválido.");

  const supabase = await createServerSupabaseClient();

  // Confirma que a avaliação pertence à turma e que a turma é do professor
  const { data: avaliacao, error: avaliacaoErr } = await supabase
    .from("avaliacoes")
    .select("id, turma_id, turmas!inner(professor_id)")
    .eq("id", input.avaliacaoId)
    .single();

  if (avaliacaoErr) throw new Error(avaliacaoErr.message);
  if (!avaliacao) throw new Error("Avaliação não encontrada.");
  if (String(avaliacao.turma_id) !== String(input.turmaId)) {
    throw new Error("Avaliação não pertence à turma selecionada.");
  }

  const turmaJoin = avaliacao.turmas as unknown as { professor_id: string };
  if (turmaJoin?.professor_id !== profile.user_id) {
    throw new Error("Você não tem permissão para ver notas desta turma.");
  }

  // Busca alunos vinculados à turma
  const { data: turmaAlunos, error: alunosErr } = await supabase
    .from("turma_alunos")
    .select(
      `
      aluno_id,
      profiles:profiles!turma_alunos_aluno_id_fkey(name, email)
    `,
    )
    .eq("turma_id", input.turmaId)
    .order("profiles(name)");

  if (alunosErr) throw new Error(alunosErr.message);

  const alunosIds = (turmaAlunos ?? []).map((x: any) => String(x.aluno_id));

  // Busca notas já lançadas para a avaliação
  const notasMap = new Map<string, number | null>();
  if (alunosIds.length > 0) {
    const { data: notas, error: notasErr } = await supabase
      .from("notas")
      .select("aluno_id, value")
      .eq("avaliacao_id", input.avaliacaoId)
      .in("aluno_id", alunosIds);

    if (notasErr) throw new Error(notasErr.message);

    for (const n of notas ?? []) {
      notasMap.set(String(n.aluno_id), n.value == null ? null : Number(n.value));
    }
  }

  // Se você tiver matrícula em alguma tabela/coluna, você pode plugar aqui depois.
  // Por enquanto, retorna null sem quebrar o layout.
  return (turmaAlunos ?? []).map((row: any) => {
    const p = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    const alunoId = String(row.aluno_id);

    return {
      alunoId,
      alunoName: (p?.name as string | undefined) ?? "Aluno",
      etiquetas: null,
      nota: notasMap.has(alunoId) ? (notasMap.get(alunoId) as any) : null,
    };
  });
}

/**
 * Salva em lote as notas digitadas no NotasClient.
 * Mantém o nome que seu NotasClient.tsx já está importando.
 */
export async function upsertGradesBulk(input: {
  teacherId: string;
  turmaId: string;
  avaliacaoId: string;
  grades: Array<{ alunoId: string; nota: number | null }>;
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== input.teacherId) throw new Error("Acesso inválido.");

  // Valida permissão via avaliação -> turma do professor (igual você já faz)
  const supabase = await createServerSupabaseClient();

  const { data: avaliacao, error: avaliacaoErr } = await supabase
    .from("avaliacoes")
    .select("id, turma_id, turmas!inner(professor_id)")
    .eq("id", input.avaliacaoId)
    .single();

  if (avaliacaoErr) throw new Error(avaliacaoErr.message);
  if (!avaliacao) throw new Error("Avaliação não encontrada.");
  if (String(avaliacao.turma_id) !== String(input.turmaId)) {
    throw new Error("Avaliação não pertence à turma selecionada.");
  }

  const turmaJoin = avaliacao.turmas as unknown as { professor_id: string };
  if (turmaJoin?.professor_id !== profile.user_id) {
    throw new Error("Você não tem permissão para editar notas desta turma.");
  }

  // Salva nota por nota reaproveitando sua action existente (mantém auditoria/revalidate)
  for (const g of input.grades ?? []) {
    if (g.nota === null || g.nota === undefined) continue;

    await upsertNota({
      avaliacaoId: input.avaliacaoId,
      alunoId: g.alunoId,
      value: g.nota,
    });
  }

  revalidatePath("/professores/notas");
}
