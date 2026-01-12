"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import { Textarea } from "@/app/_components/ui/textarea";
import { updateCurso, type CursoRow } from "@/app/_lib/actions/cursos";

interface EditCursoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  curso: CursoRow | null;
}

export default function EditCursoDialog({
  open,
  onOpenChange,
  curso,
}: EditCursoDialogProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: "",
    description: "",
    durationMonths: "",
  });

  useEffect(() => {
    if (open && curso) {
      setForm({
        name: curso.name ?? "",
        description: curso.description ?? "",
        durationMonths:
          curso.durationMonths !== null && curso.durationMonths !== undefined
            ? String(curso.durationMonths)
            : "",
      });
      return;
    }

    if (!open) {
      setForm({ name: "", description: "", durationMonths: "" });
    }
  }, [open, curso]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!curso) return;

    if (!form.name.trim()) {
      toast.error("Nome do curso e obrigatorio.");
      return;
    }

    startTransition(async () => {
      try {
        await updateCurso({
          id: curso.id,
          name: form.name.trim(),
          description: form.description.trim() || null,
          durationMonths: form.durationMonths
            ? parseInt(form.durationMonths, 10)
            : null,
        });

        toast.success("Curso atualizado com sucesso!");
        onOpenChange(false);
        router.refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Erro ao atualizar curso.",
        );
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Curso</DialogTitle>
          <DialogDescription>
            Atualize os dados do curso selecionado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nome do curso</Label>
            <Input
              id="edit-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex.: Tecnico em Enfermagem"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Descricao (opcional)</Label>
            <Textarea
              id="edit-description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Descreva o curso..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-duration">Duracao em meses (opcional)</Label>
            <Input
              id="edit-duration"
              type="number"
              min="1"
              value={form.durationMonths}
              onChange={(e) =>
                setForm({ ...form, durationMonths: e.target.value })
              }
              placeholder="Ex.: 24"
            />
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
            <Button type="submit" disabled={pending || !curso}>
              {pending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
