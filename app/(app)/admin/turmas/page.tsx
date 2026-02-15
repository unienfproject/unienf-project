"use client";

import CreateTurmaDialog from "@/app/_components/admin/CreateTurmaDialog";
import { Button } from "@/app/_components/ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
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
  EllipsisVertical,
  Eye,
  FolderPlus,
  FolderSearch2,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import { usePaginatedData } from "@/app/_hooks/usePaginatedData";
import { listTurmasPaginated } from "@/app/_lib/actions/turmas";

const PAGE_SIZE = 10;

export default function Turmas() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  const {
    items: turmas,
    total,
    page,
    totalPages,
    loading,
    search,
    setSearch,
    prev,
    next,
  } = usePaginatedData(listTurmasPaginated, PAGE_SIZE);

  return (
    <div className="flex flex-col">
      <CreateTurmaDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <main className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-foreground text-2xl font-bold">
                Disciplinas Cadastradas
              </h1>
              <p className="text-muted-foreground">
                Gerencie todas as disciplinas cadastradas
              </p>
            </div>

            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <FolderPlus />
              Nova Disciplina
            </Button>
          </div>

          <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <FolderSearch2 className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
                <Input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12"
                  placeholder="Buscar por disciplina, professor ou etiqueta..."
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
                      Turma
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                      Professor
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                      Disciplina
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
                        colSpan={4}
                        className="text-muted-foreground px-6 py-6 text-center"
                      >
                        Carregando Disciplinas...
                      </TableCell>
                    </TableRow>
                  ) : turmas.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-muted-foreground px-6 py-4 text-center"
                      >
                        {search
                          ? "Nenhuma turma encontrada com o termo pesquisado."
                          : "Nenhuma turma encontrada."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    turmas.map((turma) => {
                      const disciplina = turma.disciplinaName || "Disciplina";
                      const initials = disciplina
                        .split(" ")
                        .filter(Boolean)
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);

                      return (
                        <TableRow
                          key={turma.id}
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
                                  {disciplina}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="text-foreground px-6 py-4 text-sm">
                            {turma.professorName || "-"}
                          </TableCell>

                          <TableCell className="text-foreground px-6 py-4 text-sm">
                            {turma.tag || "-"}
                          </TableCell>

                          <TableCell className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg"
                                    aria-label="Ações da Turma"
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
                                      router.push(`/admin/turmas/${turma.id}`)
                                    }
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver Disciplina
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => {
                                      // TODO: abrir modal de edição
                                    }}
                                  >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Editar
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

            <div className="border-border/50 flex items-center justify-between border-t px-6 py-4">
              <p className="text-muted-foreground text-sm">
                Mostrando {turmas.length} de {total} disciplinas
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={prev}
                  disabled={page === 1 || loading}
                >
                  Anterior
                </Button>
                <Button
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
    </div>
  );
}
