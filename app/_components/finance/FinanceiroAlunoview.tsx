import StatusBadge from "@/app/_components/StatusBadge";
import { listMyMensalidades } from "@/app/_lib/actions/mensalidades";

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
  const year = new Date().getFullYear();
  const allMensalidades = await listMyMensalidades();
  const rows = allMensalidades.filter((m) => m.competenceYear === year);

  return (
    <div className="flex flex-col">
      <main className="p-4">
      <div>
        <h1 className="gap-4 p-4 text-2xl font-bold text-slate-900">
          Financeiro
        </h1>
        <p className="gap-4 p-4 text-xl text-slate-600">
          Aluno:{" "}
          <span className="font-medium text-slate-900">{studentName}</span>
        </p>
      </div>

      <div className="gap-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
                    {r.status === "pago" ? (
                      <StatusBadge label="Pago" variant="green" />
                    ) : (
                      <StatusBadge label="Pendente" variant="yellow" />
                    )}
                  </td>
                  <td className="p-3 text-slate-700">
                    {r.valorPago ? `R$ ${r.valorPago.toFixed(2)}` : "-"}
                  </td>
                  <td className="p-3 text-slate-700">
                    {r.formaPagamento ?? "-"}
                  </td>
                  <td className="p-3 text-slate-700">
                    {r.dataPagamento ?? "-"}
                  </td>
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
      </main>
    </div>
  );
}
