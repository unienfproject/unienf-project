export type PaymentStatus = "pending" | "paid";
export type PaymentMethod = "cash" | "pix" | "debit" | "credit";

export type TuitionInstallment = {
  id: string;
  studentId: string;
  studentName: string;
  competenceYear: number;
  competenceMonth: number; // 1-12
  status: PaymentStatus;

  paidAmount?: number | null;
  paidAt?: string | null; // ISO date/time
  paymentMethod?: PaymentMethod | null;
};

export type MonthlySummary = {
  year: number;
  month: number; // 1-12
  totalPaid: number;
  prevMonthTotalPaid: number;
  delta: number; // totalPaid - prevMonthTotalPaid
  deltaPct: number | null; // percentual, null se não existe base
};

export type InternalCost = {
  id: string;
  competenceYear: number;
  competenceMonth: number;
  category: string;
  description: string;
  amount: number;
  incurredAt: string; // ISO
};
