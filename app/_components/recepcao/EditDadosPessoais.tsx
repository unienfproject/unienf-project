"use client";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { updateStudentProfile } from "@/app/_lib/actions/recepcao";
import { Check, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type Props = {
  studentId: string;
  initialName: string;
  initialTelefone: string | null;
};

export default function EditDadosPessoais({
  studentId,
  initialName,
  initialTelefone,
}: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(initialName);
  const [telefone, setTelefone] = useState(initialTelefone || "");

  function handleCancel() {
    setName(initialName);
    setTelefone(initialTelefone || "");
    setIsEditing(false);
  }

  function handleSave() {
    if (!name.trim()) {
      toast.error("Nome é obrigatório.");
      return;
    }

    startTransition(async () => {
      try {
        await updateStudentProfile({
          studentId,
          name: name.trim(),
          telefone: telefone.trim() || null,
        });
        toast.success("Dados atualizados com sucesso!");
        setIsEditing(false);
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erro ao atualizar dados.",
        );
      }
    });
  }

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="edit-name">Nome</Label>
          <Input
            id="edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome completo"
            disabled={pending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-telefone">Telefone</Label>
          <Input
            id="edit-telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(00) 00000-0000"
            disabled={pending}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={pending}
            size="sm"
            className="flex-1"
          >
            <Check className="mr-2 h-4 w-4" />
            Salvar
          </Button>
          <Button
            onClick={handleCancel}
            disabled={pending}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-4">
          <div>
            <p className="text-xs font-medium text-slate-600">Nome</p>
            <p className="text-sm font-medium text-slate-900">{initialName}</p>
          </div>
          {initialTelefone && (
            <div>
              <p className="text-xs font-medium text-slate-600">Telefone</p>
              <p className="text-sm font-medium text-slate-900">
                {initialTelefone}
              </p>
            </div>
          )}
        </div>
        <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </div>
    </div>
  );
}
