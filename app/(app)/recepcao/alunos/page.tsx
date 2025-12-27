import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { getUserProfile } from "@/app/_lib/actions/profile";
import {
  listStudentsForRecepcao,
  createStudent,
  updateStudentProfile,
} from "@/app/_lib/actions/recepcao";
import { Bell, Plus, Search } from "lucide-react";
import Link from "next/link";

type StudentRow = {
  id: string;
  name: string;
  email: string;
  telefone?: string | null;
};

export default async function RecepcaoAlunosPage() {
  const profile = await getUserProfile();

  if (!profile)
    return <div className="p-6">Sessão inválida. Faça login novamente.</div>;
  if (profile.role !== "recepção")
    return <div className="p-6">Sem acesso.</div>;

  const students = await listStudentsForRecepcao(); // TODO SUPABASE

  async function actionUpdate(formData: FormData) {
    "use server";
    const studentId = String(formData.get("studentId") ?? "");
    const name = String(formData.get("name") ?? "").trim();
    const telefone = String(formData.get("telefone") ?? "").trim();

    if (!studentId || !name) return;

    await updateStudentProfile({
      studentId,
      name,
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

      <section className="gap-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="border-b p-4">
          <h2 className="font-semibold text-slate-900">Lista de alunos</h2>
          <p className="text-sm text-slate-600">
            Editar nome e telefone. E-mail é apenas informativo.
          </p>
        </div>

        <div className="overflow-auto">
          <Table className="w-full min-w-[1000px] text-sm">
            <TableHeader className="border-b bg-slate-50">
              <TableRow>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Nome
                </TableHead>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  E-mail
                </TableHead>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Telefone
                </TableHead>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {students.map((s: StudentRow) => (
                <TableRow key={s.id} className="border-b last:border-b-0">
                  <TableCell className="p-3">
                    <form
                      action={actionUpdate}
                      className="flex items-center gap-2"
                    >
                      <Input type="hidden" name="studentId" value={s.id} />
                      <Input
                        name="name"
                        defaultValue={s.name}
                        className="h-9 w-[320px] rounded-md border border-slate-200 px-3 text-sm"
                      />
                      <Button className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium hover:bg-slate-50">
                        Salvar
                      </Button>
                    </form>
                  </TableCell>

                  <TableCell className="p-3 text-slate-700">
                    {s.email}
                  </TableCell>

                  <TableCell className="p-3">
                    <form
                      action={actionUpdate}
                      className="flex items-center gap-2"
                    >
                      <Input type="hidden" name="studentId" value={s.id} />
                      <Input type="hidden" name="name" value={s.name} />
                      <Input
                        name="telefone"
                        defaultValue={s.telefone ?? ""}
                        className="h-9 w-[220px] rounded-md border border-slate-200 px-3 text-sm"
                      />
                      <Button className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium hover:bg-slate-50">
                        Salvar
                      </Button>
                    </form>
                  </TableCell>

                  <TableCell className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/dashboard/alunos/${s.id}`}
                        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium hover:bg-slate-50"
                      >
                        Ver perfil
                      </Link>
                      <Link
                        href={`/dashboard/alunos/${s.id}/documentos`}
                        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium hover:bg-slate-50"
                      >
                        Documentos
                      </Link>
                      <Link
                        href={`/recepcao/financeiro?studentId=${s.id}`}
                        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium hover:bg-slate-50"
                      >
                        Financeiro
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {!students.length ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="p-6 text-center text-slate-500"
                  >
                    Sem alunos cadastrados.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
