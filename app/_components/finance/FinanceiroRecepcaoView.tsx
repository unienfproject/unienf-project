"use client";

import StatusBadge from "@/app/_components/StatusBadge";
import {
  listMensalidadesForRecepcao,
  markMensalidadeAsPaid,
  type PaymentMethod,
  type MensalidadeRow,
} from "@/app/_lib/actions/mensalidades";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const methods: { value: PaymentMethod; label: string }[] = [
  { value: "dinheiro", label: "Dinheiro" },
  { value: "pix", label: "Pix" },
  { value: "debito", label: "Débito" },
  { value: "credito", label: "Crédito" },
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
  const router = useRouter();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<MensalidadeRow[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const allMensalidades = await listMensalidadesForRecepcao({
        status: "todos",
      });
      const filtered = allMensalidades.filter(
        (m) => m.competenceYear === year && m.competenceMonth === month,
      );
      setRows(filtered);
    } catch (error) {
      console.error("Erro ao carregar mensalidades:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao carregar mensalidades.",
      );
    } finally {
      setLoading(false);
    }
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
                    try {
                      await markMensalidadeAsPaid({
                        mensalidadeId: r.id,
                        valorPago: data.paidAmount,
                        formaPagamento: data.paymentMethod,
                        dataPagamento: data.paidAt,
                      });
                      router.refresh();
                      await load();
                    } catch (error) {
                      console.error(
                        "Erro ao marcar mensalidade como paga:",
                        error,
                      );
                      alert(
                        error instanceof Error
                          ? error.message
                          : "Erro ao marcar mensalidade como paga.",
                      );
                    }
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
}: {
  row: MensalidadeRow;
  onPaid: (data: {
    paidAmount: number;
    paidAt: string;
    paymentMethod: PaymentMethod;
  }) => Promise<void>;
}) {
  const [amount, setAmount] = useState(row.valorPago ?? 350);
  const [date, setDate] = useState(
    row.dataPagamento ?? new Date().toISOString().slice(0, 10),
  );
  const [method, setMethod] = useState<PaymentMethod>(
    (row.formaPagamento ?? "pix") as PaymentMethod,
  );

  return (
    <tr className="border-b last:border-b-0">
      <td className="p-3 font-medium text-slate-900">{row.studentName}</td>

      <td className="p-3">
        {row.status === "pago" ? (
          <StatusBadge label="Pago" variant="green" />
        ) : (
          <StatusBadge label="Pendente" variant="yellow" />
        )}
      </td>

      <td className="p-3">
        {row.status === "pago" ? (
          <span className="text-slate-700">
            R$ {row.valorPago?.toFixed(2) ?? "0.00"}
          </span>
        ) : (
          <input
            className="w-[140px] rounded-md border px-2 py-1 text-sm"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        )}
      </td>

      <td className="p-3">
        {row.status === "pago" ? (
          <span className="text-slate-700">
            {row.formaPagamento
              ? (methods.find((m) => m.value === row.formaPagamento)?.label ??
                row.formaPagamento)
              : "-"}
          </span>
        ) : (
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
        )}
      </td>

      <td className="p-3">
        {row.status === "pago" ? (
          <span className="text-slate-700">
            {row.dataPagamento
              ? new Date(row.dataPagamento).toLocaleDateString("pt-BR")
              : "-"}
          </span>
        ) : (
          <input
            type="date"
            className="w-[160px] rounded-md border px-2 py-1 text-sm"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        )}
      </td>

      <td className="flex flex-wrap gap-2 p-3">
        {row.status === "pago" ? (
          <span className="text-sm text-slate-600">Pagamento registrado</span>
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

        {row.status === "pago" && (
          <button
            onClick={() => window.print()}
            className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50"
          >
            Imprimir recibo
          </button>
        )}
      </td>
    </tr>
  );
}
