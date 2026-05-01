import { getUserProfile } from "@/app/_lib/actions/profile";
import { getClassDetails } from "@/app/_lib/actions/classes";
import {
  listAssessmentsForTurmaAccess,
  listStudentsForTurmaGradesAccess,
} from "@/app/_lib/actions/notas";
import ClassDisciplineDetailsView from "@/app/_components/professor/turmas/ClassDisciplineDetailsView";

export default async function ClassDetailsPage({
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
    return <div>Sessão inválida. Faça login novamente.</div>;
  }

  if (profile.role !== "professor") {
    return (
      <div>Sem acesso. Esta página é exclusiva do professor.</div>
    );
  }

  let classDetails;
  try {
    classDetails = await getClassDetails({
      classId: id,
      teacherId: profile.user_id,
    });
  } catch (error) {
    return (
      <div>
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
      details={{
        id: classDetails.id,
        tag: classDetails.tag,
        startDate: classDetails.start_date,
        endDate: classDetails.end_date,
        status: classDetails.status,
        disciplinaName: classDetails.disciplinaName,
        professorId: profile.user_id,
        professorName: profile.name ?? profile.email ?? "Professor",
        students: classDetails.students,
      }}
      assessments={assessments}
      selectedAssessmentId={selectedAssessmentId}
      gradeRows={gradeRows}
      backHref="/professores/turmas"
      profileHrefPrefix="/professores/alunos"
      baseHref={`/professores/turmas/${id}`}
      teacherId={profile.user_id}
    />
  );
}
