import DocumentsView from "@/app/_components/documents/DocumentsView";
import { canAccessDocuments, getUserProfile } from "@/app/_lib/actions/profile";
import { listMyDocuments } from "@/app/_lib/actions/documents";

export const dynamic = 'force-dynamic';

export default async function DocumentosPage() {
  const profile = await getUserProfile();

  if (!profile) {
    return <div>Sessão inválida. Faça login novamente.</div>;
  }

  const hasAccess = await canAccessDocuments(profile.role ?? "");

  if (!hasAccess) {
    return <div>Sem acesso a Documentos.</div>;
  }

  if (profile.role !== "aluno") {
    return (
      <div>
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
      docs={docs}
    />
  );
}
