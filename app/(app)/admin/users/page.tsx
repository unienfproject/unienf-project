import { listInternalUsers } from "@/app/_lib/actions/users";
import UsersPageClient from "@/app/_components/admin/UsersPageClient";
import UsersTableClient from "@/app/_components/admin/UsersTableClient";

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

          <UsersTableClient />
        </div>
      </div>
    </main>
  );
}
