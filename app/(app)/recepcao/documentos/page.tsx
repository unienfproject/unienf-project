import { Input } from "@/app/_components/ui/input";
import type { StudentRow } from "@/app/_lib/actions/profile";
import { getUserProfile } from "@/app/_lib/actions/profile";
import { listStudentsForRecepcao } from "@/app/_lib/actions/recepcao";
import { Search } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function RecepcaoDocumentosPage() {
  const profile = await getUserProfile();

  if (!profile)
    return <div className="p-6">Sessão inválida. Faça login novamente.</div>;
  if (profile.role !== "recepção")
    return <div className="p-6">Sem acesso.</div>;

  const students = await listStudentsForRecepcao(); // TODO SUPABASE

  return (
    <div className="flex flex-col">
      <main className="p-4">
      <div className="flex flex-col gap-3 p-6">
        <h1 className="text-2xl font-bold text-slate-900">Documentos</h1>
        <p className="text-slate-600">
          A recepção pode marcar documentos como entregues/pendentes dentro do
          perfil do aluno.
        </p>
      </div>

      <section className="gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 p-2">
          <div className="border-b p-4">
            <h2 className="font-semibold text-slate-900">Escolha um aluno</h2>
            <p className="text-sm text-slate-600">
              Abra a página de documentos do aluno para atualizar status e
              observações.
            </p>
            <div className="flex flex-row mt-2">
            <Search />
            <Input type="text" placeholder="Buscar aluno" className="w-full"/>
            </div>
          </div>  
        </div>

        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2">
          {students.map((s: StudentRow) => (
            <Link
              key={s.id}
              href={`/recepcao/alunos/${s.id}/documentos`}
              className="rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
            >
              <div className="text-sm font-semibold text-slate-900">
                {s.name}
              </div>
              <div className="text-xs text-slate-600">{s.email}</div>
              <div className="mt-2 text-xs text-slate-500">
                Abrir checklist e observações de documentos.
              </div>
            </Link>
          ))}

          {!students.length ? (
            <div className="text-sm text-slate-500">
              Sem alunos cadastrados.
            </div>
          ) : null}
        </div>
      </section>
      </main>
    </div>
  );
}
