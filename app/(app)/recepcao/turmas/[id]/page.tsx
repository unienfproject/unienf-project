import ClassDisciplineDetailsView from "@/app/_components/professor/turmas/ClassDisciplineDetailsView";
import { listStudentsForPicker } from "@/app/_lib/actions/classes";
import {
  listAssessmentsForTurmaAccess,
  listStudentsForTurmaGradesAccess,
} from "@/app/_lib/actions/notas";
import { getUserProfile } from "@/app/_lib/actions/profile";
import { getTurmaDetailForStaff } from "@/app/_lib/actions/turmas";

export default async function RecepcaoTurmaDetailsPage({
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

  if (profile.role !== "recepção") {
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

  const [allStudents, assessments] = await Promise.all([
    listStudentsForPicker(),
    listAssessmentsForTurmaAccess(id),
  ]);
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
      backHref="/recepcao/turmas"
      profileHrefPrefix="/recepcao/alunos"
      baseHref={`/recepcao/turmas/${id}`}
      teacherId={turma.professorId ?? undefined}
      allStudents={allStudents}
      canManageStudents
      canEditGrades={false}
    />
  );
}
