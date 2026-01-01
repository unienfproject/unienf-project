"use client";

import CreateAlunoDialog from "@/app/_components/admin/CreateAlunoDialog";
import { Button } from "@/app/_components/ui/button";
import { Plus, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Aluno = {
  id: string;
  name: string;
  email: string;
  telefone: string | null;
  age?: number | null;
  dateOfBirth?: string | null;
  createdAt: string;
};

interface AlunosPageClientProps {
  alunos: Aluno[];
}

export default function AlunosPageClient({ alunos }: AlunosPageClientProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Alunos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os alunos cadastrados
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <UserPlus />
          Nova Matrícula
        </Button>
      </div>

      <CreateAlunoDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            router.refresh();
          }
        }}
      />
    </>
  );
}
