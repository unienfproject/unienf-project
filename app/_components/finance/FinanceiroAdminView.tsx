import StatusBadge from "@/app/_components/StatusBadge";
import {
  Cost,
  MensalidadeRow,
  getFinanceiroEntriesByMonth,
  getMensalidadesByMonth,
} from "@/app/_lib/actions/finance";
import CreateCostModal from "./CreateCostModal";

import {
  getCostsByMonth,
  getMonthlySummary,
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

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatPct(value: number | null) {
  if (value === null) return "-";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function computeCostInsights(costs: Cost[]) {
  const totalCosts = costs.reduce((acc, cur) => acc + cur.amount, 0);
  const count = costs.length;

  const maxCost = costs.reduce<Cost | null>((best, cur) => {
    if (!best) return cur;
    return cur.amount > best.amount ? cur : best;
  }, null);

  const byCategory = costs.reduce<Record<string, number>>((acc, cur) => {
    acc[cur.category] = (acc[cur.category] ?? 0) + cur.amount;
    return acc;
  }, {});

  const categoriesSorted = Object.entries(byCategory)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  return { totalCosts, count, maxCost, categoriesSorted };
}

function computeMensalidadeInsights(rows: MensalidadeRow[]) {
  const totalAlunos = new Set(rows.map((r) => r.studentId)).size;

  const pagos = rows.filter((r) => r.status === "pago");
  const pendentes = rows.filter((r) => r.status === "pendente");

  const alunosPagos = new Set(pagos.map((r) => r.studentId)).size;
  const alunosPendentes = new Set(pendentes.map((r) => r.studentId)).size;

  const totalPrevisto = rows.reduce(
    (acc, r) => acc + (r.valor_mensalidade ?? 0),
    0,
  );
  const totalRecebido = rows.reduce((acc, r) => acc + (r.valorPago ?? 0), 0);

  const totalPendente = Math.max(0, totalPrevisto - totalRecebido);
  const adimplenciaPct =
    totalPrevisto > 0 ? (totalRecebido / totalPrevisto) * 100 : 0;

  const ticketMedio =
    pagos.length > 0
      ? pagos.reduce((acc, r) => acc + (r.valorPago ?? 0), 0) / pagos.length
      : 0;

  return {
    totalAlunos,
    alunosPagos,
    alunosPendentes,
    totalPrevisto,
    totalRecebido,
    totalPendente,
    adimplenciaPct,
    ticketMedio,
  };
}

export default async function FinanceiroAdminView({
  searchParams,
}: {
  searchParams?: { year?: string; month?: string };
}) {
  const year = Number(searchParams?.year ?? 2025);
  const month = Number(searchParams?.month ?? 2);

  const summary = await getMonthlySummary(year, month);
  const costs = (await getCostsByMonth(year, month)) as Cost[];

  const { totalCosts, count, maxCost, categoriesSorted } =
    computeCostInsights(costs);
  const net = summary.totalPaid - totalCosts;

  const mensalidades = await getMensalidadesByMonth(year, month);
  const mensalidadeInsights = computeMensalidadeInsights(mensalidades);

  const financeiroEntries = await getFinanceiroEntriesByMonth(year, month);
  const hasFinanceiroEntries =
    Array.isArray(financeiroEntries) && financeiroEntries.length > 0;

  const topCategories = categoriesSorted.slice(0, 4);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 p-4">
        <main className="flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Financeiro</h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <PeriodPicker year={year} month={month} />
            <CreateCostModal competenceYear={year} competenceMonth={month} />
          </div>
        </main>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card
            title={`Recebido em ${monthLabel(month)}/${year}`}
            value={formatBRL(summary.totalPaid)}
            badge={<StatusBadge label="Entradas" variant="blue" />}
            helper={`Mês anterior: ${formatBRL(summary.prevMonthTotalPaid)}`}
          />

          <Card
            title={`Custos em ${monthLabel(month)}/${year}`}
            value={formatBRL(totalCosts)}
            badge={<StatusBadge label="Custos" variant="gray" />}
            helper={`${count} lançamento(s) no mês`}
          />

          <Card
            title="Saldo do mês"
            value={formatBRL(net)}
            badge={
              <StatusBadge
                label="Resultado"
                variant={net >= 0 ? "green" : "yellow"}
              />
            }
            helper={
              net >= 0
                ? "Operação positiva no período."
                : "Operação negativa no período."
            }
          />

          <Card
            title="Variação vs mês anterior"
            value={formatBRL(summary.delta)}
            badge={
              <StatusBadge
                label={formatPct(summary.deltaPct)}
                variant={summary.delta >= 0 ? "green" : "yellow"}
              />
            }
            helper="Comparativo de entradas (não considera custos)."
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b p-4">
            <h2 className="font-semibold text-slate-900">
              Mensalidades em {monthLabel(month)}/{year}
            </h2>
            <p className="text-sm text-slate-600">
              Consolidado de previsão, recebido, pendente e adimplência.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-4">
            <CardMini
              title="Total previsto"
              value={formatBRL(mensalidadeInsights.totalPrevisto)}
            />
            <CardMini
              title="Total recebido"
              value={formatBRL(mensalidadeInsights.totalRecebido)}
            />
            <CardMini
              title="Total pendente"
              value={formatBRL(mensalidadeInsights.totalPendente)}
            />
            <CardMini
              title="Adimplência"
              value={`${mensalidadeInsights.adimplenciaPct.toFixed(1)}%`}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 px-4 pb-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-600">Alunos no período</p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {mensalidadeInsights.totalAlunos}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Pagos: {mensalidadeInsights.alunosPagos} | Pendentes:{" "}
                {mensalidadeInsights.alunosPendentes}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-600">Ticket médio pago</p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {formatBRL(mensalidadeInsights.ticketMedio)}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Média calculada com base em mensalidades com status pago.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-600">Observação operacional</p>
              <p className="mt-1 text-sm text-slate-700">
                Use o total pendente para priorizar cobranças e organizar fluxo
                de caixa do mês seguinte.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">
                Custos por categoria
              </h2>
              <span className="text-xs text-slate-500">Top do período</span>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {topCategories.length ? (
                topCategories.map((c) => (
                  <div
                    key={c.category}
                    className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">
                        {c.category}
                      </span>
                      <span className="text-xs text-slate-600">
                        {totalCosts > 0
                          ? `${((c.total / totalCosts) * 100).toFixed(1)}% dos custos`
                          : "0% dos custos"}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">
                      {formatBRL(c.total)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-600">
                  Sem custos lançados neste período.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">
                Maior custo do mês
              </h2>
              <span className="text-xs text-slate-500">Ponto de atenção</span>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              {maxCost ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">
                      {maxCost.category}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {formatBRL(maxCost.amount)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">
                    {maxCost.description}
                  </p>
                  <p className="text-xs text-slate-500">
                    Data: {maxCost.incurredAt}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-600">
                  Nenhum custo lançado no mês.
                </p>
              )}
            </div>

            <div className="mt-4 text-xs text-slate-500">
              Sugestão: valide recorrências e renegocie fornecedores quando uma
              categoria concentrar grande parte do total.
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-1 border-b p-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Custos internos do mês
              </h2>
              <p className="text-sm text-slate-600">
                Lançamentos internos para controle administrativo.
              </p>
            </div>

            <div className="text-sm text-slate-700">
              Total do mês:{" "}
              <span className="font-semibold text-slate-900">
                {formatBRL(totalCosts)}
              </span>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="w-full min-w-[980px] text-sm">
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
                    <td className="p-3 text-slate-700">
                      {formatBRL(c.amount)}
                    </td>
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
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b p-4">
            <h2 className="font-semibold text-slate-900">
              Movimentações gerais (financeiro)
            </h2>
            <p className="text-sm text-slate-600">
              Use este bloco se você registrar outras receitas/despesas na
              tabela financeiro.
            </p>
          </div>

          <div className="p-4 text-sm text-slate-700">
            {hasFinanceiroEntries ? (
              <p>Movimentações gerais do período.</p>
            ) : (
              <p className="text-slate-500">
                Nenhuma movimentação geral carregada.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  badge,
  helper,
}: {
  title: string;
  value: string;
  badge: React.ReactNode;
  helper?: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        {badge}
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      {helper ? <div className="text-xs text-slate-500">{helper}</div> : null}
    </div>
  );
}

function CardMini({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs text-slate-600">{title}</p>
      <p className="text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}

function PeriodPicker({ year, month }: { year: number; month: number }) {
  return (
    <form className="flex items-end gap-2" action="/admin/financeiro">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-slate-600">Ano</span>
        <input
          name="year"
          defaultValue={year}
          className="h-10 w-[110px] rounded-md border border-slate-200 bg-white px-3 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-slate-600">Mês</span>
        <select
          name="month"
          defaultValue={month}
          className="h-10 w-[140px] rounded-md border border-slate-200 bg-white px-3 text-sm"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {String(i + 1).padStart(2, "0")} - {monthLabel(i + 1)}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
      >
        Aplicar
      </button>
    </form>
  );
}
