import { listAlunos } from "@/app/_lib/actions/alunos";
import AlunosPageClient from "./AlunosPageClient";
import AlunosTable from "./AlunosTable";

export default async function Alunos() {
  let alunos: Awaited<ReturnType<typeof listAlunos>> = [];

  try {
    alunos = await listAlunos();
  } catch {
    alunos = [];
  }

  return (
    <div className="flex flex-col">
      <main className="p-6">
        <div className="space-y-6">
          <AlunosPageClient alunos={alunos} />
          <AlunosTable alunos={alunos} />
        </div>
      </main>
    </div>
  );
}
