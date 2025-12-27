import StatusBadge from "@/app/_components/StatusBadge";
import { getStudentInstallments } from "../../_lib/mockdata/finance.mock";
import { Input } from "../ui/input";
import { Bell, Search } from "lucide-react";
import { Button } from "../ui/button";

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
    <div className="flex flex-col">
      <header className="bg-card border-border flex h-16 items-center justify-between border-b px-6">
        <div className="max-w-md flex-1">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="text"
              className="border-input ring-offset-background file:text-foreground placeholder:text-muted-foreground bg-muted/50 focus-visible:ring-primary flex h-10 w-full rounded-md border-0 px-3 py-2 pl-10 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Buscar..."
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground relative inline-flex h-10 w-10 items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
            <Bell className="h-5 w-5 text-white" />
          </Button>
          <div className="border-border flex items-center gap-3 border-l pl-4">
            <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-full">
              <span className="text-primary-foreground text-sm font-semibold">
                M
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-foreground text-sm font-medium">Maria Silva</p>
              <p className="text-muted-foreground text-xs">Aluno</p>
            </div>
          </div>
        </div>
      </header>
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
    </div>
  );
}
