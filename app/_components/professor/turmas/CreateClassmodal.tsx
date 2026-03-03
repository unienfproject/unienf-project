"use client";

import { Button } from "@/app/_components/ui/button";
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
import { createClass } from "@/app/_lib/actions/classes";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

type PickerItem = { id: string; label: string; description?: string | null };

export default function CreateClassModal({
  open,
  onOpenChange,
  teacherId,
  teacherName,
  subjects,
  students,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: string;
  teacherName: string;
  subjects: PickerItem[];
  students: PickerItem[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [startDate, setStartDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [endDate, setEndDate] = useState("");

  const [subjectQuery, setSubjectQuery] = useState("");
  const [studentQuery, setStudentQuery] = useState("");

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null,
  );
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const filteredSubjects = useMemo(() => {
    const q = subjectQuery.trim().toLowerCase();
    if (!q) return subjects;
    return subjects.filter((s) => s.label.toLowerCase().includes(q));
  }, [subjectQuery, subjects]);

  const filteredStudents = useMemo(() => {
    const q = studentQuery.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => s.label.toLowerCase().includes(q));
  }, [studentQuery, students]);

  const autoTag = useMemo(() => {
    const disciplinaNome =
      subjects.find((s) => s.id === selectedSubjectId)?.label ?? "";
    const inicio = startDate || "";
    const termino = endDate || startDate || "";

    if (!disciplinaNome || !teacherName || !inicio || !termino) return "";
    return `${disciplinaNome} - ${teacherName} - ${inicio} - ${termino}`;
  }, [subjects, selectedSubjectId, teacherName, startDate, endDate]);

  function toggleStudent(list: string[], id: string) {
    return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  }

  function resetForm() {
    setStartDate(new Date().toISOString().slice(0, 10));
    setEndDate("");
    setSubjectQuery("");
    setStudentQuery("");
    setSelectedSubjectId(null);
    setSelectedStudentIds([]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedSubjectId) {
      toast.error("Selecione uma disciplina.");
      return;
    }

    startTransition(async () => {
      try {
        await createClass({
          teacherId,
          startDate,
          endDate: endDate || startDate,
          subjectIds: [selectedSubjectId],
          studentIds: selectedStudentIds,
        });

        toast.success("Turma criada com sucesso!");
        resetForm();
        onOpenChange(false);
        router.refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Erro ao criar turma.",
        );
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) resetForm();
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Turma</DialogTitle>
          <DialogDescription>
            Preencha os dados para cadastrar uma nova turma.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="tag">Etiqueta (automática)</Label>
              <Input
                id="tag"
                value={autoTag}
                readOnly
                placeholder="Será gerada automaticamente"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Data de início</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Data de término</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Picker
              title="Disciplinas"
              query={subjectQuery}
              onQuery={setSubjectQuery}
              items={filteredSubjects}
              selectedIds={selectedSubjectId ? [selectedSubjectId] : []}
              onToggle={(id) =>
                setSelectedSubjectId((prev) => (prev === id ? null : id))
              }
              helper="Selecione a disciplina da turma."
            />

            <Picker
              title="Alunos"
              query={studentQuery}
              onQuery={setStudentQuery}
              items={filteredStudents}
              selectedIds={selectedStudentIds}
              onToggle={(id) =>
                setSelectedStudentIds((prev) => toggleStudent(prev, id))
              }
              helper="Opcional: vincule alunos agora, ou depois na tela da turma."
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              disabled={pending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Criar Turma"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Picker({
  title,
  helper,
  query,
  onQuery,
  items,
  selectedIds,
  onToggle,
}: {
  title: string;
  helper: string;
  query: string;
  onQuery: (v: string) => void;
  items: { id: string; label: string; description?: string | null }[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-slate-900">{title}</h4>
          <p className="text-xs text-slate-600">{helper}</p>
        </div>
        <span className="text-xs font-medium text-slate-600">
          Selecionados: {selectedIds.length}
        </span>
      </div>

      <div className="mt-3">
        <Input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
          placeholder={`Buscar ${title.toLowerCase()}...`}
        />
      </div>

      <div className="mt-3 max-h-56 overflow-auto rounded-xl border border-slate-200">
        {items.map((it) => {
          const active = selectedIds.includes(it.id);
          return (
            <Button
              key={it.id}
              type="button"
              onClick={() => onToggle(it.id)}
              className={[
                "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm",
                "hover:bg-slate-50",
                active ? "bg-sky-50" : "bg-white",
              ].join(" ")}
            >
              <span className="text-slate-900">
                {it.label}
                {it.description?.trim() ? (
                  <span className="block text-xs text-slate-500">
                    {it.description}
                  </span>
                ) : null}
              </span>
              <span
                className={[
                  "rounded-full px-2 py-1 text-xs font-medium",
                  active
                    ? "bg-sky-100 text-sky-700"
                    : "bg-slate-100 text-slate-700",
                ].join(" ")}
              >
                {active ? "Selecionado" : "Selecionar"}
              </span>
            </Button>
          );
        })}

        {!items.length ? (
          <div className="p-4 text-sm text-slate-500">Nenhum item encontrado.</div>
        ) : null}
      </div>
    </div>
  );
}
