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
  const rows = await listMyMensalidades();

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
          <p className="px-4 pb-2 text-sm text-slate-500">
            Matrícula: {studentId}
          </p>
        </div>

        <div className="gap-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="border-b p-4">
            <h2 className="font-semibold text-slate-900">Mensalidades</h2>
            <p className="text-sm text-slate-600">
              Parcelas por competência, turma e status.
            </p>
          </div>

          <div className="overflow-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="p-3 text-left font-semibold text-slate-700">
                    Competência
                  </th>
                  <th className="p-3 text-left font-semibold text-slate-700">
                    Turma / Curso
                  </th>
                  <th className="p-3 text-left font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="p-3 text-left font-semibold text-slate-700">
                    Mensalidade
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
                      {monthLabel(r.competenceMonth)}/{r.competenceYear}
                    </td>
                    <td className="p-3 text-slate-700">
                      <div className="font-medium text-slate-900">
                        {r.turmaTag ?? "Turma não informada"}
                      </div>
                      <div className="text-xs text-slate-600">
                        {r.disciplinaName ?? "Curso não informado"}
                      </div>
                    </td>
                    <td className="p-3">
                      {r.status === "pago" ? (
                        <StatusBadge label="Pago" variant="green" />
                      ) : (
                        <StatusBadge label="Pendente" variant="yellow" />
                      )}
                    </td>
                    <td className="p-3 text-slate-700">
                      R$ {r.valor_mensalidade.toFixed(2)}
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
                    <td colSpan={7} className="p-6 text-center text-slate-500">
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
