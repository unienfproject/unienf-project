import TurmaPricingView from "@/app/_components/finance/TurmaPricingView";
import { getUserProfile } from "@/app/_lib/actions/profile";

export default async function AdminPrecosPage() {
  const profile = await getUserProfile();

  if (!profile) {
    return <div className="flex-1 p-6">Sessão inválida. Faça login novamente.</div>;
  }

  if (profile.role !== "administrativo") {
    return <div className="flex-1 p-6">Sem acesso aos valores das turmas.</div>;
  }

  return <TurmaPricingView basePath="/admin/precos" canEdit />;
}
