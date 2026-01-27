import { getUserProfile } from "@/app/_lib/actions/profile";
import { listStudentsForRecepcao } from "@/app/_lib/actions/recepcao";
import { listMensalidadesForRecepcao } from "@/app/_lib/actions/mensalidades";
import { MensalidadeRow } from "@/app/_lib/actions/finance";
import { listNoticesReadOnly } from "@/app/_lib/actions/recepcao";
import { NoticeRow } from "@/app/_lib/actions/recepcao";

export const dynamic = 'force-dynamic';

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
      <main className="p-3">
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
      </main>
    </div>
  );
}
