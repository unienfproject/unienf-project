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
  month: number;
  totalPaid: number;
  prevMonthTotalPaid: number;
  delta: number;
  deltaPct: number | null;
};

export type InternalCost = {
  id: string;
  competenceYear: number;
  competenceMonth: number;
  category: string;
  description: string;
  amount: number;
  incurredAt: string;
};

export type Cost = {
  id: string;
  category: string;
  description: string;
  amount: number;
  incurredAt: string;
};

export async function getMensalidadesByMonth(
  year: number,
  month: number,
): Promise<MensalidadeRow[]> {
  return [];
}

export async function getFinanceiroEntriesByMonth(
  _year: number,
  _month: number,
) {
  return [];
}
