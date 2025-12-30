import EditRoleButton from "@/app/_components/admin/EditRoleButton";
import NewUserForm from "@/app/_components/admin/NewUserForm";
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
import { listInternalUsers } from "@/app/_lib/actions/users";
import { Bell, Search } from "lucide-react";

export default async function UsuariosPage() {
  let users: Awaited<ReturnType<typeof listInternalUsers>> = [];

  try {
    users = await listInternalUsers();
  } catch {
    users = [];
  }

  return (
    <main>
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
                A
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-foreground text-sm font-medium">
                Administrador
              </p>
              <p className="text-muted-foreground text-xs">Administrador</p>
            </div>
          </div>
        </div>
      </header>
      <div className="flex-1">
        <div className="mx-auto gap-4 p-4">
          <h1 className="mb-6 text-2xl font-bold text-black">
            Cadastro de Usuários do Sistema
          </h1>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <NewUserForm />
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b p-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Usuários cadastrados
              </h2>
            </div>

            <div className="overflow-auto">
              <Table className="w-full min-w-[900px] text-sm">
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
                      Função
                    </TableHead>
                    <TableHead className="p-3 text-left font-semibold text-slate-700">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} className="border-b last:border-b-0">
                      <TableCell className="p-3 font-medium text-slate-900">
                        {u.name}
                      </TableCell>
                      <TableCell className="p-3 text-slate-700">
                        {u.email}
                      </TableCell>
                      <TableCell className="p-3 text-slate-700">
                        {u.telefone}
                      </TableCell>
                      <TableCell className="p-3 text-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="capitalize">{u.role}</span>
                        </div>
                      </TableCell>
                      <TableCell className="p-3">
                        <EditRoleButton
                          userId={u.id}
                          currentRole={u.role}
                          userName={u.name}
                        />
                      </TableCell>
                    </TableRow>
                  ))}

                  {!users.length ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="p-6 text-center text-slate-500"
                      >
                        Nenhum usuário encontrado (ou sem permissão).
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
