import { getUserProfile } from "@/app/_lib/actions/profile";
import { listStudentsForRecepcao } from "@/app/_lib/actions/recepcao";
import { listMensalidadesForRecepcao } from "@/app/_lib/actions/mensalidades";
import { MensalidadeRow } from "@/app/_lib/actions/finance";
import { Bell, Plus, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { listNoticesReadOnly } from "@/app/_lib/actions/recepcao";
import { NoticeRow } from "@/app/_lib/actions/recepcao";

function KpiCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-medium text-slate-600">{title}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}
function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR");
  } catch {
    return iso;
  }
}

export default async function RecepcaoHomePage() {
  const profile = await getUserProfile();

  if (!profile)
    return <div className="p-6">Sessão inválida. Faça login novamente.</div>;
  if (profile.role !== "recepção")
    return <div className="p-6">Sem acesso. Rota exclusiva da recepção.</div>;

  const notices = await listNoticesReadOnly();
  const students = await listStudentsForRecepcao();
  const mensalidades = await listMensalidadesForRecepcao();

  const totalAlunos = students.length;
  const pendentes = mensalidades.filter(
    (m: MensalidadeRow) => m.status === "pendente",
  ).length;
  const pagas = mensalidades.filter(
    (m: MensalidadeRow) => m.status === "pago",
  ).length;

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
          <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap shadow-sm transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
            <Plus className="h-5 w-5 text-white" />
            <Link href="/NewStudent">Nova Matrícula</Link>
          </Button>
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
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Recepção</h1>
          <p className="text-slate-600">
            Visão Geral <br />
            Operador: {profile.name ?? profile.email ?? "Recepção"}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
        <KpiCard title="Alunos cadastrados" value={String(totalAlunos)} />
        <KpiCard title="Mensalidades pendentes" value={String(pendentes)} />
        <KpiCard title="Mensalidades pagas" value={String(pagas)} />
      </div>

      <section className="gap-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="border-b p-4">
          <h2 className="font-semibold text-slate-900">Avisos Recentes</h2>
          <p className="text-sm text-slate-600">Últimos Avisos</p>
        </div>

        <div className="divide-y">
          {notices.map((n: NoticeRow) => (
            <div key={n.id} className="p-4">
              <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {n.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {n.author_name} • {n.author_role} •{" "}
                    {formatDate(n.created_at)}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm whitespace-pre-line text-slate-700">
                {n.message}
              </p>
            </div>
          ))}

          {!notices.length ? (
            <div className="p-6 text-center text-slate-500">
              Nenhum aviso encontrado.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
