"use server";

import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { revalidatePath } from "next/cache";

export type TurmaPrecoRow = {
  id: string;
  turmaId: string;
  turmaTag: string;
  disciplinaName: string | null;
  professorName: string | null;
  duracaoMeses: number;
  valorMensalidade: number;
  diaVencimento: number;
  inicioCompetencia: string | null;
  ativo: boolean;
};

function normalizeMoney(value: unknown) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100) / 100;
}

function firstDayOfMonth(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function addMonths(date: Date, months: number) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, date.getUTCDate()),
  );
}

function toISODateUTC(date: Date) {
  return date.toISOString().slice(0, 10);
}

function dueDateFromCompetence(competenceDate: Date, dueDay: number) {
  const year = competenceDate.getUTCFullYear();
  const month = competenceDate.getUTCMonth();
  return new Date(Date.UTC(year, month, dueDay));
}

async function requireRole(allowed: string[]) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const role = profile.role ?? "";
  if (!allowed.includes(role)) {
    throw new Error("Sem permissão.");
  }

  return profile;
}

export async function listTurmasPrecos(): Promise<TurmaPrecoRow[]> {
  await requireRole(["administrativo", "recepção"]);
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("turma_precos")
    .select(
      `
        id,
        turma_id,
        duracao_meses,
        valor_mensalidade,
        dia_vencimento,
        inicio_competencia,
        ativo,
        turmas:turmas!turma_precos_turma_id_fkey(
          id,
          tag,
          disciplinas:disciplinas!turmas_disciplina_id_fkey(name),
          profiles:profiles!turmas_professor_id_fkey(name)
        )
      `,
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row: any) => {
    const turma = Array.isArray(row.turmas) ? row.turmas[0] : row.turmas;
    const disciplina = Array.isArray(turma?.disciplinas)
      ? turma.disciplinas[0]
      : turma?.disciplinas;
    const professor = Array.isArray(turma?.profiles)
      ? turma.profiles[0]
      : turma?.profiles;

    return {
      id: String(row.id),
      turmaId: String(row.turma_id),
      turmaTag: String(turma?.tag ?? "Turma"),
      disciplinaName: disciplina?.name ? String(disciplina.name) : null,
      professorName: professor?.name ? String(professor.name) : null,
      duracaoMeses: Number(row.duracao_meses ?? 0),
      valorMensalidade: Number(row.valor_mensalidade ?? 0),
      diaVencimento: Number(row.dia_vencimento ?? 10),
      inicioCompetencia: row.inicio_competencia
        ? String(row.inicio_competencia)
        : null,
      ativo: Boolean(row.ativo),
    };
  });
}

export async function listTurmasForPricingPicker(): Promise<
  { id: string; label: string }[]
> {
  await requireRole(["administrativo", "recepção"]);
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("turmas")
    .select(
      `
        id,
        tag,
        disciplinas:disciplinas!turmas_disciplina_id_fkey(name)
      `,
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row: any) => {
    const disciplina = Array.isArray(row.disciplinas)
      ? row.disciplinas[0]
      : row.disciplinas;

    return {
      id: String(row.id),
      label: `${String(row.tag ?? "Turma")} - ${String(disciplina?.name ?? "Sem disciplina")}`,
    };
  });
}

export async function upsertTurmaPreco(input: {
  turmaId: string;
  duracaoMeses: number;
  valorMensalidade: number;
  diaVencimento: number;
  inicioCompetencia?: string | null;
  ativo?: boolean;
}) {
  const profile = await requireRole(["administrativo", "recepção"]);
  const supabase = await createServerSupabaseClient();

  const turmaId = String(input.turmaId ?? "").trim();
  if (!turmaId) throw new Error("Turma inválida.");

  const duracaoMeses = Number(input.duracaoMeses);
  if (!Number.isInteger(duracaoMeses) || duracaoMeses < 1 || duracaoMeses > 60) {
    throw new Error("Duração deve estar entre 1 e 60 meses.");
  }

  const valorMensalidade = normalizeMoney(input.valorMensalidade);
  if (valorMensalidade === null || valorMensalidade <= 0) {
    throw new Error("Valor mensalidade deve ser maior que zero.");
  }

  const diaVencimento = Number(input.diaVencimento);
  if (!Number.isInteger(diaVencimento) || diaVencimento < 1 || diaVencimento > 28) {
    throw new Error("Dia de vencimento deve estar entre 1 e 28.");
  }

  const inicioCompetencia = input.inicioCompetencia
    ? String(input.inicioCompetencia).slice(0, 10)
    : null;

  const { error } = await supabase.from("turma_precos").upsert(
    {
      turma_id: turmaId,
      duracao_meses: duracaoMeses,
      valor_mensalidade: valorMensalidade,
      dia_vencimento: diaVencimento,
      inicio_competencia: inicioCompetencia,
      ativo: input.ativo ?? true,
      updated_at: new Date().toISOString(),
      created_by: profile.user_id,
    },
    { onConflict: "turma_id" },
  );

  if (error) throw new Error(error.message);

  await syncMensalidadesForTurma(turmaId);

  revalidatePath("/admin/precos");
  revalidatePath("/recepcao/precos");
  revalidatePath("/admin/financeiro");
  revalidatePath("/recepcao/financeiro");
  revalidatePath("/aluno/financeiro");
}

export async function syncMensalidadesForTurma(turmaId: string) {
  await requireRole(["administrativo", "recepção"]);
  const supabase = await createServerSupabaseClient();

  const { data: vinculados, error } = await supabase
    .from("turma_alunos")
    .select("aluno_id")
    .eq("turma_id", turmaId);

  if (error) throw new Error(error.message);

  for (const row of vinculados ?? []) {
    await generateMensalidadesForEnrollment({
      turmaId,
      studentId: String(row.aluno_id),
    });
  }
}

export async function generateMensalidadesForEnrollment(input: {
  turmaId: string;
  studentId: string;
}) {
  const turmaId = String(input.turmaId ?? "").trim();
  const studentId = String(input.studentId ?? "").trim();
  if (!turmaId || !studentId) return;

  const supabase = await createServerSupabaseClient();

  const { data: pricing, error: pricingError } = await supabase
    .from("turma_precos")
    .select(
      "turma_id, duracao_meses, valor_mensalidade, dia_vencimento, inicio_competencia, ativo",
    )
    .eq("turma_id", turmaId)
    .eq("ativo", true)
    .single();

  if (pricingError || !pricing) {
    return;
  }

  const { data: turma } = await supabase
    .from("turmas")
    .select("start_date")
    .eq("id", turmaId)
    .single();

  const baseDateRaw =
    pricing.inicio_competencia ??
    turma?.start_date ??
    new Date().toISOString().slice(0, 10);

  const baseDate = firstDayOfMonth(new Date(`${baseDateRaw}T00:00:00Z`));
  const duracao = Number(pricing.duracao_meses ?? 0);
  const valor = Number(pricing.valor_mensalidade ?? 0);
  const dueDay = Number(pricing.dia_vencimento ?? 10);

  if (!Number.isInteger(duracao) || duracao <= 0) return;
  if (!Number.isFinite(valor) || valor <= 0) return;
  if (!Number.isInteger(dueDay) || dueDay < 1 || dueDay > 28) return;

  const now = new Date().toISOString();

  for (let i = 0; i < duracao; i++) {
    const competenceDate = addMonths(baseDate, i);
    const dueDate = dueDateFromCompetence(competenceDate, dueDay);

    const { error } = await supabase.from("mensalidades").upsert(
      {
        aluno_id: studentId,
        turma_id: turmaId,
        competence_year: competenceDate.getUTCFullYear(),
        competence_month: competenceDate.getUTCMonth() + 1,
        due_date: toISODateUTC(dueDate),
        status: "pendente",
        predicted_value: valor,
        updated_at: now,
      },
      {
        onConflict: "aluno_id,turma_id,competence_year,competence_month",
        ignoreDuplicates: true,
      },
    );

    if (error) throw new Error(error.message);
  }
}
