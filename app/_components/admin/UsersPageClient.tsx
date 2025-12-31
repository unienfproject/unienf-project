"use client";

import CreateUserDialog from "@/app/_components/admin/CreateUserDialog";
import { Button } from "@/app/_components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  telefone: string;
  role: string;
};

interface UsersPageClientProps {
  users: User[];
}

export default function UsersPageClient({ users }: UsersPageClientProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">
          Cadastro de Usuários do Sistema
        </h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      <CreateUserDialog
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

