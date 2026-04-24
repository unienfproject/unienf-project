import ClassDisciplineDetailsView from "@/app/_components/professor/turmas/ClassDisciplineDetailsView";
import { getUserProfile } from "@/app/_lib/actions/profile";
import { getTurmaDetailForStaff } from "@/app/_lib/actions/turmas";
import {
  listAssessmentsForTurmaAccess,
  listStudentsForTurmaGradesAccess,
} from "@/app/_lib/actions/notas";

export default async function AdminTurmaDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ avaliacaoId?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const profile = await getUserProfile();

  if (!profile) {
    return <div className="p-6">Sessão inválida. Faça login novamente.</div>;
  }

  const allowedRoles = ["administrativo", "coordenação"];
  if (!allowedRoles.includes(profile.role ?? "")) {
    return <div className="p-6">Sem acesso a esta turma.</div>;
  }

  let turma;
  try {
    turma = await getTurmaDetailForStaff(id);
  } catch (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          {error instanceof Error ? error.message : "Erro ao carregar turma."}
        </p>
      </div>
    );
  }

  const assessments = await listAssessmentsForTurmaAccess(id);
  const selectedAssessmentId = query?.avaliacaoId || assessments[0]?.id || "";
  const gradeRows = selectedAssessmentId
    ? await listStudentsForTurmaGradesAccess({
        turmaId: id,
        avaliacaoId: selectedAssessmentId,
      })
    : [];

  return (
    <ClassDisciplineDetailsView
      details={turma}
      assessments={assessments}
      selectedAssessmentId={selectedAssessmentId}
      gradeRows={gradeRows}
      backHref="/admin/turmas"
      profileHrefPrefix="/admin/alunos"
      baseHref={`/admin/turmas/${id}`}
    />
  );
}
