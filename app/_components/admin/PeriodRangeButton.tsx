"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatBR(date: Date) {
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function monthDiffInclusive(from: Date, to: Date) {
  const months =
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth());
  return months + 1;
}

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

type PeriodRangeButtonProps = {
  /**
   * Callback para você plugar a busca de matrículas por mês depois.
   * Vai receber a data inicial e final (inclusive).
   */
  onApply?: (range: { from: Date; to: Date }) => void;

  /**
   * Para manter o comportamento "últimos 6 meses" como padrão.
   */
  defaultLastMonths?: number;
};

export default function PeriodRangeButton({
  onApply,
  defaultLastMonths = 6,
}: PeriodRangeButtonProps) {
  const today = startOfDay(new Date());

  const defaultFrom = startOfDay(addMonths(today, -(defaultLastMonths - 1)));
  const defaultTo = today;

  const [open, setOpen] = React.useState(false);
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: defaultFrom,
    to: defaultTo,
  });

  const [error, setError] = React.useState<string | null>(null);

  const canApply = Boolean(range?.from && range?.to);

  function validate(selected?: DateRange) {
    setError(null);

    if (!selected?.from || !selected?.to) return;

    const from = startOfDay(selected.from);
    const to = startOfDay(selected.to);

    if (to < from) {
      setError("O fim do período não pode ser anterior ao início.");
      return;
    }

    const months = monthDiffInclusive(from, to);
    if (months > 6) {
      setError("Selecione um período de no máximo 6 meses.");
      return;
    }
  }

  function handleChange(next?: DateRange) {
    setRange(next);
    validate(next);
  }

  function handleApply() {
    if (!range?.from || !range?.to) {
      setError("Selecione o período inicial e final.");
      return;
    }

    const from = startOfDay(range.from);
    const to = startOfDay(range.to);

    const months = monthDiffInclusive(from, to);
    if (months > 6) {
      setError("Selecione um período de no máximo 6 meses.");
      return;
    }

    setOpen(false);

    onApply?.({ from, to });
  }

  const label =
    range?.from && range?.to
      ? `${formatBR(range.from)} a ${formatBR(range.to)}`
      : "Selecione";

  return (
    <Dialog open={open} onOpenChange={(v) => (setOpen(v), setError(null))}>
      <DialogTrigger asChild>
        <Button className="ring-offset-background focus-visible:ring-ring border-input bg-primary hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Período
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Selecionar período</DialogTitle>
          <DialogDescription>
            Escolha um intervalo de datas para filtrar as matrículas.
            <br />O período máximo é de 6 meses.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="text-muted-foreground text-xs">
              Período selecionado
            </div>
            <div className="text-foreground text-sm font-medium">{label}</div>
          </div>

          <Calendar
            mode="range"
            selected={range}
            onSelect={handleChange}
            numberOfMonths={2}
            // Bloqueia seleção muito antiga (últimos 6 meses a partir de hoje).
            // Se você quiser permitir qualquer período, remova min/max.
            fromDate={addMonths(today, -5)} // início permitido (aprox últimos 6 meses)
            toDate={today} // até hoje
          />

          {error ? (
            <div className="text-destructive text-sm">{error}</div>
          ) : (
            <div className="text-muted-foreground text-xs">
              Dica: selecione uma data inicial e depois uma data final.
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setRange({ from: defaultFrom, to: defaultTo });
              setError(null);
            }}
          >
            Últimos 6 meses
          </Button>

          <Button
            type="button"
            onClick={handleApply}
            disabled={!canApply || Boolean(error)}
          >
            Aplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
