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
import { createCurso } from "@/app/_lib/actions/cursos";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface CreateCursoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateCursoDialog({
  open,
  onOpenChange,
}: CreateCursoDialogProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [form, setForm] = useState({
    name: "",
    durationMonths: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Nome do curso é obrigatório.");
      return;
    }

    startTransition(async () => {
      try {
        await createCurso({
          name: form.name.trim(),
          durationMonths: form.durationMonths
            ? parseInt(form.durationMonths, 10)
            : null,
        });

        toast.success("Curso criado com sucesso!");
        setForm({
          name: "",
          durationMonths: "",
        });
        onOpenChange(false);
        router.refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Erro ao criar curso.",
        );
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Curso</DialogTitle>
          <DialogDescription>
            Preencha os dados para cadastrar um novo curso.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do curso</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex.: Técnico em Enfermagem"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="durationMonths">Duração em meses (opcional)</Label>
            <Input
              id="durationMonths"
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
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Criar Curso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
