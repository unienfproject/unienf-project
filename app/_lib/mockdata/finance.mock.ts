import { InternalCost, MonthlySummary } from "@/app/_lib/actions/finance";
import { TuitionInstallment } from "@/app/_lib/actions/mensalidades";

const installments: TuitionInstallment[] = [
  {
    id: "p1",
    studentId: "stu-001",
    studentName: "Maria Silva",
    competenceYear: 2025,
    competenceMonth: 1,
    status: "pago",
    valor_mensalidade: 350,
    valorPago: 350,
    dataPagamento: "2025-01-05",
    formaPagamento: "pix",
  },
  {
    id: "p2",
    studentId: "stu-001",
    studentName: "Maria Silva",
    competenceYear: 2025,
    competenceMonth: 2,
    status: "pago",
    valor_mensalidade: 350,
    valorPago: 350,
    dataPagamento: "2025-02-05",
    formaPagamento: "pix",
  },
  {
    id: "p3",
    studentId: "stu-001",
    studentName: "Maria Silva",
    competenceYear: 2025,
    competenceMonth: 3,
    status: "pendente",
    valor_mensalidade: 350,
    valorPago: null,
    dataPagamento: null,
    formaPagamento: null,
  },

  {
    id: "p4",
    studentId: "stu-002",
    studentName: "João Pereira",
    competenceYear: 2025,
    competenceMonth: 1,
    status: "pago",
    valor_mensalidade: 350,
    valorPago: 350,
    dataPagamento: "2025-01-10",
    formaPagamento: "dinheiro",
  },
  {
    id: "p5",
    studentId: "stu-002",
    studentName: "João Pereira",
    competenceYear: 2025,
    competenceMonth: 2,
    status: "pendente",
    valor_mensalidade: 350,
    valorPago: null,
    dataPagamento: null,
    formaPagamento: null,
  },
];

const costs: InternalCost[] = [
  {
    id: "c1",
    competenceYear: 2025,
    competenceMonth: 2,
    category: "Aluguel",
    description: "Aluguel unidade",
    amount: 4200,
    incurredAt: "2025-02-01",
  },
  {
    id: "c2",
    competenceYear: 2025,
    competenceMonth: 2,
    category: "Internet",
    description: "Link dedicado",
    amount: 380,
    incurredAt: "2025-02-03",
  },
];

export async function getStudentInstallments(
  studentId: string,
  year: number,
): Promise<TuitionInstallment[]> {
  return installments.filter(
    (i) => i.studentId === studentId && i.competenceYear === year,
  );
}

export async function getAllInstallmentsByMonth(
  year: number,
  month: number,
): Promise<TuitionInstallment[]> {
  return installments.filter(
    (i) => i.competenceYear === year && i.competenceMonth === month,
  );
}

export async function markInstallmentPaid(
  installmentId: string,
  patch: {
    paidAmount: number;
    paidAt: string;
    paymentMethod: "dinheiro" | "pix" | "debito" | "credito";
  },
): Promise<void> {
  const idx = installments.findIndex((i) => i.id === installmentId);
  if (idx === -1) return;

  installments[idx] = {
    ...installments[idx],
    status: "pago",
    valorPago: patch.paidAmount,
    dataPagamento: patch.paidAt,
    formaPagamento: patch.paymentMethod,
  };
}

export async function markInstallmentPending(
  installmentId: string,
): Promise<void> {
  const idx = installments.findIndex((i) => i.id === installmentId);
  if (idx === -1) return;

  installments[idx] = {
    ...installments[idx],
    status: "pendente",
    valorPago: null,
    dataPagamento: null,
    formaPagamento: null,
  };
}

export async function getMonthlySummary(
  year: number,
  month: number,
): Promise<MonthlySummary> {
  const totalPaid = installments
    .filter(
      (i) =>
        i.competenceYear === year &&
        i.competenceMonth === month &&
        i.status === "pago",
    )
    .reduce((acc, cur) => acc + (cur.valorPago ?? 0), 0);

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;

  const prevMonthTotalPaid = installments
    .filter(
      (i) =>
        i.competenceYear === prevYear &&
        i.competenceMonth === prevMonth &&
        i.status === "pago",
    )
    .reduce((acc, cur) => acc + (cur.valorPago ?? 0), 0);

  const delta = totalPaid - prevMonthTotalPaid;
  const deltaPct =
    prevMonthTotalPaid > 0 ? (delta / prevMonthTotalPaid) * 100 : null;

  return { year, month, totalPaid, prevMonthTotalPaid, delta, deltaPct };
}

export async function getCostsByMonth(
  year: number,
  month: number,
): Promise<InternalCost[]> {
  return costs.filter(
    (c) => c.competenceYear === year && c.competenceMonth === month,
  );
}

export async function createCost(
  cost: Omit<InternalCost, "id">,
): Promise<void> {
  costs.push({ ...cost, id: `c${costs.length + 1}` });
}
