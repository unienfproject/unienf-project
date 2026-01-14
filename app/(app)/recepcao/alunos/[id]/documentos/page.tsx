import DocumentsView from "@/app/_components/documents/DocumentsView";
import { Button } from "@/app/_components/ui/button";
import { listStudentDocuments } from "@/app/_lib/actions/documents";
import {
  canAccessDocuments,
  canEditDocuments,
  getUserProfile,
} from "@/app/_lib/actions/profile";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function RecepcaoAlunoDocumentosPage({
  params,
}: {
  params: { id: string };
}) {
  const profile = await getUserProfile();

  if (!profile) {
    return <div className="p-6">Sessão inválida. Faça login novamente.</div>;
  }

  if (!canAccessDocuments(profile.role ?? "")) {
    return <div className="p-6">Sem acesso a Documentos.</div>;
  }

  if (!canEditDocuments(profile.role ?? "")) {
    return <div className="p-6">Sem permissão para editar documentos.</div>;
  }

  const docs = await listStudentDocuments(params.id);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-center gap-3">
          <Link href={`/recepcao/alunos/${params.id}`}>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">
              Documentos do Aluno
            </h1>
            <p className="text-slate-600">
              Marque como entregue e registre observações que o aluno verá.
            </p>
          </div>
        </div>
      </div>

      <DocumentsView
        title="Documentos do Aluno"
        subtitle="Gerencie os documentos do aluno, marque como entregue e registre observações."
        canEdit={true}
        docs={docs}
      />
    </div>
  );
}
