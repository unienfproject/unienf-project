import AlunosPageClient from "@/app/_components/admin/AlunosPageClient";
import AlunosTable from "@/app/_components/admin/AlunosTable";

export const dynamic = 'force-dynamic';

export default async function Alunos() {
  return (
    <div className="flex flex-col">
      <main className="p-6">
        <div className="space-y-6">
          <AlunosPageClient />
          <AlunosTable />
        </div>
      </main>
    </div>
  );
}
