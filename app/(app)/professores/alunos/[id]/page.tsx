import { getUserProfile } from "@/app/_lib/actions/profile";
import { getStudentPersonalData } from "@/app/_lib/actions/alunos";
import { listFrequenciasByStudent } from "@/app/_lib/actions/frequencias";
import { listNotasByStudent } from "@/app/_lib/actions/notas";
import FrequenciaTable from "@/app/_components/aluno/FrequenciaTable";
import Link from "next/link";
import { ArrowLeft, User, Mail, Phone, Calendar, BookOpen } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";

function formatNota(value: number | null) {
  return value === null ? "-" : value.toFixed(1);
}

function statusLabel(status: "aprovado" | "reprovado" | "em_andamento") {
  if (status === "aprovado") return "Aprovado";
  if (status === "reprovado") return "Reprovado";
  return "Em andamento";
}

function statusClass(status: "aprovado" | "reprovado" | "em_andamento") {
  if (status === "aprovado") return "bg-green-100 text-green-800";
  if (status === "reprovado") return "bg-red-100 text-red-800";
  return "bg-yellow-100 text-yellow-800";
}

export default async function StudentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const profile = await getUserProfile();

  if (!profile) {
    return <div>Sessão inválida. Faça login novamente.</div>;
  }

  if (profile.role !== "professor") {
    return (
      <div>Sem acesso. Esta página é exclusiva do professor.</div>
    );
  }

  let studentData;
  let notas: Awaited<ReturnType<typeof listNotasByStudent>> = [];
  let frequencias: Awaited<ReturnType<typeof listFrequenciasByStudent>> = [];
  try {
    studentData = await getStudentPersonalData(params.id, profile.user_id);
    notas = await listNotasByStudent(params.id);
    frequencias = await listFrequenciasByStudent(params.id);
  } catch (error) {
    return (
      <div>
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
      <div className="flex flex-col gap-3">
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
            <p className="text-slate-600">
              Dados pessoais e acompanhamento acadêmico
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="dados-pessoais" className="mt-6 pb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dados-pessoais">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="academico">AcadÃªmico</TabsTrigger>
        </TabsList>

        <TabsContent value="dados-pessoais" className="mt-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

        </TabsContent>

        <TabsContent value="academico" className="mt-6">
      <div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Notas
            </h2>
            {!notas || notas.length === 0 ? (
              <p className="text-sm text-slate-500">
                Não existem notas para serem mostradas ainda.
              </p>
            ) : (
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">Turma</th>
                      <th className="p-2 text-center">A1</th>
                      <th className="p-2 text-center">A2</th>
                      <th className="p-2 text-center">A3</th>
                      <th className="p-2 text-center">REC</th>
                      <th className="p-2 text-center">Média</th>
                      <th className="p-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notas.map((nota) => (
                      <tr key={nota.turmaId} className="border-b">
                        <td className="p-2">
                          <div>
                            <p className="font-medium">{nota.turmaName}</p>
                            <p className="text-xs text-slate-600">
                              {nota.disciplinaName}
                            </p>
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          {formatNota(nota.a1)}
                        </td>
                        <td className="p-2 text-center">
                          {formatNota(nota.a2)}
                        </td>
                        <td className="p-2 text-center">
                          {formatNota(nota.a3)}
                        </td>
                        <td className="p-2 text-center">
                          {formatNota(nota.rec)}
                        </td>
                        <td className="p-2 text-center font-medium">
                          {formatNota(nota.media)}
                        </td>
                        <td className="p-2 text-center">
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${statusClass(
                              nota.status,
                            )}`}
                          >
                            {statusLabel(nota.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <FrequenciaTable frequencias={frequencias ?? []} />
        </div>
      </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

