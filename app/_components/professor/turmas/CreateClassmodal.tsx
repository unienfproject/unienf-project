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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { createClass } from "@/app/_lib/actions/classes";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

type PickerItem = { id: string; label: string; description?: string | null };

export default function CreateClassModal({
  open,
  onOpenChange,
  teacherId,
  subjects,
  students,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: string;
  subjects: PickerItem[];
  students: PickerItem[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [form, setForm] = useState({
    name: "",
    tag: "",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: "",
    disciplinaId: "",
  });
  const [selectedAlunoIds, setSelectedAlunoIds] = useState<string[]>([]);
  const [alunoQuery, setAlunoQuery] = useState("");

  const filteredAlunos = useMemo(() => {
    const q = alunoQuery.trim().toLowerCase();
    if (!q) return students;
    return students.filter((a) => a.label.toLowerCase().includes(q));
  }, [alunoQuery, students]);

  const selectedDisciplina = useMemo(
    () => subjects.find((s) => s.id === form.disciplinaId) ?? null,
    [subjects, form.disciplinaId],
  );

  function toggleAluno(id: string) {
    setSelectedAlunoIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function resetForm() {
    setForm({
      name: "",
      tag: "",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: "",
      disciplinaId: "",
    });
    setSelectedAlunoIds([]);
    setAlunoQuery("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Nome da turma é obrigatório.");
      return;
    }
    if (!form.tag.trim()) {
      toast.error("Etiqueta é obrigatória.");
      return;
    }
    if (!form.disciplinaId) {
      toast.error("Selecione uma disciplina.");
      return;
    }

    startTransition(async () => {
      try {
        await createClass({
          teacherId,
          name: form.name.trim(),
          tag: form.tag.trim(),
          startDate: form.startDate,
          endDate: form.endDate || form.startDate,
          subjectIds: [form.disciplinaId],
          studentIds: selectedAlunoIds,
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da turma</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex.: Turma 0624"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag">Etiqueta</Label>
              <Input
                id="tag"
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                placeholder="Ex.: 0624-NOITE"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data de início</Label>
              <Input
                id="startDate"
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Data de término</Label>
              <Input
                id="endDate"
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="disciplinaId">Disciplina</Label>
            <Select
              value={form.disciplinaId}
              onValueChange={(value) =>
                setForm({ ...form, disciplinaId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma disciplina" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedDisciplina?.description?.trim() ? (
              <p className="text-muted-foreground text-xs">
                Conteúdo: {selectedDisciplina.description}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label>Alunos (opcional)</Label>
            <Input
              value={alunoQuery}
              onChange={(e) => setAlunoQuery(e.target.value)}
              placeholder="Buscar alunos..."
              className="mb-2"
            />
            <div className="max-h-40 space-y-1 overflow-auto rounded-md border p-2">
              {filteredAlunos.length > 0 ? (
                filteredAlunos.map((aluno) => {
                  const selected = selectedAlunoIds.includes(aluno.id);
                  return (
                    <Button
                      key={aluno.id}
                      type="button"
                      variant={selected ? "default" : "outline"}
                      onClick={() => toggleAluno(aluno.id)}
                      className="w-full justify-start"
                    >
                      {aluno.label}
                      {selected && " ✓"}
                    </Button>
                  );
                })
              ) : (
                <p className="py-2 text-center text-sm text-slate-500">
                  Nenhum aluno encontrado
                </p>
              )}
            </div>
            {selectedAlunoIds.length > 0 ? (
              <p className="text-xs text-slate-600">
                {selectedAlunoIds.length} aluno(s) selecionado(s)
              </p>
            ) : null}
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
