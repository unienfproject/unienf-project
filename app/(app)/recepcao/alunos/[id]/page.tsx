import AlunoProfileActions from "@/app/_components/recepcao/AlunoProfileActions";
import AlunoProfileTabs from "@/app/_components/recepcao/AlunoProfileTabs";
import { Button } from "@/app/_components/ui/button";
import { getAlunoProfile } from "@/app/_lib/actions/alunos";
import { listAvisosForStudent } from "@/app/_lib/actions/avisos";
import { listStudentDocuments } from "@/app/_lib/actions/documents";
import { listMensalidadesByStudent } from "@/app/_lib/actions/mensalidades";
import { listNotasByStudent } from "@/app/_lib/actions/notas";
import { getUserProfile } from "@/app/_lib/actions/profile";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function RecepcaoAlunoProfilePage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const studentId = (resolvedParams as { id: string }).id?.trim();

  if (!studentId || studentId === "undefined" || studentId === "null") {
    return (
      <div className="p-6">
        <p className="text-red-600">ID do aluno inválido.</p>
        <Link href="/recepcao/alunos" className="mt-4 inline-block">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>
    );
  }

  const profile = await getUserProfile();

  if (!profile) {
    return <div className="p-6">Sessão inválida. Faça login novamente.</div>;
  }

  if (profile.role !== "recepção") {
    return (
      <div className="p-6">
        Sem acesso. Esta página é exclusiva para recepção.
      </div>
    );
  }

  let alunoData;
  try {
    alunoData = await getAlunoProfile(studentId);
  } catch (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          {error instanceof Error ? error.message : "Erro ao carregar aluno."}
        </p>
        <Link href="/recepcao/alunos" className="mt-4 inline-block">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>
    );
  }

  const docs = await listStudentDocuments(studentId);
  const mensalidades = await listMensalidadesByStudent(studentId);
  const avisos = await listAvisosForStudent(studentId);
  const notas = await listNotasByStudent(studentId);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-3">
          <Link href="/recepcao/alunos">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">
              {alunoData.name}
            </h1>
            <p className="text-slate-600">Perfil completo do aluno</p>
          </div>
        </div>

        <AlunoProfileActions
          studentId={studentId}
          studentName={alunoData.name}
        />
      </div>

      <div className="p-6">
        <AlunoProfileTabs
          alunoData={alunoData}
          docs={docs}
          mensalidades={mensalidades}
          avisos={avisos}
          notas={notas}
          studentId={studentId}
        />
      </div>
    </div>
  );
}
