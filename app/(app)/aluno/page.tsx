import StatCard from "@/app/_components/StatCard";
import { Button } from "@/app/_components/ui/button";
import {
  ArrowRight,
  Award,
  BookOpen,
  CircleCheckBig,
  Clock,
  FileText,
  TriangleAlert,
} from "lucide-react";

export default function Overall() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <main className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-foreground text-2xl font-bold">Olá, Maria!</h1>
            <p className="text-muted-foreground">
              Acompanhe seu progresso e atividades
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatCard
              label="Minha Turma"
              value="Técnico 2024.1"
              icon={BookOpen}
              variant="default"
            />
            <StatCard
              label="Média Geral"
              value="8.3"
              icon={Award}
              variant="success"
            />
            <StatCard
              label="Documentos Pendentes"
              value={2}
              icon={FileText}
              variant="warning"
            />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6 lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-foreground text-lg font-semibold">
                  Últimas Notas
                </h3>
                <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                  Ver todas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="bg-muted/30 flex items-center justify-between rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-success/10 flex h-12 w-12 items-center justify-center rounded-xl">
                      <span className="text-success text-lg font-bold">
                        8.5
                      </span>
                    </div>
                    <div>
                      <p className="text-foreground font-medium">
                        Anatomia Humana
                      </p>
                      <p className="text-muted-foreground text-sm">Prova 1</p>
                    </div>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    10/03/2024
                  </span>
                </div>
                <div className="bg-muted/30 flex items-center justify-between rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-success/10 flex h-12 w-12 items-center justify-center rounded-xl">
                      <span className="text-success text-lg font-bold">9</span>
                    </div>
                    <div>
                      <p className="text-foreground font-medium">
                        Farmacologia
                      </p>
                      <p className="text-muted-foreground text-sm">Trabalho</p>
                    </div>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    08/03/2024
                  </span>
                </div>
                <div className="bg-muted/30 flex items-center justify-between rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-success/10 flex h-12 w-12 items-center justify-center rounded-xl">
                      <span className="text-success text-lg font-bold">
                        7.5
                      </span>
                    </div>
                    <div>
                      <p className="text-foreground font-medium">
                        Enfermagem Clínica
                      </p>
                      <p className="text-muted-foreground text-sm">Prova 1</p>
                    </div>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    05/03/2024
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
                <h3 className="text-foreground mb-4 text-lg font-semibold">
                  Meus Documentos
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CircleCheckBig className="text-success h-5 w-5" />
                      <span className="text-foreground text-sm">Entregues</span>
                    </div>
                    <span className="text-foreground font-semibold">4</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="text-warning h-5 w-5" />
                      <span className="text-foreground text-sm">Pendentes</span>
                    </div>
                    <span className="text-foreground font-semibold">2</span>
                  </div>
                  <div className="bg-muted mt-2 h-2 w-full rounded-full">
                    <div className="bg-primary h-2 rounded-full transition-all duration-500"></div>
                  </div>
                  <p className="text-muted-foreground text-center text-xs">
                    67% completo
                  </p>
                </div>
                <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-input bg-background hover:bg-accent hover:text-accent-foreground mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                  Ver Documentos
                </Button>
              </div>
              <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
                <h3 className="text-foreground mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Bell className="text-primary h-5 w-5" />
                  Avisos Recentes
                </h3>
                <div className="space-y-3">
                  <div className="bg-primary/5 border-primary/10 rounded-lg border p-3">
                    <p className="text-foreground text-sm font-medium">
                      Início das aulas práticas
                    </p>
                    <p className="text-muted-foreground text-xs">10/03/2024</p>
                  </div>
                  <div className="bg-primary/5 border-primary/10 rounded-lg border p-3">
                    <p className="text-foreground text-sm font-medium">
                      Prazo de entrega de documentos
                    </p>
                    <p className="text-muted-foreground text-xs">08/03/2024</p>
                  </div>
                </div>
                <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                  Ver Todos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="bg-warning/5 border-warning/20 flex items-center gap-4 rounded-2xl border p-6">
            <div className="bg-warning/10 flex h-12 w-12 items-center justify-center rounded-xl">
              <TriangleAlert className="text-warning h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-foreground font-medium">
                Você possui documentos pendentes
              </p>
              <p className="text-muted-foreground text-sm">
                Regularize sua situação acadêmica entregando os documentos
                necessários.
              </p>
            </div>
            <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap shadow-sm transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
              Entregar Documentos
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
