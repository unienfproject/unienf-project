import { getUserProfile } from "@/app/_lib/actions/profile";
import TeacherClassesView from "@/app/_components/professor/turmas/TeacherClassesView";
import { listTeacherClasses } from "@/app/_lib/actions/classes";

export const dynamic = 'force-dynamic';

export default async function ProfessorTurmasPage() {
  const profile = await getUserProfile();

  if (!profile) {
    return <div>Sessão inválida. Faça login novamente.</div>;
  }

  if (profile.role !== "professor") {
    return (
      <div>Sem acesso. Esta página é exclusiva do professor.</div>
    );
  }

  const classes = await listTeacherClasses(profile.user_id);

  return (
    <div className="flex flex-col">
      <TeacherClassesView
        teacherName={profile.name ?? profile.email ?? "Professor"}
        classes={classes}
      />
    </div>
  );
}
