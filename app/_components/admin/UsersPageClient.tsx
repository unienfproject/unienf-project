"use client";

import CreateUserDialog from "@/app/_components/admin/CreateUserDialog";
import { Button } from "@/app/_components/ui/button";
import { UserPlus } from "lucide-react";
import { useState } from "react";

export default function UsersPageClient() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">
          Cadastro de Usuários do Sistema
        </h1>
        <Button onClick={() => setDialogOpen(true)}>
          <UserPlus />
          Novo Usuário
        </Button>
      </div>

      <CreateUserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
