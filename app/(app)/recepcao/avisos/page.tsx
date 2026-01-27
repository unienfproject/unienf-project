import { getUserProfile } from "@/app/_lib/actions/profile";
import { listNoticesReadOnly } from "@/app/_lib/actions/recepcao";
import { NoticeRow } from "@/app/_lib/actions/recepcao";

export const dynamic = 'force-dynamic';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR");
  } catch {
    return iso;
  }
}

export default async function RecepcaoAvisosPage() {
  const profile = await getUserProfile();

  if (!profile)
    return <div className="p-6">Sessão inválida. Faça login novamente.</div>;
  if (profile.role !== "recepção")
    return <div className="p-6">Sem acesso.</div>;

  const notices = await listNoticesReadOnly(); // TODO SUPABASE

  return (
    <div className="flex flex-col">
      <main className="p-4">
      <div className="flex flex-col gap-3 p-6">
        <h1 className="text-3xl font-bold text-slate-900">Avisos</h1>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b p-4">
          <h2 className="font-semibold text-slate-900">Feed de avisos</h2>
          <p className="text-sm text-slate-600">
            Professor, coordenação e administrativo podem publicar avisos.
          </p>
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
      </main>
    </div>
  );
}
