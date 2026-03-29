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
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const studentId = (resolvedParams as { id: string }).id?.trim();

  if (!studentId || studentId === "undefined" || studentId === "null") {
    return <div className="p-6">ID do aluno inválido.</div>;
  }

  const profile = await getUserProfile();

  if (!profile) {
    return <div className="p-6">Sessão inválida. Faça login novamente.</div>;
  }

  if (!(await canAccessDocuments(profile.role ?? ""))) {
    return <div className="p-6">Sem acesso a Documentos.</div>;
  }

  if (!(await canEditDocuments(profile.role ?? ""))) {
    return <div className="p-6">Sem permissão para editar documentos.</div>;
  }

  const docs = await listStudentDocuments(studentId);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-center gap-3">
          <Link href={`/recepcao/alunos/${studentId}`}>
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
        canEdit={true}
        docs={docs}
      />
    </div>
  );
}
