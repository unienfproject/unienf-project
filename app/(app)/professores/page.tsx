import OverallProfessorClient from "@/app/_components/professor/OverallProfessorClient";
import { getProfessorOverview } from "@/app/_lib/actions/professores";

export default async function Overall() {
  const data = await getProfessorOverview();
  return <OverallProfessorClient {...data} />;
}
