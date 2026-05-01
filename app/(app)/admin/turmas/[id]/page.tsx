import ClassDisciplineDetailsView from "@/app/_components/professor/turmas/ClassDisciplineDetailsView";
import { getUserProfile } from "@/app/_lib/actions/profile";
import { getTurmaDetailForStaff } from "@/app/_lib/actions/turmas";
import {
  listAssessmentsForTurmaAccess,
  listStudentsForTurmaGradesAccess,
} from "@/app/_lib/actions/notas";
import { listStudentsForPicker } from "@/app/_lib/actions/classes";

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
    return <div>Sessão inválida. Faça login novamente.</div>;
  }

  const allowedRoles = ["administrativo", "coordenação"];
  if (!allowedRoles.includes(profile.role ?? "")) {
    return <div>Sem acesso a esta turma.</div>;
  }

  let turma;
  try {
    turma = await getTurmaDetailForStaff(id);
  } catch (error) {
    return (
      <div>
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
      backHref="/admin/turmas"
      profileHrefPrefix="/admin/alunos"
      baseHref={`/admin/turmas/${id}`}
      teacherId={turma.professorId ?? undefined}
      allStudents={allStudents}
      canManageStudents
      canEditGrades={false}
    />
  );
}
