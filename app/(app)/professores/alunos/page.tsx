import { getUserProfile } from "@/app/_lib/actions/profile";
import { listStudentsFromMyClasses } from "@/app/_lib/actions/classes";
import Link from "next/link";

export const dynamic = 'force-dynamic';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";

export default async function ProfessorAlunosPage() {
  const profile = await getUserProfile();

  if (!profile) {
    return <div className="p-6">Sessão inválida. Faça login novamente.</div>;
  }

  if (profile.role !== "professor") {
    return (
      <div className="p-6">
        Sem acesso. Esta página é exclusiva do professor.
      </div>
    );
  }

  let students;
  try {
    students = await listStudentsFromMyClasses(profile.user_id);
  } catch (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          {error instanceof Error ? error.message : "Erro ao carregar alunos."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 p-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Meus Alunos</h1>
          <p className="text-slate-600">
            Alunos vinculados às suas turmas. Você pode visualizar dados
            pessoais, mas não financeiro nem documentos.
          </p>
        </div>
      </div>

      <div className="m-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b p-4">
          <h2 className="font-semibold text-slate-900">Lista de Alunos</h2>
          <p className="text-sm text-slate-600">
            {students.length} aluno{students.length !== 1 ? "s" : ""} encontrado
            {students.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="overflow-auto">
          <Table className="w-full text-sm">
            <TableHeader className="border-b bg-slate-50">
              <TableRow>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Nome
                </TableHead>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Email
                </TableHead>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Telefone
                </TableHead>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Idade
                </TableHead>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Turmas
                </TableHead>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="p-6 text-center text-slate-500"
                  >
                    Nenhum aluno encontrado. Você precisa ter turmas com alunos
                    vinculados.
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.id} className="border-b last:border-b-0">
                    <TableCell className="p-3 font-medium text-slate-900">
                      {student.name}
                    </TableCell>
                    <TableCell className="p-3 text-slate-700">
                      {student.email}
                    </TableCell>
                    <TableCell className="p-3 text-slate-700">
                      {student.telefone || "-"}
                    </TableCell>
                    <TableCell className="p-3 text-slate-700">
                      {student.age !== null ? `${student.age} anos` : "-"}
                    </TableCell>
                    <TableCell className="p-3 text-slate-700">
                      <div className="flex flex-wrap gap-1">
                        {student.turmas.map((turma) => (
                          <span
                            key={turma.id}
                            className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                          >
                            {turma.tag}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="p-3">
                      <Link
                        href={`/professores/alunos/${student.id}`}
                        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 hover:bg-slate-50"
                      >
                        Ver Detalhes
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

