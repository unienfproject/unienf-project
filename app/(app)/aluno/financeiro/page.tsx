import FinanceiroAlunoView from "@/app/_components/finance/FinanceiroAlunoview";
import { getUserProfile } from "@/app/_lib/actions/profile";

export default async function Financeiro() {
  const profile = await getUserProfile();

  if (!profile) {
    return (
      <div className="flex-1 p-6">Sessão inválida. Faça login novamente.</div>
    );
  }

  if (profile.role !== "aluno") {
    return <div className="flex-1 p-6">Sem acesso ao Financeiro do aluno.</div>;
  }

  return (
    <div className="flex-1">
      <FinanceiroAlunoView
        studentId={profile.user_id}
        studentName={profile.name ?? profile.email ?? "Aluno"}
      />
    </div>
  );
}
