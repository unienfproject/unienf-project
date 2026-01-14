import EtiquetasView from "@/app/_components/aluno/EtiquetasView";
import ObservacoesPedagogicasView from "@/app/_components/aluno/ObservacoesPedagogicasView";
import DocumentsView from "@/app/_components/documents/DocumentsView";
import AlunoProfileActions from "@/app/_components/recepcao/AlunoProfileActions";
import EditDadosPessoais from "@/app/_components/recepcao/EditDadosPessoais";
import FinanceiroAlunoView from "@/app/_components/recepcao/FinanceiroAlunoView";
import { Button } from "@/app/_components/ui/button";
import { getAlunoProfile } from "@/app/_lib/actions/alunos";
import { listStudentDocuments } from "@/app/_lib/actions/documents";
import { listMensalidadesByStudent } from "@/app/_lib/actions/mensalidades";
import { getUserProfile } from "@/app/_lib/actions/profile";
import { ArrowLeft, BookOpen, Calendar, Mail } from "lucide-react";
import Link from "next/link";

export default async function RecepcaoAlunoProfilePage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const studentId = (resolvedParams as { id: string }).id?.trim();

  if (!studentId || studentId === "undefined" || studentId === "null") {
    return (
      <div className="p-6">
        <p className="text-red-600">ID do aluno inválido.</p>
        <Link href="/recepcao/alunos" className="mt-4 inline-block">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>
    );
  }

  const profile = await getUserProfile();

  if (!profile) {
    return <div className="p-6">Sessão inválida. Faça login novamente.</div>;
  }

  if (profile.role !== "recepção") {
    return (
      <div className="p-6">
        Sem acesso. Esta página é exclusiva para recepção.
      </div>
    );
  }

  let alunoData;
  try {
    alunoData = await getAlunoProfile(studentId);
  } catch (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          {error instanceof Error ? error.message : "Erro ao carregar aluno."}
        </p>
        <Link href="/recepcao/alunos" className="mt-4 inline-block">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>
    );
  }

  const docs = await listStudentDocuments(studentId);
  const mensalidades = await listMensalidadesByStudent(studentId);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-3">
          <Link href="/recepcao/alunos">
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

        <AlunoProfileActions
          studentId={studentId}
          studentName={alunoData.name}
        />
      </div>

      <div id="dados-pessoais" className="p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Dados Pessoais
          </h2>
          <EditDadosPessoais
            studentId={studentId}
            initialName={alunoData.name}
            initialTelefone={alunoData.telefone}
          />
          <div className="mt-4 space-y-3 border-t pt-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs font-medium text-slate-600">Email</p>
                <p className="text-sm font-medium text-slate-900">
                  {alunoData.email}
                </p>
              </div>
            </div>

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
          </div>
        </div>
      </div>

      <div id="financeiro" className="p-6">
        <FinanceiroAlunoView
          mensalidades={mensalidades}
          studentId={studentId}
        />
      </div>

      <div className="p-6">
        <DocumentsView
          title="Documentos do Aluno"
          subtitle="Gerencie os documentos do aluno, marque como entregue e registre observações."
          canEdit={true}
          docs={docs}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
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

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Etiquetas
          </h2>
          <EtiquetasView studentId={studentId} canEdit={true} />
        </div>
      </div>

      <div className="p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Observações Pedagógicas
          </h2>
          <p className="mb-4 text-sm text-slate-600">
            Apenas visualização. Para criar ou editar observações, entre em
            contato com a coordenação.
          </p>
          <ObservacoesPedagogicasView studentId={studentId} />
        </div>
      </div>
    </div>
  );
}
