import DocumentsView from "@/app/_components/documents/DocumentsView";
import { listStudentDocuments } from "@/app/_lib/actions/documents";
import {
  canAccessDocuments,
  canEditDocuments,
  getUserProfile,
} from "@/app/_lib/actions/profile";

export default async function DocumentosAlunoStaffPage({
  params,
}: {
  params: { studentId: string };
}) {
  const profile = await getUserProfile();

  if (!profile) {
    return <div>Sessão inválida. Faça login novamente.</div>;
  }

  if (!canAccessDocuments(profile.role ?? "")) {
    return <div>Sem acesso a Documentos.</div>;
  }

  if (!canEditDocuments(profile.role ?? "")) {
    return <div>Sem permissão para editar documentos.</div>;
  }

  const docs = await listStudentDocuments(params.studentId);

  return (
    <DocumentsView
      title="Documentos do Aluno"
      subtitle="Marque como entregue e registre observações que o aluno verá."
      canEdit
      docs={docs}
    />
  );
}
