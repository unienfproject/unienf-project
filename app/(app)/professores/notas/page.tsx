import { getUserProfile } from "@/app/_lib/actions/profile";
import { listTeacherClasses } from "@/app/_lib/actions/classes";

// Estas duas actions você vai criar OU mapear para a action de notas que você já tem:
import {
  listStudentsForGrades,
  listAssessmentsForClass,
} from "@/app/_lib/actions/notas";

export const dynamic = 'force-dynamic';

import NotasClient from "./NotasClient";

export default async function NotasPage({
  searchParams,
}: {
  searchParams?: Promise<{ turmaId?: string; avaliacaoId?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const profile = await getUserProfile();
  if (!profile) {
    return <div className="flex-1">Sessão inválida. Faça login novamente.</div>;
  }
  if (profile.role !== "professor") {
    return <div className="flex-1">Sem permissão.</div>;
  }

  const teacherId = profile.user_id;

  const turmas = await listTeacherClasses(teacherId);

  const turmaId =
    (resolvedSearchParams?.turmaId && String(resolvedSearchParams.turmaId)) ||
    (turmas[0]?.id ?? "");

  const avaliacoes = turmaId
    ? await listAssessmentsForClass({ turmaId, teacherId })
    : [];

  const requestedAvaliacaoId = resolvedSearchParams?.avaliacaoId
    ? String(resolvedSearchParams.avaliacaoId)
    : "";

  const avaliacaoId =
    (requestedAvaliacaoId &&
      avaliacoes.some((avaliacao) => avaliacao.id === requestedAvaliacaoId) &&
      requestedAvaliacaoId) ||
    (avaliacoes[0]?.id ?? "");

  const alunos =
    turmaId && avaliacaoId
      ? await listStudentsForGrades({ turmaId, avaliacaoId, teacherId })
      : [];

  return (
    <NotasClient
      teacherName={profile.name ?? "Professor(a)"}
      teacherId={teacherId}
      turmas={turmas}
      turmaId={turmaId}
      avaliacoes={avaliacoes}
      avaliacaoId={avaliacaoId}
      alunos={alunos}
    />
  );
}
