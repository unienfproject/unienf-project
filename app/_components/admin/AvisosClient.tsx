// cspell:ignore avisos, falhou enviado comunicados envie alunos professores nenhum encontrado entregue detalhes informado mensagem titulo
"use client";

import CreateAvisoDialog from "@/app/_components/admin/CreateAvisoDialog";
import { Button } from "@/app/_components/ui/button";
import { CircleCheckBig, CircleX, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import type { AvisoListRow } from "@/app/_lib/actions/avisos";
import { useRouter } from "next/navigation";

function formatDateTimeBR(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusPill({ status }: { status: AvisoListRow["status"] }) {
  if (status === "falhou") {
    return (
      <span className="bg-destructive/10 text-destructive inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium">
        <CircleX className="h-3 w-3" />
        Falhou
      </span>
    );
  }

  // default: enviado
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#4fc172]/10 px-2 py-1 text-xs font-medium text-[#4fc172]">
      <CircleCheckBig className="h-3 w-3" />
      Enviado
    </span>
  );
}

export default function AvisosClient({
  initialAvisos,
}: {
  initialAvisos: AvisoListRow[];
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  const avisos = useMemo(() => initialAvisos ?? [], [initialAvisos]);

  return (
    <main>
      <CreateAvisoDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <main className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-foreground text-2xl font-bold">
                Avisos e Comunicados
              </h1>
              <p className="text-muted-foreground">
                Envie comunicados para alunos e professores
              </p>
            </div>

            <Button
              onClick={() => setDialogOpen(true)}
              className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap shadow-sm transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              <Plus />
              Novo Aviso
            </Button>
          </div>

          <div className="space-y-4">
            {avisos.length === 0 ? (
              <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
                <p className="text-muted-foreground">
                  Nenhum aviso encontrado.
                </p>
              </div>
            ) : (
              avisos.map((a) => (
                <div
                  key={a.id}
                  className="bg-card border-border/50 shadow-soft hover-lift rounded-2xl border p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="text-foreground text-lg font-semibold">
                          {a.titulo}
                        </h3>
                        <StatusPill status={a.status} />
                      </div>

                      <p className="text-muted-foreground mb-4">{a.mensagem}</p>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          <strong className="text-foreground">Para:</strong>{" "}
                          {a.targetLabel ?? "Não informado"}
                        </span>

                        <span className="text-muted-foreground">
                          <strong className="text-foreground">Entregue:</strong>{" "}
                          {a.deliveredCount}/{a.totalTargets}
                        </span>

                        <span className="text-muted-foreground">
                          {formatDateTimeBR(a.createdAt)}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => router.push(`/admin/avisos/${a.id}`)}
                      className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                    >
                      Ver detalhes
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </main>
  );
}
