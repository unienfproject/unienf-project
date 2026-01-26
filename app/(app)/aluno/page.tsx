import Link from "next/link";
import StatCard from "@/app/_components/StatCard";
import { Button } from "@/app/_components/ui/button";
import { ArrowRight, Award, Bell, BookOpen, CircleCheckBig, Clock, FileText } from "lucide-react";

import { getAlunoOverviewDashboard } from "@/app/_lib/actions/alunos";

export const dynamic = 'force-dynamic';

function formatBR(iso: string) {
  const d = iso?.slice(0, 10);
  if (!d) return "-";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

export default async function OverallAlunoPage() {
  const ov = await getAlunoOverviewDashboard();

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <main className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-foreground text-2xl font-bold">Olá, {ov.alunoName}!</h1>
            <p className="text-muted-foreground">Acompanhe seu progresso e atividades</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatCard label="Minha Turma" value={ov.turmaAtualLabel ?? "-"} icon={BookOpen} variant="default" />
            <StatCard
              label="Média Geral"
              value={ov.mediaGeral == null ? "-" : ov.mediaGeral.toFixed(1)}
              icon={Award}
              variant={ov.mediaGeral != null && ov.mediaGeral >= 7 ? "success" : "muted"}
            />
            <StatCard
              label="Documentos Pendentes"
              value={ov.documentos.pendentes}
              icon={FileText}
              variant={ov.documentos.pendentes > 0 ? "warning" : "success"}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6 lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-foreground text-lg font-semibold">Últimas Notas</h3>
                <Button asChild className="hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium">
                  <Link href="/aluno/notas">
                    Ver todas <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-4">
                {ov.ultimasNotas.length === 0 ? (
                  <div className="bg-muted/30 rounded-xl p-4 text-sm text-muted-foreground">
                    Nenhuma nota lançada ainda.
                  </div>
                ) : (
                  ov.ultimasNotas.map((n) => (
                    <div key={n.id} className="bg-muted/30 flex items-center justify-between rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-success/10 flex h-12 w-12 items-center justify-center rounded-xl">
                          <span className="text-success text-lg font-bold">{n.value.toFixed(1).replace(".0", "")}</span>
                        </div>
                        <div>
                          <p className="text-foreground font-medium">{n.turmaLabel}</p>
                          <p className="text-muted-foreground text-sm">{n.avaliacaoLabel}</p>
                        </div>
                      </div>
                      <span className="text-muted-foreground text-sm">{formatBR(n.launchedAt)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
                <h3 className="text-foreground mb-4 text-lg font-semibold">Meus Documentos</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CircleCheckBig className="text-success h-5 w-5" />
                      <span className="text-foreground text-sm">Entregues</span>
                    </div>
                    <span className="text-foreground font-semibold">{ov.documentos.entregues}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="text-warning h-5 w-5" />
                      <span className="text-foreground text-sm">Pendentes</span>
                    </div>
                    <span className="text-foreground font-semibold">{ov.documentos.pendentes}</span>
                  </div>

                  <div className="bg-muted mt-2 h-2 w-full rounded-full">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${ov.documentos.pct}%` }} />
                  </div>

                  <p className="text-muted-foreground text-center text-xs">{ov.documentos.pct}% completo</p>
                </div>

                <Button asChild className="border-input bg-primary hover:bg-accent hover:text-accent-foreground mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium">
                  <Link href="/aluno/documentos">Ver Documentos</Link>
                </Button>
              </div>

              <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
                <h3 className="text-foreground mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Bell className="text-primary h-5 w-5" />
                  Avisos Recentes
                </h3>

                <div className="space-y-3">
                  {ov.avisosRecentes.length === 0 ? (
                    <div className="rounded-lg border p-3 text-sm text-muted-foreground">
                      Nenhum aviso recente.
                    </div>
                  ) : (
                    ov.avisosRecentes.map((a) => (
                      <div key={a.id} className="bg-primary/5 border-primary/10 rounded-lg border p-3">
                        <p className="text-foreground text-sm font-medium">{a.title}</p>
                        <p className="text-muted-foreground text-xs">{formatBR(a.createdAt)}</p>
                      </div>
                    ))
                  )}
                </div>

                <Button asChild className="hover:bg-accent hover:text-accent-foreground mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium">
                  <Link href="/aluno/avisos">
                    Ver Todos <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Removido o bloco final de “documentos pendentes” conforme solicitado */}
        </div>
      </main>
    </div>
  );
}
