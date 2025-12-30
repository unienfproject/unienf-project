"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { updateUserRole } from "@/app/_lib/actions/users";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type Role =
  | "recepção"
  | "coordenação"
  | "administrativo"
  | "professor"
  | "aluno";

interface EditRoleButtonProps {
  userId: string;
  currentRole: string;
  userName: string;
}

export default function EditRoleButton({
  userId,
  currentRole,
  userName,
}: EditRoleButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(currentRole as Role);

  async function handleSave() {
    if (selectedRole === currentRole) {
      setIsOpen(false);
      return;
    }

    startTransition(async () => {
      try {
        await updateUserRole({
          userId,
          newRole: selectedRole,
        });

        toast.success(
          `Role de ${userName} alterada de "${currentRole}" para "${selectedRole}".`,
        );
        router.refresh();
        setIsOpen(false);
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : "Erro ao alterar role do usuário.",
        );
      }
    });
  }

  if (!isOpen) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="h-8 w-8 p-0"
        title="Editar função"
      >
        <Pencil className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedRole}
        onValueChange={(v) => setSelectedRole(v as Role)}
        disabled={pending}
      >
        <SelectTrigger className="h-8 w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="aluno">Aluno</SelectItem>
          <SelectItem value="professor">Professor</SelectItem>
          <SelectItem value="recepção">Recepção</SelectItem>
          <SelectItem value="coordenação">Coordenação</SelectItem>
          <SelectItem value="administrativo">Administrativo</SelectItem>
        </SelectContent>
      </Select>
      <Button
        type="button"
        size="sm"
        onClick={handleSave}
        disabled={pending || selectedRole === currentRole}
        className="h-8"
      >
        {pending ? "Salvando..." : "Salvar"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          setIsOpen(false);
          setSelectedRole(currentRole as Role);
        }}
        disabled={pending}
        className="h-8"
      >
        Cancelar
      </Button>
    </div>
  );
}
