"use client";

import StatusBadge from "@/app/_components/StatusBadge";
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
import type {
  FormaPagamento,
  MensalidadeRow,
} from "@/app/_lib/actions/finance";
import { markMensalidadeAsPaid } from "@/app/_lib/actions/mensalidades";
import { CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const FormaPagamentoOptions: { value: FormaPagamento; label: string }[] = [
  { value: "dinheiro", label: "Dinheiro" },
  { value: "pix", label: "Pix" },
  { value: "debito", label: "Débito" },
  { value: "credito", label: "Crédito" },
];

type Props = {
  mensalidades: MensalidadeRow[];
  studentId: string;
};

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

export default function FinanceiroAlunoView({
  mensalidades,
  studentId,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const pendentes = mensalidades.filter((m) => m.status === "pendente");
  const pagas = mensalidades.filter((m) => m.status === "pago");

  async function handleRegisterPayment(
    mensalidadeId: string,
    valorPago: number,
    formaPagamento: FormaPagamento,
    dataPagamento: string,
  ) {
    startTransition(async () => {
      try {
        await markMensalidadeAsPaid({
          mensalidadeId,
          valorPago,
          formaPagamento,
          dataPagamento,
        });
        toast.success("Pagamento registrado com sucesso!");
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Erro ao registrar pagamento.",
        );
      }
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Financeiro</h2>
        <p className="text-sm text-slate-600">
          Visualize mensalidades e registre pagamentos
        </p>
      </div>

      {pendentes.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-slate-900">
            Mensalidades Pendentes
          </h3>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Competência</TableHead>
                  <TableHead>Valor Mensalidade</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendentes.map((m) => (
                  <MensalidadeRow
                    key={m.id}
                    mensalidade={m}
                    onRegisterPayment={handleRegisterPayment}
                    pending={pending}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {pagas.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-slate-900">
            Mensalidades Pagas
          </h3>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Competência</TableHead>
                  <TableHead>Valor Pago</TableHead>
                  <TableHead>Forma</TableHead>
                  <TableHead>Data Pagamento</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagas.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      {monthLabel(m.competenceMonth)}/{m.competenceYear}
                    </TableCell>
                    <TableCell>
                      R$ {m.valorPago?.toFixed(2) ?? "0.00"}
                    </TableCell>
                    <TableCell>
                      {m.formaPagamento
                        ? (FormaPagamentoOptions.find(
                            (pm: { value: FormaPagamento; label: string }) =>
                              pm.value === m.formaPagamento,
                          )?.label ?? m.formaPagamento)
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {m.dataPagamento
                        ? new Date(m.dataPagamento).toLocaleDateString("pt-BR")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge label="Pago" variant="green" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {mensalidades.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500">
          Não existem dados para serem mostrados ainda.
        </div>
      )}
    </div>
  );
}

function MensalidadeRow({
  mensalidade,
  onRegisterPayment,
  pending,
}: {
  mensalidade: MensalidadeRow;
  onRegisterPayment: (
    mensalidadeId: string,
    valorPago: number,
    formaPagamento: FormaPagamento,
    dataPagamento: string,
  ) => Promise<void>;
  pending: boolean;
}) {
  const [valorPago, setValorPago] = useState(
    mensalidade.valor_mensalidade.toString(),
  );
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("pix");
  const [dataPagamento, setDataPagamento] = useState(
    new Date().toISOString().slice(0, 10),
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const valor = parseFloat(valorPago.replace(",", "."));
    if (isNaN(valor) || valor <= 0) {
      toast.error("Valor inválido");
      return;
    }
    onRegisterPayment(mensalidade.id, valor, formaPagamento, dataPagamento);
  }

  return (
    <TableRow>
      <TableCell>
        {monthLabel(mensalidade.competenceMonth)}/{mensalidade.competenceYear}
      </TableCell>
      <TableCell>R$ {mensalidade.valor_mensalidade.toFixed(2)}</TableCell>
      <TableCell>
        {mensalidade.dataVencimento
          ? new Date(mensalidade.dataVencimento).toLocaleDateString("pt-BR")
          : "-"}
      </TableCell>
      <TableCell>
        <StatusBadge label="Pendente" variant="yellow" />
      </TableCell>
      <TableCell>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
          <Input
            type="number"
            step="0.01"
            min="0"
            value={valorPago}
            onChange={(e) => setValorPago(e.target.value)}
            placeholder="Valor"
            className="w-[100px]"
            disabled={pending}
            required
          />
          <Select
            value={formaPagamento}
            onValueChange={(v) => setFormaPagamento(v as FormaPagamento)}
            disabled={pending}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FormaPagamentoOptions.map(
                (pm: { value: FormaPagamento; label: string }) => (
                  <SelectItem key={pm.value} value={pm.value}>
                    {pm.label}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={dataPagamento}
            onChange={(e) => setDataPagamento(e.target.value)}
            className="w-[140px]"
            disabled={pending}
            required
          />
          <Button type="submit" size="sm" disabled={pending}>
            <CreditCard className="mr-2 h-4 w-4" />
            Registrar
          </Button>
        </form>
      </TableCell>
    </TableRow>
  );
}
