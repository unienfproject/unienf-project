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
import {
  EllipsisVertical,
  Eye,
  FolderPlus,
  FolderSearch2,
  Funnel,
} from "lucide-react";
import { useMemo, useState } from "react";

type CursoMock = {
  id: string;
  name: string;
  professor: string;
  tag: string;
};

const mockCursos: CursoMock[] = [
  {
    id: "1",
    name: "Técnico Enfermagem",
    professor: "Maria da Silva",
    tag: "TECN2024.1",
  },
  {
    id: "2",
    name: "Instrumentação Cirúrgica",
    professor: "João Paulo",
    tag: "INSTRU2024.1",
  },
  {
    id: "3",
    name: "Auxiliar de Enfermagem",
    professor: "Ana Costa",
    tag: "AUX2024.1",
  },
];

export default function Cursos() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCursos = useMemo(() => {
    if (!searchTerm.trim()) return mockCursos;

    const term = searchTerm.toLowerCase().trim();
    return mockCursos.filter(
      (curso) =>
        curso.name.toLowerCase().includes(term) ||
        curso.professor.toLowerCase().includes(term) ||
        curso.tag.toLowerCase().includes(term),
    );
  }, [searchTerm]);

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
              className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap shadow-sm transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 pl-10 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  placeholder="Buscar por curso..."
                />
              </div>
              <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                <Funnel />
                Filtros
              </Button>
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
                      Professor
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                      Etiqueta
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-right text-sm font-medium">
                      Ações
                    </TableHead>
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
                              <div>
                                <p className="text-foreground text-sm font-medium">
                                  {curso.name}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground px-6 py-4 text-sm">
                            {curso.professor}
                          </TableCell>
                          <TableCell className="text-foreground px-6 py-4 text-sm">
                            {curso.tag}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                                <Eye />
                                Ver Turma
                              </Button>
                              <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-10 items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                                <EllipsisVertical />
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
                Mostrando {filteredCursos.length} de {mockCursos.length} cursos
              </p>
              <div className="flex items-center gap-2">
                <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-input bg-primary hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                  Anterior
                </Button>
                <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-input bg-primary hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
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
