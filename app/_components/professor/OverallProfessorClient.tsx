"use client";

import StatCard from "@/app/_components/StatCard";
import { Button } from "@/app/_components/ui/button";
import { ArrowRight, BookOpen, Users } from "lucide-react";

type TurmaResumo = {
  id: string;
  titulo: string;
  horario: string | null;
  totalAlunos: number;
};

export default function OverallProfessorClient(props: {
  professorName: string;
  stats: {
    minhasTurmas: number;
    totalAlunos: number;
  };
  turmas: TurmaResumo[];
}) {
  const { professorName, stats, turmas } = props;

  return (
    <div className="flex-1">
      <main className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-foreground text-2xl font-bold">
              Olá, {professorName}!
            </h1>
            <p className="text-muted-foreground">
              Confira suas turmas e atividades
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <StatCard
              label="Minhas Turmas"
              value={stats.minhasTurmas}
              icon={BookOpen}
              variant="default"
            />
            <StatCard
              label="Total de Alunos"
              value={stats.totalAlunos}
              icon={Users}
              variant="muted"
            />
          </div>

          <div className="flex flex-col gap-6 lg:flex-col">
            <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6 lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-foreground text-lg font-semibold">
                  Minhas Turmas
                </h3>
                <Button
                  className="hover:bg-accent hover:text-accent-foreground inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-sm font-medium"
                  onClick={() => (window.location.href = "/professor/turmas")}
                >
                  Ver todas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {!turmas.length ? (
                  <div className="text-muted-foreground rounded-xl bg-muted/30 p-4 text-sm">
                    Nenhuma turma vinculada ao seu perfil.
                  </div>
                ) : (
                  turmas.map((t) => (
                    <div
                      key={t.id}
                      className="bg-muted/30 hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-xl p-4 transition-colors"
                      onClick={() =>
                        (window.location.href = `/professor/turmas/${t.id}`)
                      }
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
                          <BookOpen className="text-primary h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-foreground font-medium">
                            {t.titulo}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {t.horario ?? "-"}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-foreground text-lg font-semibold">
                          {t.totalAlunos}
                        </p>
                        <p className="text-muted-foreground text-xs">alunos</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex flex-col bg-card border-border/50 shadow-soft rounded-2xl border p-6">
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Pendências
              </h3>
              <div className="text-muted-foreground rounded-xl bg-muted/30 p-4 text-sm">
                Sem pendências configuradas no momento.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
