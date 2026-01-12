"use client";

import CreateCursoDialog from "@/app/_components/admin/CreateCursoDialog";
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
import { usePaginatedData } from "@/app/_hooks/usePaginatedData";
import { listCursosPaginated } from "@/app/_lib/actions/cursos";
import { EllipsisVertical, Eye, FolderPlus, FolderSearch2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PAGE_SIZE = 10;

export default function Cursos() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  const {
    items: cursos,
    total,
    page,
    totalPages,
    loading,
    search,
    setSearch,
    prev,
    next,
  } = usePaginatedData(listCursosPaginated, PAGE_SIZE);

  return (
    <div className="flex flex-col">
      <CreateCursoDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <main className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-foreground text-2xl font-bold">
                Cursos Técnicos e Extras
              </h1>
              <p className="text-muted-foreground">
                Gerencie os cursos realizados.
              </p>
            </div>

            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <FolderPlus />
              Novo Curso
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
                  className="pl-10"
                  placeholder="Buscar por curso..."
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
                      Curso
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                      Duração (meses)
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
                        Carregando cursos...
                      </TableCell>
                    </TableRow>
                  ) : cursos.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-muted-foreground px-6 py-4 text-center"
                      >
                        {search
                          ? "Nenhum curso encontrado com o termo pesquisado."
                          : "Nenhum curso encontrado."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    cursos.map((curso) => {
                      const name = curso.name || "Curso";
                      const initials = name
                        .split(" ")
                        .filter(Boolean)
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);

                      return (
                        <TableRow
                          key={curso.id}
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
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="text-foreground px-6 py-4 text-sm">
                            {curso.durationMonths ?? "-"}
                          </TableCell>

                          <TableCell className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  router.push(`/admin/cursos/${curso.id}`)
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver curso
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Mais ações"
                              >
                                <EllipsisVertical className="h-4 w-4" />
                              </Button>
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
                Mostrando {cursos.length} de {total} cursos
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
