import FinanceiroAdminView from "@/app/_components/finance/FinanceiroAdminView";
import { getUserProfile } from "@/app/_lib/actions/profile";

export default async function FinanceiroPage() {
  const profile = await getUserProfile();

  if (!profile) {
    return (
      <div className="flex-1 p-6">Sessão inválida. Faça login novamente.</div>
    );
  }

  if (profile.role !== "administrativo") {
    return (
      <div className="flex-1 p-6">Sem acesso ao Financeiro administrativo.</div>
    );
  }

  return (
    <div className="flex-col">
      <FinanceiroAdminView />
    </div>
  );
}
