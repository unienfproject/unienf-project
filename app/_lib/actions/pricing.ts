"use server";

import { createServerSupabaseClient } from "@/app/_lib/supabase/server";

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
