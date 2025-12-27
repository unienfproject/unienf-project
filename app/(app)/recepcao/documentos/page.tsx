import { getUserProfile } from "@/app/_lib/actions/profile";
import { listStudentsForRecepcao } from "@/app/_lib/actions/recepcao";
import type { StudentRow } from "@/app/_lib/actions/profile";
import { Bell, Search } from "lucide-react";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";

export default async function RecepcaoDocumentosPage() {
  const profile = await getUserProfile();

  if (!profile)
    return <div className="p-6">Sessão inválida. Faça login novamente.</div>;
  if (profile.role !== "recepção")
    return <div className="p-6">Sem acesso.</div>;

  const students = await listStudentsForRecepcao(); // TODO SUPABASE

  return (
    <div className="flex flex-col">
      <header className="bg-card border-border flex h-16 items-center justify-between border-b px-6">
        <div className="max-w-md flex-1">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="text"
              className="border-input ring-offset-background file:text-foreground placeholder:text-muted-foreground bg-muted/50 focus-visible:ring-primary flex h-10 w-full rounded-md border-0 px-3 py-2 pl-10 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Buscar..."
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground relative inline-flex h-10 w-10 items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
            <Bell className="h-5 w-5 text-white" />
          </Button>
          <div className="border-border flex items-center gap-3 border-l pl-4">
            <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-full">
              <span className="text-primary-foreground text-sm font-semibold">
                R
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-foreground text-sm font-medium">Recepção</p>
              <p className="text-muted-foreground text-xs">Recepção</p>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-col gap-6 p-6">
        <h1 className="text-2xl font-bold text-slate-900">Documentos</h1>
        <p className="text-slate-600">
          A recepção pode marcar documentos como entregues/pendentes dentro do
          perfil do aluno.
        </p>
      </div>

      <section className="gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="border-b p-4">
          <h2 className="font-semibold text-slate-900">Escolha um aluno</h2>
          <p className="text-sm text-slate-600">
            Abra a página de documentos do aluno para atualizar status e
            observações.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2">
          {students.map((s: StudentRow) => (
            <Link
              key={s.id}
              href={`/dashboard/alunos/${s.id}/documentos`}
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
    </div>
  );
}
