import StatusBadge from "@/app/_components/StatusBadge";
import {
  getMonthlySummary,
  getCostsByMonth,
} from "../../_lib/mockdata/finance.mock";

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

export default async function FinanceiroAdminView() {
  const year = 2025;
  const month = 2;

  const summary = await getMonthlySummary(year, month);
  const costs = await getCostsByMonth(year, month);

  const totalCosts = costs.reduce((acc, cur) => acc + cur.amount, 0);
  const net = summary.totalPaid - totalCosts;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Financeiro</h1>
        <p className="text-slate-600">
          Administrativo: visão geral, progressão mensal e custos internos.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card
          title={`Recebido em ${monthLabel(month)}/${year}`}
          value={`R$ ${summary.totalPaid.toFixed(2)}`}
          badge={<StatusBadge label="Entradas" variant="blue" />}
        />
        <Card
          title={`Custos em ${monthLabel(month)}/${year}`}
          value={`R$ ${totalCosts.toFixed(2)}`}
          badge={<StatusBadge label="Custos" variant="gray" />}
        />
        <Card
          title="Saldo do mês"
          value={`R$ ${net.toFixed(2)}`}
          badge={
            <StatusBadge
              label="Resultado"
              variant={net >= 0 ? "green" : "yellow"}
            />
          }
        />
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Progressão em relação ao mês anterior
        </h2>
        <p className="text-sm text-slate-600">
          Mês atual: R$ {summary.totalPaid.toFixed(2)} | Mês anterior: R${" "}
          {summary.prevMonthTotalPaid.toFixed(2)} | Diferença: R${" "}
          {summary.delta.toFixed(2)}
          {summary.deltaPct === null
            ? ""
            : ` (${summary.deltaPct.toFixed(1)}%)`}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b p-4">
          <h2 className="font-semibold text-slate-900">
            Custos internos do mês
          </h2>
          <p className="text-sm text-slate-600">
            Lançamentos internos para controle administrativo.
          </p>
        </div>

        <div className="overflow-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="p-3 text-left font-semibold text-slate-700">
                  Categoria
                </th>
                <th className="p-3 text-left font-semibold text-slate-700">
                  Descrição
                </th>
                <th className="p-3 text-left font-semibold text-slate-700">
                  Valor
                </th>
                <th className="p-3 text-left font-semibold text-slate-700">
                  Data
                </th>
              </tr>
            </thead>
            <tbody>
              {costs.map((c) => (
                <tr key={c.id} className="border-b last:border-b-0">
                  <td className="p-3 font-medium text-slate-900">
                    {c.category}
                  </td>
                  <td className="p-3 text-slate-700">{c.description}</td>
                  <td className="p-3 text-slate-700">{`R$ ${c.amount.toFixed(2)}`}</td>
                  <td className="p-3 text-slate-700">{c.incurredAt}</td>
                </tr>
              ))}
              {!costs.length ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-500">
                    Sem custos lançados.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="border-t p-4 text-xs text-slate-500">
          Próximo passo: adicionar formulário e Server Action para criar custos
          no Supabase com permissão apenas do ADMINISTRATIVO.
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  badge,
}: {
  title: string;
  value: string;
  badge: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        {badge}
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}
