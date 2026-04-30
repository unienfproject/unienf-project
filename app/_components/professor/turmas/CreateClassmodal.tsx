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
import { notifyDataChanged } from "@/app/_lib/client/dataRefresh";
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
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: string;
  teacherName: string;
  subjects: PickerItem[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [form, setForm] = useState({
    startDate: new Date().toISOString().slice(0, 10),
    endDate: "",
    disciplinaId: "",
  });
  const autoTag = useMemo(() => {
    const disciplinaNome =
      subjects.find((d) => d.id === form.disciplinaId)?.label ?? "";
    const inicio = form.startDate || "";
    const termino = form.endDate || form.startDate || "";

    if (!disciplinaNome || !teacherName || !inicio || !termino) return "";
    return `${disciplinaNome} - ${teacherName} - ${inicio} - ${termino}`;
  }, [form.disciplinaId, form.endDate, form.startDate, subjects, teacherName]);

  function resetForm() {
    setForm({
      startDate: new Date().toISOString().slice(0, 10),
      endDate: "",
      disciplinaId: "",
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.disciplinaId) {
      toast.error("Selecione uma disciplina.");
      return;
    }

    startTransition(async () => {
      try {
        await createClass({
          teacherId,
          startDate: form.startDate,
          endDate: form.endDate || form.startDate,
          subjectIds: [form.disciplinaId],
          studentIds: [],
        });

        toast.success("Turma criada com sucesso!");
        resetForm();
        onOpenChange(false);
        notifyDataChanged(router);
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
              <Label htmlFor="tag">Etiqueta (automática)</Label>
              <Input
                id="tag"
                value={autoTag}
                readOnly
                placeholder="Será gerada automaticamente"
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
              <Label htmlFor="teacherName">Professor</Label>
              <Input id="teacherName" value={teacherName} readOnly />
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
                  {subjects.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
