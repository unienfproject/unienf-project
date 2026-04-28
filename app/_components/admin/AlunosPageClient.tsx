"use client";

import CreateAlunoDialog from "@/app/_components/admin/CreateAlunoDialog";
import { Button } from "@/app/_components/ui/button";
import { UserPlus } from "lucide-react";
import { useState } from "react";

export default function AlunosPageClient() {
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
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
