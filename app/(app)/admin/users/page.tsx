import EditRoleButton from "@/app/_components/admin/EditRoleButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { listInternalUsers } from "@/app/_lib/actions/users";
import UsersPageClient from "./UsersPageClient";

export default async function UsuariosPage() {
  let users: Awaited<ReturnType<typeof listInternalUsers>> = [];

  try {
    users = await listInternalUsers();
  } catch {
    users = [];
  }

  return (
    <main>
      <div className="flex-1">
        <div className="mx-auto gap-4 p-4">
          <UsersPageClient users={users} />

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
