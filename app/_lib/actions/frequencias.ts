"use server";

import { logAudit } from "@/app/_lib/actions/audit";
import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { revalidatePath } from "next/cache";

export type FrequenciaAlunoRow = {
  alunoId: string;
  alunoName: string;
  alunoEmail: string;
  totalAulas: number;
  totalFaltas: number;
  totalPresencas: number;
  percentualPresenca: number | null;
};

export type FrequenciaTurmaSummary = {
  turmaId: string;
  turmaName: string;
  disciplinaName: string;
  totalAulas: number;
  totalFaltas: number;
  totalPresencas: number;
  percentualPresenca: number | null;
};

type FrequenciaRow = {
  aluno_id: string;
  total_aulas: number | string | null;
  faltas: number | string | null;
};

type ProfileJoin = { name: string | null; email: string | null };

type TurmaAlunoWithProfile = {
  aluno_id: string;
  profiles: ProfileJoin | ProfileJoin[] | null;
};

type TurmaWithDisciplina = {
  id: string;
  tag: string | null;
  disciplinas: { name: string | null } | { name: string | null }[] | null;
};

async function assertTeacherCanManageTurma(turmaId: string) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") {
    throw new Error("Apenas professores podem lançar frequência.");
  }

  const supabase = await createServerSupabaseClient();
  const { data: turma, error } = await supabase
    .from("turmas")
    .select("id, tag, status, professor_id, disciplinas:disciplinas!turmas_disciplina_id_fkey(name)")
    .eq("id", turmaId)
    .single();

  if (error) throw new Error(error.message);
  if (!turma) throw new Error("Turma não encontrada.");
  if (String(turma.professor_id) !== profile.user_id) {
    throw new Error("Você não tem permissão para lançar frequência desta turma.");
  }

  return { profile, supabase, turma };
}

function summarize(rows: FrequenciaRow[], alunoId: string) {
  const alunoRows = rows.filter((row) => String(row.aluno_id) === alunoId);
  const totalAulas = alunoRows.reduce(
    (sum, row) => sum + Number(row.total_aulas ?? 0),
    0,
  );
  const totalFaltas = alunoRows.reduce(
    (sum, row) => sum + Number(row.faltas ?? 0),
    0,
  );
  const faltasLimitadas = Math.min(totalFaltas, totalAulas);
  const totalPresencas = Math.max(totalAulas - faltasLimitadas, 0);
  const percentualPresenca =
    totalAulas > 0 ? Math.round((totalPresencas / totalAulas) * 100) : null;

  return { totalAulas, totalFaltas, totalPresencas, percentualPresenca };
}

export async function listFrequenciaForTurma(
  turmaId: string,
): Promise<FrequenciaAlunoRow[]> {
  const { supabase } = await assertTeacherCanManageTurma(turmaId);

  const { data: turmaAlunos, error: alunosError } = await supabase
    .from("turma_alunos")
    .select(
      `
      aluno_id,
      profiles:profiles!turma_alunos_aluno_id_fkey(name, email)
    `,
    )
    .eq("turma_id", turmaId);

  if (alunosError) throw new Error(alunosError.message);

  const alunoIds = (turmaAlunos ?? []).map((row) => String(row.aluno_id));
  let frequencias: FrequenciaRow[] = [];

  if (alunoIds.length > 0) {
    const { data, error } = await supabase
      .from("frequencias")
      .select("aluno_id, total_aulas, faltas")
      .eq("turma_id", turmaId)
      .in("aluno_id", alunoIds);

    if (error) {
      if (error.code !== "42P01") {
        throw new Error(error.message);
      }
    } else {
      frequencias = (data ?? []) as FrequenciaRow[];
    }
  }

  return (turmaAlunos ?? [])
    .map((row: TurmaAlunoWithProfile) => {
      const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
      return {
        alunoId: String(row.aluno_id),
        alunoName: String(profile?.name ?? profile?.email ?? "Aluno"),
        alunoEmail: String(profile?.email ?? ""),
        ...summarize(frequencias, String(row.aluno_id)),
      };
    })
    .sort((a, b) => a.alunoName.localeCompare(b.alunoName));
}

export async function saveDailyFrequencia(input: {
  turmaId: string;
  date: string;
  presentStudentIds: string[];
}) {
  const turmaId = String(input.turmaId ?? "").trim();
  const date = String(input.date ?? "").trim();
  if (!turmaId) throw new Error("Turma inválida.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Data inválida.");

  const { profile, supabase } = await assertTeacherCanManageTurma(turmaId);
  const present = new Set((input.presentStudentIds ?? []).map(String));

  const { data: turmaAlunos, error: alunosError } = await supabase
    .from("turma_alunos")
    .select("aluno_id")
    .eq("turma_id", turmaId);

  if (alunosError) throw new Error(alunosError.message);

  const rows = (turmaAlunos ?? []).map((row) => {
    const alunoId = String(row.aluno_id);
    const isPresent = present.has(alunoId);
    return {
      turma_id: turmaId,
      aluno_id: alunoId,
      tipo: "diaria",
      data: date,
      total_aulas: 1,
      faltas: isPresent ? 0 : 1,
      presente: isPresent,
      released_by: profile.user_id,
      updated_at: new Date().toISOString(),
    };
  });

  const { error: deleteError } = await supabase
    .from("frequencias")
    .delete()
    .eq("turma_id", turmaId)
    .eq("tipo", "diaria")
    .eq("data", date);

  if (deleteError) throw new Error(deleteError.message);

  if (rows.length > 0) {
    const { error: insertError } = await supabase.from("frequencias").insert(rows);
    if (insertError) throw new Error(insertError.message);
  }

  await logAudit({
    action: "update",
    entity: "turma",
    entityId: turmaId,
    newValue: { date, presentCount: present.size, type: "frequencia_diaria" },
    description: `Lançamento de frequência diária em ${date}`,
  });

  revalidatePath("/professores/turmas");
  revalidatePath("/aluno/notas");
  revalidatePath("/admin/alunos");
}

export async function savePeriodFrequencia(input: {
  turmaId: string;
  totalClasses: number;
  absences: Array<{ alunoId: string; faltas: number }>;
}) {
  const turmaId = String(input.turmaId ?? "").trim();
  const totalClasses = Number(input.totalClasses);
  if (!turmaId) throw new Error("Turma inválida.");
  if (!Number.isInteger(totalClasses) || totalClasses < 1) {
    throw new Error("Informe a quantidade de aulas do período.");
  }

  const { profile, supabase } = await assertTeacherCanManageTurma(turmaId);
  const faltasByAluno = new Map(
    (input.absences ?? []).map((row) => [
      String(row.alunoId),
      Math.max(0, Math.min(totalClasses, Number(row.faltas) || 0)),
    ]),
  );

  const { data: turmaAlunos, error: alunosError } = await supabase
    .from("turma_alunos")
    .select("aluno_id")
    .eq("turma_id", turmaId);

  if (alunosError) throw new Error(alunosError.message);

  const now = new Date().toISOString();
  const rows = (turmaAlunos ?? []).map((row) => {
    const alunoId = String(row.aluno_id);
    return {
      turma_id: turmaId,
      aluno_id: alunoId,
      tipo: "periodo",
      data: null,
      total_aulas: totalClasses,
      faltas: faltasByAluno.get(alunoId) ?? 0,
      presente: null,
      released_by: profile.user_id,
      updated_at: now,
    };
  });

  const { error: deleteError } = await supabase
    .from("frequencias")
    .delete()
    .eq("turma_id", turmaId)
    .eq("tipo", "periodo");

  if (deleteError) throw new Error(deleteError.message);

  if (rows.length > 0) {
    const { error: insertError } = await supabase.from("frequencias").insert(rows);
    if (insertError) throw new Error(insertError.message);
  }

  await logAudit({
    action: "update",
    entity: "turma",
    entityId: turmaId,
    newValue: { totalClasses, type: "frequencia_periodo" },
    description: `Lançamento de faltas do período: ${totalClasses} aula(s)`,
  });

  revalidatePath("/professores/turmas");
  revalidatePath("/aluno/notas");
  revalidatePath("/admin/alunos");
}

async function listFrequenciasByStudentInternal(
  studentId: string,
  allowedRoles: string[],
  options: { turmaId?: string } = {},
): Promise<FrequenciaTurmaSummary[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (!allowedRoles.includes(profile.role ?? "")) {
    throw new Error("Sem permissão para listar frequência do aluno.");
  }

  const supabase = await createServerSupabaseClient();
  const { data: turmaAlunos, error: turmasError } = await supabase
    .from("turma_alunos")
    .select("turma_id")
    .eq("aluno_id", studentId);

  if (turmasError) {
    if (turmasError.code === "42P01") return [];
    throw new Error(turmasError.message);
  }

  let turmaIds = (turmaAlunos ?? []).map((row) => String(row.turma_id));
  const requestedTurmaId = options.turmaId?.trim();
  if (requestedTurmaId) {
    turmaIds = turmaIds.filter((turmaId) => turmaId === requestedTurmaId);
  }
  if (turmaIds.length === 0) return [];

  let turmasQuery = supabase
    .from("turmas")
    .select("id, tag, disciplinas:disciplinas!turmas_disciplina_id_fkey(name)")
    .in("id", turmaIds);

  if (profile.role === "professor") {
    turmasQuery = turmasQuery.eq("professor_id", profile.user_id);
  }

  const { data: turmas, error: turmasDataError } = await turmasQuery;

  if (turmasDataError) throw new Error(turmasDataError.message);

  const { data: frequencias, error: frequenciasError } = await supabase
    .from("frequencias")
    .select("turma_id, aluno_id, total_aulas, faltas")
    .eq("aluno_id", studentId)
    .in("turma_id", turmaIds);

  if (frequenciasError) {
    if (frequenciasError.code === "42P01") return [];
    throw new Error(frequenciasError.message);
  }

  const rows = (frequencias ?? []) as Array<FrequenciaRow & { turma_id: string }>;

  return ((turmas ?? []) as TurmaWithDisciplina[]).map((turma) => {
    const disciplina = Array.isArray(turma.disciplinas)
      ? turma.disciplinas[0]
      : turma.disciplinas;
    const resumo = summarize(
      rows.filter((row) => String(row.turma_id) === String(turma.id)),
      studentId,
    );

    return {
      turmaId: String(turma.id),
      turmaName: String(turma.tag ?? "Turma"),
      disciplinaName: String(disciplina?.name ?? "Disciplina"),
      ...resumo,
    };
  });
}

export async function listMyFrequencias(): Promise<FrequenciaTurmaSummary[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "aluno") throw new Error("Esta função é apenas para alunos.");
  return listFrequenciasByStudentInternal(profile.user_id, ["aluno"]);
}

export async function listFrequenciasByStudent(
  studentId: string,
  options: { turmaId?: string } = {},
): Promise<FrequenciaTurmaSummary[]> {
  return listFrequenciasByStudentInternal(studentId, [
    "recepção",
    "administrativo",
    "coordenação",
    "professor",
  ], options);
}
