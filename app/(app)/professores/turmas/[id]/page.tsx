import { getUserProfile } from "@/app/_lib/actions/profile";
import { getClassDetails, listStudentsForPicker } from "@/app/_lib/actions/classes";
import Link from "next/link";
import { ArrowLeft, Users, Calendar, BookOpen } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import ManageStudentsModal from "@/app/_components/professor/turmas/ManageStudentsModal";
import RemoveStudentButton from "@/app/_components/professor/turmas/RemoveStudentButton";

export default async function ClassDetailsPage({
  params,
}: {
  params: { id: string };
}) {
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

  let classDetails;
  try {
    classDetails = await getClassDetails({
      classId: params.id,
      teacherId: profile.user_id,
    });
  } catch (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          {error instanceof Error ? error.message : "Erro ao carregar turma."}
        </p>
      </div>
    );
  }

  const allStudents = await listStudentsForPicker();

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-center gap-3">
          <Link href="/professores/turmas">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">
              {classDetails.tag}
            </h1>
            <p className="text-slate-600">
              {classDetails.disciplinaName || "Sem disciplina"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs font-medium">Etiqueta</span>
            </div>
            <span className="text-lg font-semibold text-slate-900">
              {classDetails.tag}
            </span>
          </div>

          <div className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium">Período</span>
            </div>
            <span className="text-lg font-semibold text-slate-900">
              {new Date(classDetails.start_date).toLocaleDateString("pt-BR")} -{" "}
              {new Date(classDetails.end_date).toLocaleDateString("pt-BR")}
            </span>
          </div>

          <div className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium">Alunos</span>
            </div>
            <span className="text-lg font-semibold text-slate-900">
              {classDetails.students.length}
            </span>
          </div>
        </div>
      </div>

      <div className="m-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Alunos da Turma</h2>
              <p className="text-sm text-slate-600">
                Gerencie os alunos vinculados a esta turma
              </p>
            </div>
            {classDetails.status === "ativa" && (
              <ManageStudentsModal
                classId={classDetails.id}
                teacherId={profile.user_id}
                currentStudents={classDetails.students}
                allStudents={allStudents}
              />
            )}
          </div>
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
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {classDetails.students.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="p-6 text-center text-slate-500"
                  >
                    Nenhum aluno vinculado a esta turma.
                  </TableCell>
                </TableRow>
              ) : (
                classDetails.students.map((student) => (
                  <TableRow key={student.id} className="border-b last:border-b-0">
                    <TableCell className="p-3 font-medium text-slate-900">
                      {student.name}
                    </TableCell>
                    <TableCell className="p-3 text-slate-700">
                      {student.email}
                    </TableCell>
                    <TableCell className="p-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/professores/alunos/${student.id}`}
                          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 hover:bg-slate-50"
                        >
                          Ver Perfil
                        </Link>
                        {classDetails.status === "ativa" && (
                          <RemoveStudentButton
                            classId={classDetails.id}
                            studentId={student.id}
                            teacherId={profile.user_id}
                          />
                        )}
                      </div>
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

