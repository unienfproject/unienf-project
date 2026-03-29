import RecepcaoAvisosView from "@/app/_components/recepcao/RecepcaoAvisosView";
import { getUserProfile } from "@/app/_lib/actions/profile";
import { listNoticesReadOnly } from "@/app/_lib/actions/recepcao";

export const dynamic = "force-dynamic";

export default async function RecepcaoAvisosPage() {
  const profile = await getUserProfile();

  if (!profile) {
    return <div className="p-6">Sessão inválida. Faça login novamente.</div>;
  }

  if (profile.role !== "recepção") {
    return <div className="p-6">Sem acesso.</div>;
  }

  const notices = await listNoticesReadOnly();

  return (
    <div className="flex flex-col">
      <main className="p-4">
        <div className="flex flex-col gap-3 p-6">
          <h1 className="text-3xl font-bold text-slate-900">Avisos</h1>
        </div>

        <RecepcaoAvisosView notices={notices} />
      </main>
    </div>
  );
}
