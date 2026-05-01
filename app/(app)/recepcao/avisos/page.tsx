import RecepcaoAvisosView from "@/app/_components/recepcao/RecepcaoAvisosView";
import { getUserProfile } from "@/app/_lib/actions/profile";
import { listNoticesReadOnly } from "@/app/_lib/actions/recepcao";

export const dynamic = "force-dynamic";

export default async function RecepcaoAvisosPage() {
  const profile = await getUserProfile();

  if (!profile) {
    return <div>Sessão inválida. Faça login novamente.</div>;
  }

  if (profile.role !== "recepção") {
    return <div>Sem acesso.</div>;
  }

  const notices = await listNoticesReadOnly();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-slate-900">Avisos</h1>
      <RecepcaoAvisosView notices={notices} />
    </div>
  );
}
