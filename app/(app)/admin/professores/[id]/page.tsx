import AdminProfessorProfileTabs from "@/app/_components/admin/AdminProfessorProfileTabs";
import { Button } from "@/app/_components/ui/button";
import { getProfessorProfile } from "@/app/_lib/actions/professores";
import { getUserProfile } from "@/app/_lib/actions/profile";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AdminProfessorProfilePage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const professorId = (resolvedParams as { id: string }).id?.trim();

  if (!professorId || professorId === "undefined" || professorId === "null") {
    return (
      <div className="p-6">
        <p className="text-red-600">ID do professor inválido.</p>
        <Link href="/admin/professores" className="mt-4 inline-block">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>
    );
  }

  const profile = await getUserProfile();

  if (!profile) {
    return <div className="p-6">Sessão inválida. Faça login novamente.</div>;
  }

  if (profile.role !== "administrativo" && profile.role !== "coordenação") {
    return (
      <div className="p-6">
        Sem acesso. Esta página é exclusiva para administrativo e coordenação.
      </div>
    );
  }

  let professorData;
  try {
    professorData = await getProfessorProfile(professorId);
  } catch (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          {error instanceof Error
            ? error.message
            : "Erro ao carregar professor."}
        </p>
        <Link href="/admin/professores" className="mt-4 inline-block">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/professores">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">
              {professorData.name}
            </h1>
            <p className="text-slate-600">Perfil completo do professor</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <AdminProfessorProfileTabs professorData={professorData} />
      </div>
    </div>
  );
}
