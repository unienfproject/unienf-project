"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { CalendarCheck, Save } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/app/_components/ui/button";
import { Checkbox } from "@/app/_components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import {
  listFrequenciaForTurma,
  saveDailyFrequencia,
  savePeriodFrequencia,
  type FrequenciaAlunoRow,
} from "@/app/_lib/actions/frequencias";
import { notifyDataChanged } from "@/app/_lib/client/dataRefresh";

type ClassRow = {
  id: string;
  name: string;
  tag: string;
  status: "ativa" | "finalizada";
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatPercent(value: number | null) {
  return value === null ? "-" : `${value}%`;
}

export default function AttendanceModal({
  turma,
  open,
  onOpenChange,
}: {
  turma: ClassRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [rows, setRows] = useState<FrequenciaAlunoRow[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [date, setDate] = useState(todayISO());
  const [totalClasses, setTotalClasses] = useState("1");
  const [absences, setAbsences] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open || !turma) return;

    let cancelled = false;
    void listFrequenciaForTurma(turma.id)
      .then((data) => {
        if (cancelled) return;
        setError(null);
        setRows(data);
        setSelected(new Set(data.map((row) => row.alunoId)));
        setAbsences(
          Object.fromEntries(
            data.map((row) => [row.alunoId, String(row.totalFaltas || 0)]),
          ),
        );
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Erro ao carregar alunos.");
      });

    return () => {
      cancelled = true;
    };
  }, [open, turma]);

  const selectedCount = selected.size;
  const absenceDrafts = useMemo(
    () =>
      rows.map((row) => ({
        alunoId: row.alunoId,
        faltas: Number(absences[row.alunoId] || 0),
      })),
    [absences, rows],
  );

  function toggleStudent(alunoId: string, checked: boolean) {
    setSelected((current) => {
      const next = new Set(current);
      if (checked) next.add(alunoId);
      else next.delete(alunoId);
      return next;
    });
  }

  function handleDailySave() {
    if (!turma) return;

    setError(null);
    startTransition(async () => {
      try {
        await saveDailyFrequencia({
          turmaId: turma.id,
          date,
          presentStudentIds: Array.from(selected),
        });
        const updatedRows = await listFrequenciaForTurma(turma.id);
        setRows(updatedRows);
        notifyDataChanged(router);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao salvar frequência.");
      }
    });
  }

  function handlePeriodSave() {
    if (!turma) return;

    setError(null);
    startTransition(async () => {
      try {
        await savePeriodFrequencia({
          turmaId: turma.id,
          totalClasses: Number(totalClasses),
          absences: absenceDrafts,
        });
        const updatedRows = await listFrequenciaForTurma(turma.id);
        setRows(updatedRows);
        notifyDataChanged(router);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao salvar frequência.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-hidden sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5" />
            Frequência
          </DialogTitle>
          <DialogDescription>
            {turma?.tag ?? "Turma"} · marque presenças do dia ou registre faltas do período.
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <Tabs defaultValue="diaria" className="min-h-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="diaria">Chamada diária</TabsTrigger>
            <TabsTrigger value="periodo">Faltas do período</TabsTrigger>
          </TabsList>

          <TabsContent value="diaria" className="mt-4 space-y-4">
            <div className="grid gap-3 sm:grid-cols-[180px_1fr] sm:items-end">
              <div className="w-fit space-y-2">
                <Label htmlFor="attendance-date">Data</Label>
                <Input
                  id="attendance-date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </div>
              <p className="text-sm text-slate-600">
                {selectedCount} de {rows.length} alunos marcados como presentes.
              </p>
            </div>

            <div className="max-h-[46vh] overflow-auto rounded-md border">
              {rows.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  Nenhum aluno vinculado a esta turma.
                </div>
              ) : (
                rows.map((row) => (
                  <label
                    key={row.alunoId}
                    className="flex cursor-pointer items-center gap-3 border-b px-4 py-3 last:border-b-0 hover:bg-slate-50"
                  >
                    <Checkbox
                      checked={selected.has(row.alunoId)}
                      onCheckedChange={(checked) =>
                        toggleStudent(row.alunoId, checked === true)
                      }
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-900">
                        {row.alunoName}
                      </span>
                      <span className="block truncate text-xs text-slate-500">
                        {row.alunoEmail || "Sem email"}
                      </span>
                    </span>
                    <span className="text-right text-xs text-slate-600">
                      {formatPercent(row.percentualPresenca)}
                      <span className="block">Faltas: {row.totalFaltas}</span>
                    </span>
                  </label>
                ))
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                onClick={handleDailySave}
                disabled={isPending || rows.length === 0 || turma?.status === "finalizada"}
              >
                <Save className="h-4 w-4" />
                {isPending ? "Salvando..." : "Alunos Presentes"}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="periodo" className="mt-4 space-y-4">
            <div className="space-y-3">
              <div className="w-fit space-y-2">
                <Label htmlFor="total-classes">Aulas no período</Label>
                <Input
                  id="total-classes"
                  type="number"
                  min="1"
                  step="1"
                  value={totalClasses}
                  onChange={(event) => setTotalClasses(event.target.value)}
                  className="w-28"
                />
              </div>
              <p className="text-sm text-slate-600">
                Informe quantas faltas cada aluno teve no período da turma.
              </p>
            </div>

            <div className="max-h-[46vh] overflow-auto rounded-md border">
              {rows.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  Nenhum aluno vinculado a esta turma.
                </div>
              ) : (
                rows.map((row) => (
                  <div
                    key={row.alunoId}
                    className="grid grid-cols-[minmax(0,1fr)_96px] items-center gap-3 border-b px-4 py-3 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {row.alunoName}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        Frequência atual: {formatPercent(row.percentualPresenca)}
                      </p>
                    </div>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      className="h-9 text-center"
                      value={absences[row.alunoId] ?? "0"}
                      onChange={(event) =>
                        setAbsences((current) => ({
                          ...current,
                          [row.alunoId]: event.target.value,
                        }))
                      }
                    />
                  </div>
                ))
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                onClick={handlePeriodSave}
                disabled={isPending || rows.length === 0 || turma?.status === "finalizada"}
              >
                <Save className="h-4 w-4" />
                {isPending ? "Salvando..." : "Salvar Faltas"}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

