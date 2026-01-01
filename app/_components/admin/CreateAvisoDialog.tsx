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
import { Textarea } from "@/app/_components/ui/textarea";
import {
  listAlunosForAvisoPicker,
  listTurmasForAvisoPicker,
} from "@/app/_lib/actions/avisos";
import { createAvisoAdmin } from "@/app/_lib/actions/notices";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

interface CreateAvisoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PickerItem = { id: string; label: string };

export default function CreateAvisoDialog({
  open,
  onOpenChange,
}: CreateAvisoDialogProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [form, setForm] = useState({
    title: "",
    message: "",
    targetType: "turma" as "turma" | "alunos",
    turmaId: "",
  });

  const [turmas, setTurmas] = useState<PickerItem[]>([]);
  const [alunos, setAlunos] = useState<PickerItem[]>([]);
  const [selectedAlunoIds, setSelectedAlunoIds] = useState<string[]>([]);
  const [alunoQuery, setAlunoQuery] = useState("");

  useEffect(() => {
    if (open) {
      Promise.all([listTurmasForAvisoPicker(), listAlunosForAvisoPicker()])
        .then(([tur, alu]) => {
          setTurmas(tur);
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

    if (!form.title.trim()) {
      toast.error("Título é obrigatório.");
      return;
    }
    if (!form.message.trim()) {
      toast.error("Mensagem é obrigatória.");
      return;
    }
    if (form.targetType === "turma" && !form.turmaId) {
      toast.error("Selecione uma turma.");
      return;
    }
    if (form.targetType === "alunos" && selectedAlunoIds.length === 0) {
      toast.error("Selecione pelo menos um aluno.");
      return;
    }

    startTransition(async () => {
      try {
        await createAvisoAdmin({
          title: form.title.trim(),
          message: form.message.trim(),
          target:
            form.targetType === "turma"
              ? { type: "turma", classId: form.turmaId }
              : { type: "alunos", studentIds: selectedAlunoIds },
        });

        toast.success("Aviso criado com sucesso!");
        setForm({
          title: "",
          message: "",
          targetType: "turma",
          turmaId: "",
        });
        setSelectedAlunoIds([]);
        onOpenChange(false);
        router.refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Erro ao criar aviso.",
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
          <DialogTitle>Novo Aviso</DialogTitle>
          <DialogDescription>
            Crie um aviso para alunos ou turmas específicas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex.: Início das aulas práticas"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Digite a mensagem do aviso..."
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetType">Destinatário</Label>
            <Select
              value={form.targetType}
              onValueChange={(value: "turma" | "alunos") =>
                setForm({ ...form, targetType: value, turmaId: "" })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="turma">Turma específica</SelectItem>
                <SelectItem value="alunos">Alunos selecionados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {form.targetType === "turma" ? (
            <div className="space-y-2">
              <Label htmlFor="turmaId">Selecione a turma</Label>
              <Select
                value={form.turmaId}
                onValueChange={(value) => setForm({ ...form, turmaId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent>
                  {turmas.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Selecione os alunos</Label>
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
          )}

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
              {pending ? "Salvando..." : "Criar Aviso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
