import UsersPageClient from "@/app/_components/admin/UsersPageClient";
import UsersTableClient from "@/app/_components/admin/UsersTableClient";

export default async function UsuariosPage() {
  return (
    <main>
      <div className="flex-1">
        <div className="mx-auto gap-4 p-4">
          <UsersPageClient />

          <UsersTableClient />
        </div>
      </div>
    </main>
  );
}
