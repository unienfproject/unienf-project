"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import CreateProfessorDialog from "@/app/_components/admin/CreateProfessorDialog";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/_components/ui/dialog";

import {
  EllipsisVertical,
  Eye,
  Pencil,
  Trash2,
  UserPlus,
  UserSearch,
} from "lucide-react";

import { usePaginatedData } from "@/app/_hooks/usePaginatedData";
import {
  listProfessoresPaginated,
  updateProfessorProfile,
  deleteProfessor,
  type ProfessorRow,
} from "@/app/_lib/actions/professores";
import { Label } from "@/app/_components/ui/label";

const PAGE_SIZE = 10;

export default function Professores() {
  const router = useRouter();

  const [createOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProfessor, setEditingProfessor] =
    useState<ProfessorRow | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    items: professores,
    total,
    page,
    totalPages,
    loading,
    search,
    setSearch,
    prev,
    next,
  } = usePaginatedData(listProfessoresPaginated, PAGE_SIZE);

  async function handleSaveProfessor() {
    if (!editingProfessor) return;

    try {
      setSaving(true);

      await updateProfessorProfile({
        professorId: editingProfessor.id,
        name: editingProfessor.name,
        email: editingProfessor.email,
        telefone: editingProfessor.telefone,
      });

      setIsEditOpen(false);
      setEditingProfessor(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteProfessor(professor: ProfessorRow) {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o professor "${professor.name}"?`,
    );

    if (!confirmed) return;

    await deleteProfessor(professor.id);
  }

  return (
    <div className="flex flex-col">
      <CreateProfessorDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      <main className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-foreground text-2xl font-bold">
                Professores
              </h1>
              <p className="text-muted-foreground">
                Gerencie todos os professores cadastrados
              </p>
            </div>

            <Button
              onClick={() => setCreateOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <UserPlus className="h-4 w-4" />
              Novo Professor/Instrutor
            </Button>
          </div>

          <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <UserSearch className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
                <Input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12"
                  placeholder="Buscar por nome, email ou telefone..."
                />
              </div>
            </div>
          </div>

          <div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                      Nome
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                      Telefone
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-right text-sm font-medium">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-muted-foreground px-6 py-6 text-center"
                      >
                        Carregando professores...
                      </TableCell>
                    </TableRow>
                  ) : professores.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-muted-foreground px-6 py-4 text-center"
                      >
                        {search
                          ? "Nenhum professor encontrado com o termo pesquisado."
                          : "Nenhum professor encontrado."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    professores.map((prof) => {
                      const name = prof.name ?? "Professor";
                      const initials = name
                        .split(" ")
                        .filter(Boolean)
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);

                      return (
                        <TableRow
                          key={prof.id}
                          className="border-border/50 hover:bg-muted/20 bg-background border-b transition-colors last:border-0"
                        >
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                                <span className="text-primary text-sm font-semibold">
                                  {initials}
                                </span>
                              </div>
                              <div>
                                <p className="text-foreground text-sm font-medium">
                                  {name}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {prof.email ?? "-"}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="text-foreground px-6 py-4 text-sm">
                            {prof.telefone ?? "-"}
                          </TableCell>

                          <TableCell className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-10 items-center justify-center rounded-lg"
                                  >
                                    <EllipsisVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                  align="end"
                                  className="w-44"
                                >
                                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                  <DropdownMenuSeparator />

                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() =>
                                      router.push(
                                        `/admin/professores/${prof.id}`,
                                      )
                                    }
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver perfil
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => {
                                      setEditingProfessor(prof);
                                      setIsEditOpen(true);
                                    }}
                                  >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>

                                  <DropdownMenuSeparator />

                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive cursor-pointer"
                                    onClick={() =>
                                      handleDeleteProfessor(prof)
                                    }
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between border-t px-6 py-4">
              <p className="text-muted-foreground text-sm">
                Mostrando {professores.length} de {total} professores
              </p>

              <div className="flex items-center gap-2">
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  onClick={prev}
                  disabled={page === 1 || loading}
                >
                  Anterior
                </Button>
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  onClick={next}
                  disabled={page === totalPages || loading}
                >
                  Próximo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar professor</DialogTitle>
          </DialogHeader>

          {editingProfessor && (
            <div className="space-y-4">
              <Label htmlFor="Nome">Nome</Label>
              <Input
                value={editingProfessor.name}
                onChange={(e) =>
                  setEditingProfessor({
                    ...editingProfessor,
                    name: e.target.value,
                  })
                }
                placeholder="Nome"
              />

              <Label htmlFor="Email">Email</Label>
              <Input
                value={editingProfessor.email ?? ""}
                onChange={(e) =>
                  setEditingProfessor({
                    ...editingProfessor,
                    email: e.target.value || null,
                  })
                }
                placeholder="Email"
              />

              <Label htmlFor="Telefone">Telefone</Label>
              <Input
                value={editingProfessor.telefone ?? ""}
                onChange={(e) =>
                  setEditingProfessor({
                    ...editingProfessor,
                    telefone: e.target.value || null,
                  })
                }
                placeholder="Telefone"
              />
            </div>
          )}

          <DialogFooter>
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              disabled={saving}
            >
              Cancelar
            </Button>

            <Button className="cursor-pointer" onClick={handleSaveProfessor} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
