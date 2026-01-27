"use client";

import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  listStudentsForRecepcao,
  updateStudentProfile,
  type StudentRowForRecepcao,
} from "@/app/_lib/actions/recepcao";
import { Edit, Eye, MoreVertical, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function RecepcaoAlunosPage() {
  const [students, setStudents] = useState<StudentRowForRecepcao[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudents() {
      setLoading(true);
      try {
        const data = await listStudentsForRecepcao(searchTerm || undefined);
        setStudents(data);
      } catch (error) {
        console.error("Erro ao carregar alunos:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, [searchTerm]);

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;
    const term = searchTerm.toLowerCase().trim();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        (s.telefone && s.telefone.toLowerCase().includes(term)),
    );
  }, [students, searchTerm]);

  async function handleUpdate(formData: FormData) {
    const studentId = String(formData.get("studentId") ?? "");
    const name = String(formData.get("name") ?? "").trim();
    const telefone = String(formData.get("telefone") ?? "").trim();

    if (!studentId || !name) return;

    try {
      await updateStudentProfile({
        studentId,
        name,
        telefone: telefone ? telefone : null,
      });
      const data = await listStudentsForRecepcao(searchTerm || undefined);
      setStudents(data);
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      alert("Erro ao atualizar dados do aluno.");
    }
  }

  return (
    <div className="flex flex-col">
      <main className="p-4">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-slate-900">Alunos</h1>
      </div>
      <section className="gap-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="border-b p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Lista de alunos</h2>
              <p className="text-sm text-slate-600">
                Busque por nome, email ou telefone. Edite nome e telefone.
              </p>
            </div>
            <div className="relative max-w-md flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, email ou telefone..."
                className="h-10 rounded-md border border-slate-200 px-3 pl-10 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="overflow-auto">
          <Table className="w-full min-w-[1000px] text-sm">
            <TableHeader className="border-b bg-slate-50">
              <TableRow>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Nome
                </TableHead>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  E-mail
                </TableHead>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Telefone
                </TableHead>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="p-6 text-center text-slate-500"
                  >
                    Carregando alunos...
                  </TableCell>
                </TableRow>
              ) : filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="p-6 text-center text-slate-500"
                  >
                    {searchTerm
                      ? "Nenhum aluno encontrado com o termo pesquisado."
                      : "Sem alunos cadastrados."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((s) => (
                  <TableRow key={s.id} className="border-b last:border-b-0">
                    <TableCell className="p-3">
                      <p className="text-sm font-medium text-slate-900">
                        {s.name}
                      </p>
                    </TableCell>

                    <TableCell className="p-3 text-slate-700">
                      {s.email}
                    </TableCell>

                    <TableCell className="p-3 text-slate-700">
                      {s.telefone || "-"}
                    </TableCell>

                    <TableCell className="p-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/recepcao/alunos/${s.id}`}
                              className="flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              Ver perfil
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/recepcao/alunos/${s.id}?edit=true`}
                              className="flex items-center gap-2"
                            >
                              <Edit className="h-4 w-4" />
                              Editar
                            </Link>
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
      </section>
      </main>
    </div>
  );
}
