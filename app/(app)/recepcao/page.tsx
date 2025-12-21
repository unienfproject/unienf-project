import { getUserProfile } from "@/app/_lib/actions/profile";
import {
  listStudentsForRecepcao,
  createStudent,
} from "@/app/_lib/actions/recepcao";
import { listMensalidadesForRecepcao } from "@/app/_lib/actions/mensalidades";
import { MensalidadeRow } from "@/app/_lib/actions/finance";
import { Bell, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { Label } from "@/app/_components/ui/label";

function KpiCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-medium text-slate-600">{title}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

export default async function RecepcaoHomePage() {
  const profile = await getUserProfile();

  if (!profile)
    return <div className="p-6">Sessão inválida. Faça login novamente.</div>;
  if (profile.role !== "recepção")
    return <div className="p-6">Sem acesso. Rota exclusiva da recepção.</div>;

  // TODO SUPABASE (actions): buscar alunos
  const students = await listStudentsForRecepcao();

  // TODO SUPABASE (finance.ts): buscar mensalidades
  const mensalidades = await listMensalidadesForRecepcao();

  const totalAlunos = students.length;
  const pendentes = mensalidades.filter(
    (m: MensalidadeRow) => m.status === "pendente",
  ).length;
  const pagas = mensalidades.filter(
    (m: MensalidadeRow) => m.status === "pago",
  ).length;

  async function actionCreateStudent(formData: FormData) {
    "use server";
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const telefone = String(formData.get("telefone") ?? "").trim();

    if (!name || !email || !email.includes("@")) return;

    // TODO SUPABASE: esta action deve criar o aluno conforme seu fluxo (perfil e possivelmente auth)
    await createStudent({
      name,
      email,
      telefone: telefone ? telefone : null,
    });
  }

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
            <Bell className="text-muted-foreground h-5 w-5" />
            <span className="bg-destructive absolute top-1 right-1 h-2 w-2 rounded-full"></span>
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
            Visão geral e atalhos. Operador:{" "}
            {profile.name ?? profile.email ?? "Recepção"}.
          </p>
        </div>

        <Link
          href="/recepcao/alunos"
          className="flex h-10 w-fit items-center rounded-md bg-sky-500 px-4 text-sm font-medium text-white hover:bg-sky-600"
        >
          Ir para Alunos
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-4">
        <KpiCard title="Alunos cadastrados" value={String(totalAlunos)} />
        <KpiCard title="Mensalidades pendentes" value={String(pendentes)} />
        <KpiCard title="Mensalidades pagas" value={String(pagas)} />
        <KpiCard title="Atalhos" value="Alunos, Docs, Financeiro, Avisos" />
      </div>

      <section className="gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="border-b p-4">
          <h2 className="font-semibold text-slate-900">Novo aluno</h2>
          <p className="text-sm text-slate-600">
            Cadastro rápido. O fluxo de criação de login depende da sua action.
          </p>
        </div>

        <form action={actionCreateStudent} className="p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-1">
              <Label className="text-sm font-medium text-slate-700">
                Nome completo
              </Label>
              <Input
                name="name"
                className="h-10 rounded-md border border-slate-200 px-3 text-sm"
                placeholder="Ex.: Maria Silva"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-sm font-medium text-slate-700">
                E-mail
              </Label>
              <Input
                name="email"
                className="h-10 rounded-md border border-slate-200 px-3 text-sm"
                placeholder="Ex.: maria@exemplo.com"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-sm font-medium text-slate-700">
                Telefone (opcional)
              </Label>
              <Input
                name="telefone"
                className="h-10 rounded-md border border-slate-200 px-3 text-sm"
                placeholder="Ex.: (22) 99999-9999"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end">
            <Button
              type="submit"
              className="h-10 rounded-md bg-sky-500 px-4 text-sm font-medium text-white hover:bg-sky-600"
            >
              Cadastrar
            </Button>
          </div>

          <div className="mt-3 text-xs text-slate-500">
            Observação: se sua action criar usuário no Auth, normalmente exige
            service role ou fluxo de convite.
          </div>
        </form>
      </section>

      <section className="grid grid-cols-1 gap-6 p-6 md:grid-cols-4">
        <Link
          href="/recepcao/alunos"
          className="rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
        >
          <div className="font-semibold text-slate-900">Alunos</div>
          <div className="mt-1 text-sm text-slate-600">
            Listar, editar e acessar perfil
          </div>
        </Link>
        <Link
          href="/recepcao/documentos"
          className="rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
        >
          <div className="font-semibold text-slate-900">Documentos</div>
          <div className="mt-1 text-sm text-slate-600">Checklist por aluno</div>
        </Link>
        <Link
          href="/recepcao/financeiro"
          className="rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
        >
          <div className="font-semibold text-slate-900">Financeiro</div>
          <div className="mt-1 text-sm text-slate-600">
            Pendentes, pagos, recibo
          </div>
        </Link>
        <Link
          href="/recepcao/avisos"
          className="rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
        >
          <div className="font-semibold text-slate-900">Avisos</div>
          <div className="mt-1 text-sm text-slate-600">Somente leitura</div>
        </Link>
      </section>
    </div>
  );
}
