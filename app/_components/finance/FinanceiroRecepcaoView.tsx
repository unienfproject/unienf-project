"use client";

import { useMemo, useState } from "react";
import StatusBadge from "@/app/_components/StatusBadge";
import {
  getAllInstallmentsByMonth,
  markInstallmentPaid,
  markInstallmentPending,
} from "../../_lib/mockdata/finance.mock";
import type {
  PaymentMethod,
  TuitionInstallment,
} from "@/app/_lib/actions/finance";

const methods: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Dinheiro" },
  { value: "pix", label: "Pix" },
  { value: "debit", label: "Débito" },
  { value: "credit", label: "Crédito" },
];

function monthLabel(month: number) {
  return (
    [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ][month - 1] ?? `M${month}`
  );
}

export default function FinanceiroRecepcaoView() {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(2);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<TuitionInstallment[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const data = await getAllInstallmentsByMonth(year, month);
    setRows(data);
    setLoading(false);
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) => r.studentName.toLowerCase().includes(term));
  }, [rows, search]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Financeiro</h1>
        <p className="text-slate-600">
          Recepção: marcar mensalidades como pagas e imprimir recibo.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-slate-700">Ano</span>
            <input
              className="w-[120px] rounded-md border px-3 py-2 text-sm"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm text-slate-700">Mês</span>
            <select
              className="w-[160px] rounded-md border px-3 py-2 text-sm"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {monthLabel(i + 1)}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={load}
            className="rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600"
          >
            {loading ? "Carregando..." : "Carregar"}
          </button>

          <div className="min-w-[240px] flex-1">
            <span className="text-sm text-slate-700">Buscar aluno</span>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="Nome do aluno..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b p-4">
          <h2 className="font-semibold text-slate-900">
            Mensalidades de {monthLabel(month)}/{year}
          </h2>
        </div>

        <div className="overflow-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="p-3 text-left font-semibold text-slate-700">
                  Aluno
                </th>
                <th className="p-3 text-left font-semibold text-slate-700">
                  Status
                </th>
                <th className="p-3 text-left font-semibold text-slate-700">
                  Valor
                </th>
                <th className="p-3 text-left font-semibold text-slate-700">
                  Forma
                </th>
                <th className="p-3 text-left font-semibold text-slate-700">
                  Data
                </th>
                <th className="p-3 text-left font-semibold text-slate-700">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((r) => (
                <Row
                  key={r.id}
                  row={r}
                  onPaid={async (data) => {
                    await markInstallmentPaid(r.id, data);
                    await load();
                  }}
                  onPending={async () => {
                    await markInstallmentPending(r.id);
                    await load();
                  }}
                />
              ))}

              {!filtered.length ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">
                    Sem registros no período.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-xs text-slate-500">
        Recibo: neste exemplo, você pode implementar como página de impressão
        /dashboard/financeiro/recibo/[id] ou geração de PDF via server action.
      </div>
    </div>
  );
}

function Row({
  row,
  onPaid,
  onPending,
}: {
  row: TuitionInstallment;
  onPaid: (data: {
    paidAmount: number;
    paidAt: string;
    paymentMethod: PaymentMethod;
  }) => Promise<void>;
  onPending: () => Promise<void>;
}) {
  const [amount, setAmount] = useState(row.paidAmount ?? 350);
  const [date, setDate] = useState(
    row.paidAt ?? new Date().toISOString().slice(0, 10),
  );
  const [method, setMethod] = useState<PaymentMethod>(
    (row.paymentMethod ?? "pix") as PaymentMethod,
  );

  return (
    <tr className="border-b last:border-b-0">
      <td className="p-3 font-medium text-slate-900">{row.studentName}</td>

      <td className="p-3">
        {row.status === "paid" ? (
          <StatusBadge label="Pago" variant="green" />
        ) : (
          <StatusBadge label="Pendente" variant="yellow" />
        )}
      </td>

      <td className="p-3">
        <input
          className="w-[140px] rounded-md border px-2 py-1 text-sm"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </td>

      <td className="p-3">
        <select
          className="w-[160px] rounded-md border px-2 py-1 text-sm"
          value={method}
          onChange={(e) => setMethod(e.target.value as PaymentMethod)}
        >
          {methods.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </td>

      <td className="p-3">
        <input
          className="w-[160px] rounded-md border px-2 py-1 text-sm"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </td>

      <td className="flex flex-wrap gap-2 p-3">
        {row.status === "paid" ? (
          <button
            onClick={onPending}
            className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50"
          >
            Voltar p/ pendente
          </button>
        ) : (
          <button
            onClick={() =>
              onPaid({
                paidAmount: amount,
                paidAt: date,
                paymentMethod: method,
              })
            }
            className="rounded-md bg-sky-500 px-3 py-2 text-sm font-medium text-white hover:bg-sky-600"
          >
            Marcar pago
          </button>
        )}

        <button
          onClick={() => window.print()}
          className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50"
        >
          Imprimir recibo
        </button>
      </td>
    </tr>
  );
}
