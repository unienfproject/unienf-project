import { listMyAvisosForAluno } from "@/app/_lib/actions/avisos";
import { getUserProfile } from "@/app/_lib/actions/profile";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("pt-BR");
}

export default async function Avisos() {
  const profile = await getUserProfile();

  if (!profile) {
    return <div>Sessao invalida. Faca login novamente.</div>;
  }

  if (profile.role !== "aluno") {
    return <div>Sem acesso.</div>;
  }

  const avisos = await listMyAvisosForAluno();

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col">
        <div className="space-y-6">
          <div>
            <h1 className="text-foreground text-[22px] font-bold">Avisos</h1>
            <p className="text-muted-foreground">
              Comunicados enviados para voce ou para suas turmas.
            </p>
          </div>

          <section className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
            <div className="mb-6">
              <h2 className="text-foreground text-[17px] font-semibold">
                Historico de avisos
              </h2>
            </div>

            <div className="space-y-4">
              {avisos.map((aviso) => (
                <article
                  key={aviso.id}
                  className="bg-muted/30 rounded-xl p-4"
                >
                  <div className="flex flex-col gap-1">
                    <h3 className="text-foreground text-base font-semibold">
                      {aviso.title}
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      {aviso.authorName || "Desconhecido"}
                      {aviso.authorRole ? ` • ${aviso.authorRole}` : ""}
                      {aviso.turmaName ? ` • ${aviso.turmaName}` : ""}
                      {` • ${formatDate(aviso.createdAt)}`}
                    </p>
                  </div>
                  <p className="text-foreground/80 mt-3 whitespace-pre-line text-sm leading-6">
                    {aviso.message}
                  </p>
                </article>
              ))}

              {!avisos.length ? (
                <div className="bg-muted/30 text-muted-foreground rounded-xl p-6 text-center text-sm">
                  Nenhum aviso encontrado.
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
