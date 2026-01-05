import { getUserProfile } from "@/app/_lib/actions/profile";
import { getStudentPersonalData } from "@/app/_lib/actions/alunos";
import Link from "next/link";
import { ArrowLeft, User, Mail, Phone, Calendar, BookOpen } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import ObservacoesPedagogicasView from "@/app/_components/aluno/ObservacoesPedagogicasView";

export default async function StudentDetailsPage({
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

  let studentData;
  try {
    studentData = await getStudentPersonalData(params.id, profile.user_id);
  } catch (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          {error instanceof Error ? error.message : "Erro ao carregar aluno."}
        </p>
        <Link href="/professores/alunos" className="mt-4 inline-block">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-center gap-3">
          <Link href="/professores/alunos">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">
              {studentData.name}
            </h1>
            <p className="text-slate-600">Dados pessoais do aluno</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Informações Pessoais
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs font-medium text-slate-600">Nome</p>
                <p className="text-sm font-medium text-slate-900">
                  {studentData.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs font-medium text-slate-600">Email</p>
                <p className="text-sm font-medium text-slate-900">
                  {studentData.email}
                </p>
              </div>
            </div>

            {studentData.telefone && (
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs font-medium text-slate-600">Telefone</p>
                  <p className="text-sm font-medium text-slate-900">
                    {studentData.telefone}
                  </p>
                </div>
              </div>
            )}

            {studentData.age !== null && (
              <div className="flex items-start gap-3">
                <Calendar className="mt-1 h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs font-medium text-slate-600">
                    Idade / Data de Nascimento
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {studentData.age} anos
                    {studentData.dateOfBirth &&
                      ` (${new Date(studentData.dateOfBirth).toLocaleDateString("pt-BR")})`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Turmas</h2>
          {studentData.turmas.length === 0 ? (
            <p className="text-sm text-slate-500">
              Aluno não está vinculado a nenhuma turma.
            </p>
          ) : (
            <div className="space-y-3">
              {studentData.turmas.map((turma) => (
                <div
                  key={turma.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <BookOpen className="h-5 w-5 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {turma.name}
                    </p>
                    <p className="text-xs text-slate-600">
                      {turma.disciplinaName || "Sem disciplina"} • {turma.tag}
                    </p>
                  </div>
                  <Link
                    href={`/professores/turmas/${turma.id}`}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 hover:bg-slate-50"
                  >
                    Ver Turma
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <ObservacoesPedagogicasView studentId={params.id} />
      </div>
    </div>
  );
}

