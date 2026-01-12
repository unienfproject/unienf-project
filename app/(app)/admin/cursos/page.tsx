"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import CreateCursoDialog from "@/app/_components/admin/CreateCursoDialog";
import EditCursoDialog from "@/app/_components/admin/EditCursoDialog";
import { Button } from "@/app/_components/ui/button";
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

import { CursoRow } from "@/app/_lib/actions/cursos";

interface CursosProps {
  cursos: CursoRow[];
}

export default function Cursos({ cursos = [] }: CursosProps) {
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState<CursoRow | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCursos = useMemo(() => {
    if (!searchTerm.trim()) return cursos;

    const term = searchTerm.toLowerCase().trim();
    return cursos.filter((curso) => {
      const nome = curso.name?.toLowerCase() ?? "";
      const professor = curso.id?.toLowerCase() ?? "";

      return nome.includes(term) || professor.includes(term);
    });
  }, [cursos, searchTerm]);

  return (
    <div className="flex flex-col">
      <CreateCursoDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <EditCursoDialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setSelectedCurso(null);
        }}
        curso={selectedCurso}
      />

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

            <Button onClick={() => setDialogOpen(true)}>
              <FolderPlus />
              Novo Curso
            </Button>
          </div>

          <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-4">
            <div className="relative flex-1">
              <FolderSearch2 className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por curso, professor ou etiqueta..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Curso</TableHead>
                  <TableHead>Professor</TableHead>
                  <TableHead>Etiqueta</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCursos.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-muted-foreground px-6 py-4 text-center"
                    >
                      {searchTerm
                        ? "Nenhum curso encontrado com o termo pesquisado."
                        : "Nenhum curso encontrado."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCursos.map((curso) => {
                    const initials = curso.name
                      .split(" ")
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
                            <p className="text-foreground text-sm font-medium">
                              {curso.name}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell className="text-foreground px-6 py-4 text-sm">
                          {curso.id || "-"}
                        </TableCell>

                        <TableCell className="text-foreground px-6 py-4 text-sm">
                          {curso.name || "-"}
                        </TableCell>

                        <TableCell className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="ring-offset-background focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                                  aria-label="Ações do curso"
                                >
                                  <EllipsisVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() =>
                                    router.push(`/admin/cursos/${curso.id}`)
                                  }
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver Curso
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => {
                                    setSelectedCurso(curso);
                                    setEditDialogOpen(true);
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
              Mostrando {filteredCursos.length} de {cursos.length} alunos
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline">Anterior</Button>
              <Button variant="outline">Próximo</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

