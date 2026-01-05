import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { MensalidadeRow } from "@/app/_lib/actions/finance";
import {
  PaymentMethod,
  listMensalidadesForRecepcao,
  markMensalidadeAsPaid,
} from "@/app/_lib/actions/mensalidades";
import { getUserProfile } from "@/app/_lib/actions/profile";
import Link from "next/link";

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

export default async function RecepcaoFinanceiroPage({
  searchParams,
}: {
  searchParams?: { status?: string; studentId?: string; receipt?: string };
}) {
  const profile = await getUserProfile();

  if (!profile)
    return <div className="p-6">Sessão inválida. Faça login novamente.</div>;
  if (profile.role !== "recepção")
    return <div className="p-6">Sem acesso.</div>;

  const filterStatus = (searchParams?.status ?? "pendente") as
    | "pendente"
    | "pago"
    | "todos";
  const studentId = searchParams?.studentId ?? null;

  const mensalidades = await listMensalidadesForRecepcao({
    status: filterStatus,
    studentId,
  });

  async function actionPay(formData: FormData) {
    "use server";

    const mensalidadeId = String(formData.get("mensalidadeId") ?? "");
    const valorPago = Number(
      String(formData.get("valor_pago") ?? "0").replace(",", "."),
    );
    const forma = String(formData.get("forma_pagamento") ?? "");
    const data = String(formData.get("data_pagamento") ?? "");

    if (!mensalidadeId) return;
    if (!Number.isFinite(valorPago) || valorPago <= 0) return;
    if (!["dinheiro", "pix", "debito", "credito"].includes(forma)) return;
    if (!data) return;

    await markMensalidadeAsPaid({
      mensalidadeId,
      valorPago,
      formaPagamento: forma as PaymentMethod,
      dataPagamento: data,
    });
  }

  const receiptDataRaw = searchParams?.receipt ?? null;
  const receiptData = receiptDataRaw ? safeParseReceipt(receiptDataRaw) : null;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold text-slate-900">Financeiro</h1>
        <p className="text-slate-600">
          Filtre pendentes/pagos. Registre pagamento com valor, forma e data.
          Recibo pronto para impressão.
        </p>
      </div>

      <section className="gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Mensalidades</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/recepcao/financeiro?status=pendente${studentId ? `&studentId=${studentId}` : ""}`}
              className={[
                "flex h-10 items-center rounded-md px-4 text-sm font-medium",
                filterStatus === "pendente"
                  ? "bg-sky-500 text-white"
                  : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
              ].join(" ")}
            >
              Pendentes
            </Link>
            <Link
              href={`/recepcao/financeiro?status=pago${studentId ? `&studentId=${studentId}` : ""}`}
              className={[
                "flex h-10 items-center rounded-md px-4 text-sm font-medium",
                filterStatus === "pago"
                  ? "bg-sky-500 text-white"
                  : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
              ].join(" ")}
            >
              Pagas
            </Link>
            <Link
              href={`/recepcao/financeiro?status=todos${studentId ? `&studentId=${studentId}` : ""}`}
              className={[
                "flex h-10 items-center rounded-md px-4 text-sm font-medium",
                filterStatus === "todos"
                  ? "bg-sky-500 text-white"
                  : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
              ].join(" ")}
            >
              Todas
            </Link>
          </div>
        </div>

        <div className="overflow-auto">
          <Table className="w-full min-w-[1200px] text-sm">
            <TableHeader className="border-b bg-slate-50">
              <TableRow>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Aluno
                </TableHead>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Competência
                </TableHead>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Status
                </TableHead>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Mensalidade
                </TableHead>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Valor pago
                </TableHead>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Forma
                </TableHead>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Data
                </TableHead>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {mensalidades.map((m: MensalidadeRow) => {
                const competence = `${monthLabel(m.competenceMonth)}/${m.competenceYear}`;
                const isPaid = m.status === "pago";
                const defaultDate = new Date().toISOString().slice(0, 10);

                return (
                  <TableRow key={m.id} className="border-b last:border-b-0">
                    <TableCell className="p-3 font-medium text-slate-900">
                      {m.studentName}
                    </TableCell>
                    <TableCell className="p-3 text-slate-700">
                      {competence}
                    </TableCell>
                    <TableCell className="p-3">
                      <span
                        className={[
                          "inline-flex rounded-full px-2 py-1 text-xs font-medium",
                          isPaid
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700",
                        ].join(" ")}
                      >
                        {m.status}
                      </span>
                    </TableCell>
                    <TableCell className="p-3 text-slate-700">
                      R$ {Number(m.valor_mensalidade).toFixed(2)}
                    </TableCell>
                    <TableCell className="p-3 text-slate-700">
                      R$ {Number(m.valorPago ?? 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="p-3 text-slate-700">
                      {m.formaPagamento ?? "-"}
                    </TableCell>
                    <TableCell className="p-3 text-slate-700">
                      {m.dataPagamento ?? "-"}
                    </TableCell>

                    <TableCell className="p-3">
                      {!isPaid ? (
                        <form
                          action={actionPay}
                          className="flex flex-wrap items-end gap-2"
                        >
                          <Input
                            type="hidden"
                            name="mensalidadeId"
                            value={m.id}
                          />

                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-slate-600">
                              Valor pago
                            </span>
                            <Input
                              name="valor_pago"
                              defaultValue={String(m.valor_mensalidade)}
                              className="h-9 w-[120px] rounded-md border border-slate-200 px-2 text-sm"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-slate-600">
                              Forma
                            </span>
                            <Select name="forma_pagamento" defaultValue="pix">
                              <SelectTrigger className="h-9 w-[120px] rounded-md border border-slate-200 bg-white px-2 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="dinheiro">
                                  Dinheiro
                                </SelectItem>
                                <SelectItem value="pix">Pix</SelectItem>
                                <SelectItem value="debito">Débito</SelectItem>
                                <SelectItem value="credito">Crédito</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-slate-600">Data</span>
                            <Input
                              type="date"
                              name="data_pagamento"
                              defaultValue={defaultDate}
                              className="h-9 w-[160px] rounded-md border border-slate-200 px-2 text-sm"
                            />
                          </div>

                          <Button className="h-9 rounded-md bg-sky-500 px-3 text-xs font-medium text-white hover:bg-sky-600">
                            Marcar como pago
                          </Button>
                        </form>
                      ) : (
                        <Link
                          href={`/recepcao/financeiro?status=${filterStatus}&receipt=${encodeReceipt(
                            {
                              student_name: m.studentName,
                              competence_month: m.competenceMonth,
                              competence_year: m.competenceYear,
                              valor_pago: m.valorPago,
                              forma_pagamento: m.formaPagamento,
                              data_pagamento: m.dataPagamento,
                            },
                          )}`}
                          className="inline-flex h-9 items-center rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-900 hover:bg-slate-50"
                        >
                          Ver recibo
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}

              {!mensalidades.length ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="p-6 text-center text-slate-500"
                  >
                    Nenhuma mensalidade encontrada.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </section>

      {receiptData ? (
        <section className="gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recibo</h2>
              <p className="text-sm text-slate-600">
                Use o botão imprimir do navegador para salvar como PDF.
              </p>
            </div>

            <Button
              type="button"
              onClick={() => {}}
              className="h-10 w-fit rounded-md bg-sky-500 px-4 text-sm font-medium text-white hover:bg-sky-600"
            >
              Imprimir (Ctrl+P)
            </Button>
          </div>

          <div className="mt-6 border-t pt-6">
            <div className="text-center">
              <div className="text-xl font-bold text-slate-900">UNIENF</div>
              <div className="text-sm text-slate-600">Recibo de pagamento</div>
            </div>

            <div className="mt-6 space-y-2 text-sm text-slate-800">
              <div>
                <span className="font-semibold">Aluno:</span>{" "}
                {receiptData.student_name}
              </div>
              <div>
                <span className="font-semibold">Competência:</span>{" "}
                {monthLabel(receiptData.competence_month)}/
                {receiptData.competence_year}
              </div>
              <div>
                <span className="font-semibold">Valor pago:</span> R${" "}
                {Number(receiptData.valor_pago ?? 0).toFixed(2)}
              </div>
              <div>
                <span className="font-semibold">Forma:</span>{" "}
                {receiptData.forma_pagamento ?? "-"}
              </div>
              <div>
                <span className="font-semibold">Data:</span>{" "}
                {receiptData.data_pagamento ?? "-"}
              </div>
            </div>

            <div className="mt-8 text-xs text-slate-500">
              Este recibo comprova o pagamento da mensalidade referente à
              competência informada.
            </div>

            <div className="mt-10 flex justify-between text-sm text-slate-700">
              <div className="w-[45%] border-t pt-2 text-center">
                Assinatura UNIENF
              </div>
              <div className="w-[45%] border-t pt-2 text-center">
                Assinatura Responsável
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function encodeReceipt(data: unknown) {
  try {
    return encodeURIComponent(JSON.stringify(data));
  } catch {
    return "";
  }
}

function safeParseReceipt(raw: string) {
  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return null;
  }
}
