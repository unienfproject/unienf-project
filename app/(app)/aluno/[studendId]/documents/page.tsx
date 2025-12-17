import { getCurrentSession } from "@/app/_lib/mockdata/session.mock";
import {
  canAccessDocuments,
  canEditDocuments,
} from "@/app/_lib/actions/profile";
import { getStudentDocuments } from "@/app/_lib/mockdata/docs.mock";
import DocumentsView from "@/app/_components/documents/DocumentsView";

export default async function DocumentosAlunoStaffPage({
  params,
}: {
  params: { studentId: string };
}) {
  const session = await getCurrentSession();

  if (!canAccessDocuments(session.role)) {
    return <div className="p-6">Sem acesso a Documentos.</div>;
  }

  if (!canEditDocuments(session.role)) {
    return <div className="p-6">Sem permissão para editar documentos.</div>;
  }

  const docs = await getStudentDocuments(params.studentId);

  return (
    <DocumentsView
      title="Documentos do Aluno"
      subtitle="Marque como entregue e registre observações que o aluno verá."
      canEdit
      studentId={params.studentId}
      docs={docs}
    />
  );
}
