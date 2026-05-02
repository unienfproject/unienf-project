"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createInternalCost } from "@/app/_lib/actions/finance";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Props = {
  competenceYear: number;
  competenceMonth: number;
};

export default function CreateCostModal({
  competenceYear,
  competenceMonth,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="h-10 cursor-pointer rounded-md bg-sky-500 px-4 text-sm font-medium text-white hover:bg-sky-600"
      >
        Lançar custo
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-lg">
            <div className="flex items-start justify-between gap-3 border-b p-5">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Novo custo interno
                </h3>
                <p className="text-sm text-slate-600">
                  Competência: {String(competenceMonth).padStart(2, "0")}/
                  {competenceYear}
                </p>
              </div>
              <Button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                className="hover:bg-primary/50 cursor-pointer rounded-md border border-slate-200 px-3 py-2 text-sm"
              >
                Fechar
              </Button>
            </div>

            <form
              className="flex flex-col gap-4 p-5"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const fd = new FormData(form);

                const payload = {
                  competenceYear,
                  competenceMonth,
                  category: String(fd.get("category") ?? "").trim(),
                  description: String(fd.get("description") ?? "").trim(),
                  amount: Number(
                    String(fd.get("amount") ?? "0").replace(",", "."),
                  ),
                  incurredAt: String(fd.get("incurredAt") ?? "").trim(),
                };

                if (!Number.isFinite(payload.amount) || payload.amount <= 0) {
                  toast.error("Informe um valor maior que zero.");
                  return;
                }

                startTransition(async () => {
                  try {
                    await createInternalCost(payload);
                    toast.success("Custo lancado com sucesso.");
                    form.reset();
                    setOpen(false);
                  } catch (err) {
                    toast.error(
                      err instanceof Error
                        ? err.message
                        : "Erro ao lancar custo.",
                    );
                  }
                });
              }}
            >
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Categoria
                </Label>
                <Input
                  name="category"
                  className="h-10 rounded-md border border-slate-200 px-3 text-sm"
                  placeholder="Ex.: Aluguel, Energia, Internet"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Descrição
                </Label>
                <Input
                  name="description"
                  className="h-10 rounded-md border border-slate-200 px-3 text-sm"
                  placeholder="Detalhe do custo"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Valor (R$)
                  </Label>
                  <Input
                    name="amount"
                    className="h-10 rounded-md border border-slate-200 px-3 text-sm"
                    placeholder="Ex.: 380,00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Data do custo
                  </Label>
                  <Input
                    type="date"
                    name="incurredAt"
                    className="h-10 rounded-md border border-slate-200 px-3 text-sm"
                    defaultValue={new Date().toISOString().slice(0, 10)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t pt-4">
                <Button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={pending}
                  className="h-10 cursor-pointer rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-[#ff3333] hover:text-white"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={pending}
                  className="h-10 rounded-md bg-sky-500 px-4 text-sm font-medium text-white hover:bg-sky-600"
                >
                  {pending ? "Salvando..." : "Salvar custo"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
