import EtiquetasView from "@/app/_components/aluno/EtiquetasView";
import ObservacoesPedagogicasView from "@/app/_components/aluno/ObservacoesPedagogicasView";
import DocumentsView from "@/app/_components/documents/DocumentsView";
import { Button } from "@/app/_components/ui/button";
import { getAlunoProfile } from "@/app/_lib/actions/alunos";
import { listStudentDocuments } from "@/app/_lib/actions/documents";
import { getUserProfile } from "@/app/_lib/actions/profile";
import { ArrowLeft, BookOpen, Calendar, Mail, Phone, User } from "lucide-react";
import Link from "next/link";

export default async function AdminAlunoProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const profile = await getUserProfile();

  if (!profile) {
    return <div className="p-6">Sessão inválida. Faça login novamente.</div>;
  }

  if (profile.role !== "administrativo" && profile.role !== "coordenação") {
    return (
      <div className="p-6">
        Sem acesso. Esta página é exclusiva para administrativo e coordenação.
      </div>
    );
  }

  let alunoData;
  try {
    alunoData = await getAlunoProfile(params.id);
  } catch (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          {error instanceof Error ? error.message : "Erro ao carregar aluno."}
        </p>
        <Link href="/admin/alunos" className="mt-4 inline-block">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>
    );
  }

  const docs = await listStudentDocuments(params.id);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/alunos">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">
              {alunoData.name}
            </h1>
            <p className="text-slate-600">Perfil completo do aluno</p>
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
                  {alunoData.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs font-medium text-slate-600">Email</p>
                <p className="text-sm font-medium text-slate-900">
                  {alunoData.email}
                </p>
              </div>
            </div>

            {alunoData.telefone && (
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs font-medium text-slate-600">Telefone</p>
                  <p className="text-sm font-medium text-slate-900">
                    {alunoData.telefone}
                  </p>
                </div>
              </div>
            )}

            {alunoData.age !== null && (
              <div className="flex items-start gap-3">
                <Calendar className="mt-1 h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs font-medium text-slate-600">
                    Idade / Data de Nascimento
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {alunoData.age} anos
                    {alunoData.dateOfBirth &&
                      ` (${new Date(alunoData.dateOfBirth).toLocaleDateString("pt-BR")})`}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs font-medium text-slate-600">
                  Cadastrado em
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {new Date(alunoData.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Turmas</h2>
          {alunoData.turmas.length === 0 ? (
            <p className="text-sm text-slate-500">
              Aluno não está vinculado a nenhuma turma.
            </p>
          ) : (
            <div className="space-y-3">
              {alunoData.turmas.map((turma) => (
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
                      {turma.status && ` • ${turma.status}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Etiquetas
          </h2>
          <EtiquetasView
            studentId={params.id}
            canEdit={
              profile.role === "administrativo" ||
              profile.role === "coordenação"
            }
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Observações Pedagógicas
          </h2>
          <ObservacoesPedagogicasView studentId={params.id} />
        </div>
      </div>

      <div className="p-6">
        <DocumentsView
          title="Documentos do Aluno"
          subtitle="Gerencie os documentos do aluno, marque como entregue e registre observações."
          canEdit={true}
          docs={docs}
        />
      </div>
    </div>
  );
}
