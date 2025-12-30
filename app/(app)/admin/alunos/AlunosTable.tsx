"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { useMemo, useState } from "react";

type Aluno = {
  id: string;
  name: string;
  email: string;
  telefone: string | null;
  age?: number | null;
  dateOfBirth?: string | null;
  createdAt: string;
};

interface AlunosTableProps {
  alunos: Aluno[];
}

export default function AlunosTable({ alunos }: AlunosTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAlunos = useMemo(() => {
    if (!searchTerm.trim()) return alunos;

    const term = searchTerm.toLowerCase().trim();
    return alunos.filter(
      (aluno) =>
        aluno.name.toLowerCase().includes(term) ||
        aluno.email.toLowerCase().includes(term) ||
        (aluno.telefone && aluno.telefone.toLowerCase().includes(term)),
    );
  }, [alunos, searchTerm]);

  return (
    <>
      <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-search text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 pl-10 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Buscar por nome, email ou telefone..."
            />
          </div>
          <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-filter mr-2 h-4 w-4"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
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
                  Nome
                </TableHead>
                <TableHead className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                  Telefone
                </TableHead>
                <TableHead className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                  Turma
                </TableHead>
                <TableHead className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                  Documentos
                </TableHead>
                <TableHead className="text-muted-foreground px-6 py-4 text-right text-sm font-medium">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlunos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-muted-foreground px-6 py-4 text-center"
                  >
                    {searchTerm
                      ? "Nenhum aluno encontrado com o termo pesquisado."
                      : "Nenhum aluno encontrado."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlunos.map((aluno) => {
                  const initials = aluno.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <TableRow
                      key={aluno.id}
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
                              {aluno.name}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {aluno.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground px-6 py-4 text-sm">
                        {aluno.telefone || "-"}
                      </TableCell>
                      <TableCell className="text-foreground px-6 py-4 text-sm">
                        -
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="bg-warning/10 text-warning inline-flex rounded-full px-3 py-1 text-xs font-medium">
                          Pendente
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-eye mr-1 h-4 w-4"
                            >
                              <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            Ver Perfil
                          </Button>
                          <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-10 items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-ellipsis-vertical h-4 w-4"
                            >
                              <circle cx="12" cy="12" r="1"></circle>
                              <circle cx="12" cy="5" r="1"></circle>
                              <circle cx="12" cy="19" r="1"></circle>
                            </svg>
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
            Mostrando {filteredAlunos.length} de {alunos.length} alunos
          </p>
          <div className="flex items-center gap-2">
            <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
              Anterior
            </Button>
            <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
              Próximo
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
