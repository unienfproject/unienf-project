"use client";

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
  listStudentsForRecepcao,
  updateStudentProfile,
  type StudentRowForRecepcao,
} from "@/app/_lib/actions/recepcao";
import { Search } from "lucide-react";
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
      <section className="m-6 gap-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
                      <form
                        action={handleUpdate}
                        className="flex items-center gap-2"
                      >
                        <Input type="hidden" name="studentId" value={s.id} />
                        <Input
                          name="name"
                          defaultValue={s.name}
                          className="h-9 w-[320px] rounded-md border border-slate-200 px-3 text-sm"
                        />
                        <Button
                          type="submit"
                          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium hover:bg-slate-50"
                        >
                          Salvar
                        </Button>
                      </form>
                    </TableCell>

                    <TableCell className="p-3 text-slate-700">
                      {s.email}
                    </TableCell>

                    <TableCell className="p-3">
                      <form
                        action={handleUpdate}
                        className="flex items-center gap-2"
                      >
                        <Input type="hidden" name="studentId" value={s.id} />
                        <Input type="hidden" name="name" value={s.name} />
                        <Input
                          name="telefone"
                          defaultValue={s.telefone ?? ""}
                          className="h-9 w-[220px] rounded-md border border-slate-200 px-3 text-sm"
                        />
                        <Button
                          type="submit"
                          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium hover:bg-slate-50"
                        >
                          Salvar
                        </Button>
                      </form>
                    </TableCell>

                    <TableCell className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/recepcao/alunos/${s.id}`}
                          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium hover:bg-slate-50"
                        >
                          Ver perfil
                        </Link>
                        <Link
                          href={`/recepcao/alunos/${s.id}/documentos`}
                          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium hover:bg-slate-50"
                        >
                          Documentos
                        </Link>
                        <Link
                          href={`/recepcao/financeiro?studentId=${s.id}`}
                          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium hover:bg-slate-50"
                        >
                          Financeiro
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
