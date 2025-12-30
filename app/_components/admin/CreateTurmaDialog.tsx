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
import {
  createTurmaAdmin,
  listStudentsForPicker,
  listSubjectsForPicker,
} from "@/app/_lib/actions/classes";
import { listProfessoresForPicker } from "@/app/_lib/actions/turmas";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

interface CreateTurmaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PickerItem = { id: string; label: string };

export default function CreateTurmaDialog({
  open,
  onOpenChange,
}: CreateTurmaDialogProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [form, setForm] = useState({
    name: "",
    tag: "",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: "",
    professorId: "",
    disciplinaId: "",
  });

  const [professores, setProfessores] = useState<PickerItem[]>([]);
  const [disciplinas, setDisciplinas] = useState<PickerItem[]>([]);
  const [alunos, setAlunos] = useState<PickerItem[]>([]);
  const [selectedAlunoIds, setSelectedAlunoIds] = useState<string[]>([]);
  const [alunoQuery, setAlunoQuery] = useState("");

  useEffect(() => {
    if (open) {
      Promise.all([
        listProfessoresForPicker(),
        listSubjectsForPicker(),
        listStudentsForPicker(),
      ])
        .then(([prof, disc, alu]) => {
          setProfessores(prof);
          setDisciplinas(disc);
          setAlunos(alu);
        })
        .catch((err) => {
          toast.error("Erro ao carregar dados.");
          console.error(err);
        });
    }
  }, [open]);

  const filteredAlunos = useMemo(() => {
    const q = alunoQuery.trim().toLowerCase();
    if (!q) return alunos;
    return alunos.filter((a) => a.label.toLowerCase().includes(q));
  }, [alunoQuery, alunos]);

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
    if (!form.professorId) {
      toast.error("Selecione um professor.");
      return;
    }
    if (!form.disciplinaId) {
      toast.error("Selecione uma disciplina.");
      return;
    }

    startTransition(async () => {
      try {
        await createTurmaAdmin({
          name: form.name.trim(),
          tag: form.tag.trim(),
          startDate: form.startDate,
          endDate: form.endDate || form.startDate,
          professorId: form.professorId,
          disciplinaId: form.disciplinaId,
          studentIds: selectedAlunoIds,
        });

        toast.success("Turma criada com sucesso!");
        setForm({
          name: "",
          tag: "",
          startDate: new Date().toISOString().slice(0, 10),
          endDate: "",
          professorId: "",
          disciplinaId: "",
        });
        setSelectedAlunoIds([]);
        onOpenChange(false);
        router.refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Erro ao criar turma.",
        );
      }
    });
  }

  function toggleAluno(id: string) {
    setSelectedAlunoIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="professorId">Professor</Label>
              <Select
                value={form.professorId}
                onValueChange={(value) =>
                  setForm({ ...form, professorId: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um professor" />
                </SelectTrigger>
                <SelectContent>
                  {professores.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="disciplinaId">Disciplina</Label>
              <Select
                value={form.disciplinaId}
                onValueChange={(value) =>
                  setForm({ ...form, disciplinaId: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {disciplinas.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
            {selectedAlunoIds.length > 0 && (
              <p className="text-xs text-slate-600">
                {selectedAlunoIds.length} aluno(s) selecionado(s)
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
