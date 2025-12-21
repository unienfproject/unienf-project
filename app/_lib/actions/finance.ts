export type MensalidadeStatus = "pendente" | "pago";
export type FormaPagamento = "dinheiro" | "pix" | "debito" | "credito";

export type MensalidadeRow = {
  id: string;
  studentId: string;
  studentName: string;

  competenceYear: number;
  competenceMonth: number;

  status: MensalidadeStatus;

  valor_mensalidade: number;

  valorPago: number | null;
  formaPagamento: FormaPagamento | null;

  dataPagamento: string | null;
};

export type MonthlySummary = {
  year: number;
  month: number; // 1-12
  totalPaid: number;
  prevMonthTotalPaid: number;
  delta: number;
  deltaPct: number | null;
};

export type InternalCost = {
  id: string;
  competenceYear: number;
  competenceMonth: number; // 1-12
  category: string;
  description: string;
  amount: number;

  // ISO datetime para custos
  incurredAt: string; // ISO
};

export type Cost = {
  id: string;
  category: string;
  description: string;
  amount: number;
  incurredAt: string;
};

export type MensalidadeRow = {
  id: string;
  student_id: string;
  name?: string | null; // se existir, ótimo; se não existir, buscar via profiles
  competence_year: number;
  competence_month: number;
  status: "pago" | "pendente";
  valor_mensalidade: number; // previsto
  valor_pago: number | null; // pago
  forma_pagamento?: "dinheiro" | "pix" | "debito" | "credito" | null;
  data_pagamento?: string | null; // YYYY-MM-DD
};

export async function getMensalidadesByMonth(
  year: number,
  month: number,
): Promise<MensalidadeRow[]> {
  // TODO SUPABASE:
  // - Tabela: mensalidade
  // - Campos esperados: competence_year, competence_month, status, valor_mensalidade, valor_pago, forma_pagamento, data_pagamento, student_id
  // - Exemplo:
  // const supabase = createServerSupabaseClient();
  // const { data, error } = await supabase
  //   .from("mensalidade")
  //   .select("id, student_id, competence_year, competence_month, status, valor_mensalidade, valor_pago, forma_pagamento, data_pagamento")
  //   .eq("competence_year", _year)
  //   .eq("competence_month", _month);
  // if (error) throw new Error(error.message);
  // return (data ?? []) as MensalidadeRow[];

  return []; // placeholder para não quebrar enquanto você não conecta no Supabase
}

export async function getFinanceiroEntriesByMonth(
  _year: number,
  _month: number,
) {
  // TODO SUPABASE:
  // - Tabela: financeiro
  // - Definir colunas: tipo (entrada/saida), valor, categoria, data, etc.
  // - Exemplo de select:
  // const supabase = createServerSupabaseClient();
  // const { data, error } = await supabase
  //   .from("financeiro")
  //   .select("id, tipo, valor, categoria, data")
  //   .eq("competence_year", _year)
  //   .eq("competence_month", _month);
  // if (error) throw new Error(error.message);
  // return data ?? [];

  return []; // placeholder
}
