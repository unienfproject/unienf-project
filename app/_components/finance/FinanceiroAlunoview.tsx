import StatusBadge from "@/app/_components/StatusBadge";
import { getStudentInstallments } from "../../_lib/mockdata/finance.mock";

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

export default async function FinanceiroAlunoView({
  studentId,
  studentName,
}: {
  studentId: string;
  studentName: string;
}) {
  const year = 2025; // você pode tornar isso selecionável depois
  const rows = await getStudentInstallments(studentId, year);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Financeiro</h1>
        <p className="text-slate-600">
          Aluno:{" "}
          <span className="font-medium text-slate-900">{studentName}</span>
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b p-4">
          <h2 className="font-semibold text-slate-900">Mensalidades {year}</h2>
          <p className="text-sm text-slate-600">
            Visualize pagamentos, valores, forma e data.
          </p>
        </div>

        <div className="overflow-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="p-3 text-left font-semibold text-slate-700">
                  Mês
                </th>
                <th className="p-3 text-left font-semibold text-slate-700">
                  Status
                </th>
                <th className="p-3 text-left font-semibold text-slate-700">
                  Valor pago
                </th>
                <th className="p-3 text-left font-semibold text-slate-700">
                  Forma
                </th>
                <th className="p-3 text-left font-semibold text-slate-700">
                  Data
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b last:border-b-0">
                  <td className="p-3 font-medium text-slate-900">
                    {monthLabel(r.competenceMonth)}
                  </td>
                  <td className="p-3">
                    {r.status === "paid" ? (
                      <StatusBadge label="Pago" variant="green" />
                    ) : (
                      <StatusBadge label="Pendente" variant="yellow" />
                    )}
                  </td>
                  <td className="p-3 text-slate-700">
                    {r.paidAmount ? `R$ ${r.paidAmount.toFixed(2)}` : "-"}
                  </td>
                  <td className="p-3 text-slate-700">
                    {r.paymentMethod ?? "-"}
                  </td>
                  <td className="p-3 text-slate-700">{r.paidAt ?? "-"}</td>
                </tr>
              ))}
              {!rows.length ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-500">
                    Sem mensalidades geradas.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
