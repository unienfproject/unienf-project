import ProfessorDisciplinasView from "@/app/_components/professor/disciplinas/ProfessorDisciplinasView";
import { listProfessorDisciplinas } from "@/app/_lib/actions/disciplinas";
import { getUserProfile } from "@/app/_lib/actions/profile";

export const dynamic = "force-dynamic";

export default async function ProfessorDisciplinasPage() {
  const profile = await getUserProfile();

  if (!profile) {
    return <div>Sessão inválida. Faça login novamente.</div>;
  }

  if (profile.role !== "professor") {
    return <div>Sem acesso.</div>;
  }

  const disciplinas = await listProfessorDisciplinas();

  return <ProfessorDisciplinasView disciplinas={disciplinas} />;
}
