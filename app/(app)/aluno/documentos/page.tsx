import DocumentsView from "@/app/_components/documents/DocumentsView";
import { canAccessDocuments, getUserProfile } from "@/app/_lib/actions/profile";
import { listMyDocuments } from "@/app/_lib/actions/documents";

export default async function DocumentosPage() {
  const profile = await getUserProfile();

  if (!profile) {
    return <div className="p-6">Sessão inválida. Faça login novamente.</div>;
  }

  const hasAccess = await canAccessDocuments(profile.role ?? "");

  if (!hasAccess) {
    return <div className="p-6">Sem acesso a Documentos.</div>;
  }

  if (profile.role !== "aluno") {
    return (
      <div className="p-6">
        Esta rota é destinada ao aluno. Para staff, acesse o perfil do aluno em
        {" /dashboard/alunos/[id]/documentos."}
      </div>
    );
  }

  const docs = await listMyDocuments();

  return (
    <DocumentsView
      title="Meus Documentos"
      subtitle="Acompanhe documentos pendentes, entregues e as observações da UNIENF."
      canEdit={false}
      studentId={profile.user_id}
      docs={docs}
    />
  );
}
