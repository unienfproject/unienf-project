import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import FinanceiroAdminView from "@/app/_components/finance/FinanceiroAdminView";

export default async function FinanceiroPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex-1 p-6">Sessão inválida. Faça login novamente.</div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role")
    .eq("user_id", user.id)
    .single();

  if (!profile || profile.role !== "administrativo") {
    return <div className="flex-1 p-6">Perfil não encontrado.</div>;
  }

  return (
    <div className="flex-1 p-6">
      <FinanceiroAdminView />
    </div>
  );
}
