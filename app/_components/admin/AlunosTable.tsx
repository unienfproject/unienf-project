"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/_components/ui/dialog";
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

import { EllipsisVertical, Eye, Pencil, UserSearch } from "lucide-react";

import { usePaginatedData } from "@/app/_hooks/usePaginatedData";
import {
  listAlunosPaginated,
  updateAlunoProfile,
  type AlunoRow,
} from "@/app/_lib/actions/alunos";

const PAGE_SIZE = 10;

export default function AlunosTable() {
  const router = useRouter();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingAluno, setEditingAluno] = useState<AlunoRow | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    items: alunos,
    total,
    page,
    totalPages,
    loading,
    search,
    setSearch,
    prev,
    next,
  } = usePaginatedData(listAlunosPaginated, PAGE_SIZE);

  async function handleSave() {
    if (!editingAluno) return;

    try {
      setSaving(true);

      await updateAlunoProfile({
        alunoId: editingAluno.id,
        name: editingAluno.name,
        email: editingAluno.email,
        telefone: editingAluno.telefone,
        dateOfBirth: editingAluno.dateOfBirth ?? null,
      });

      setIsEditOpen(false);
      setEditingAluno(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <UserSearch className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, email ou telefone..."
              className="pl-12"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Turma</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  Carregando alunos...
                </TableCell>
              </TableRow>
            ) : alunos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  Nenhum aluno encontrado.
                </TableCell>
              </TableRow>
            ) : (
              alunos.map((aluno) => (
                <TableRow key={aluno.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{aluno.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {aluno.email}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>{aluno.telefone || "-"}</TableCell>
                  <TableCell>-</TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="cursor-pointer" variant="ghost" size="icon">
                          <EllipsisVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() =>
                            router.push(`/admin/alunos/${aluno.id}`)
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver perfil
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            setEditingAluno(aluno);
                            setIsEditOpen(true);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between border-t px-6 py-4">
        <p className="text-sm text-muted-foreground">
          Mostrando {alunos.length} de {total} alunos
        </p>
        <div className="flex gap-2">
          <Button className="cursor-pointer" onClick={prev} disabled={page === 1 || loading}>
            Anterior
          </Button>
          <Button className="cursor-pointer" onClick={next} disabled={page === totalPages || loading}>
            Próximo
          </Button>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar aluno</DialogTitle>
          </DialogHeader>

          {editingAluno && (
            <div className="space-y-4">
              <Label htmlFor="name">Nome</Label>
              <Input
                value={editingAluno.name}
                onChange={(e) =>
                  setEditingAluno({ ...editingAluno, name: e.target.value })
                }
                placeholder="Nome"
              />

              <Label htmlFor="email">E-mail</Label>
              <Input
                value={editingAluno.email}
                onChange={(e) =>
                  setEditingAluno({ ...editingAluno, email: e.target.value })
                }
                placeholder="Email"
              />

              <Label htmlFor="Telefone">Telefone</Label>
              <Input
                value={editingAluno.telefone ?? ""}
                onChange={(e) =>
                  setEditingAluno({
                    ...editingAluno,
                    telefone: e.target.value || null,
                  })
                }
                placeholder="Telefone"
              />

              <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
              <Input
                type="date"
                value={editingAluno.dateOfBirth ?? ""}
                onChange={(e) =>
                  setEditingAluno({
                    ...editingAluno,
                    dateOfBirth: e.target.value || null,
                  })
                }
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              disabled={saving}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="cursor-pointer">
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
