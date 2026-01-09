"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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
  EllipsisVertical,
  Eye,
  Pencil,
  Trash2,
  UserSearch,
} from "lucide-react";

import { AlunoRow } from "@/app/_lib/actions/alunos";

interface AlunosTableProps {
  alunos: AlunoRow[];
}

export default function AlunosTable({ alunos }: AlunosTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAlunos = useMemo(() => {
    if (!searchTerm.trim()) return alunos;

    const term = searchTerm.toLowerCase().trim();
    return alunos.filter((aluno) => {
      const nome = aluno.name?.toLowerCase() ?? "";
      const email = aluno.email?.toLowerCase() ?? "";
      const tel = aluno.telefone?.toLowerCase() ?? "";
      return nome.includes(term) || email.includes(term) || tel.includes(term);
    });
  }, [alunos, searchTerm]);

  return (
    <>
      <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <UserSearch className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 pl-10 text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
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
                <TableHead className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                  Turma
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
                    colSpan={4}
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

                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ring-offset-background focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                                aria-label="Ações do aluno"
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
                                  router.push(`/admin/alunos/${aluno.id}`)
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver perfil
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => {
                                  // TODO: abrir modal de edição com o aluno
                                  // openEditModal(aluno)
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
            Mostrando {filteredAlunos.length} de {alunos.length} alunos
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline">Anterior</Button>
            <Button variant="outline">Próximo</Button>
          </div>
        </div>
      </div>
    </>
  );
}
