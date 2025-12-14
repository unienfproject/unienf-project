import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Bell, CircleCheckBig, CircleX, Plus, Search } from "lucide-react";
import SideBar from "../SideBar";

export default function Avisos() {
  return (
    <div>
      <SideBar />
      <div className="ml-64 flex-1">
        <header className="bg-card border-border flex h-16 items-center justify-between border-b px-6">
          <div className="max-w-md flex-1">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                type="text"
                className="border-input ring-offset-background file:text-foreground placeholder:text-muted-foreground bg-muted/50 focus-visible:ring-primary flex h-10 w-full rounded-md border-0 px-3 py-2 pl-10 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="Buscar..."
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground relative inline-flex h-10 w-10 items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
              <Bell className="text-muted-foreground h-5 w-5" />
              <span className="bg-destructive absolute top-1 right-1 h-2 w-2 rounded-full"></span>
            </Button>
            <div className="border-border flex items-center gap-3 border-l pl-4">
              <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-full">
                <span className="text-primary-foreground text-sm font-semibold">
                  A
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-foreground text-sm font-medium">
                  Administrador
                </p>
                <p className="text-muted-foreground text-xs">Administrador</p>
              </div>
            </div>
          </div>
        </header>

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
              <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap shadow-sm transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                <Plus className="mr-2 h-4 w-4" />
                Novo Aviso
              </Button>
            </div>
            <div className="space-y-4">
              <div className="bg-card border-border/50 shadow-soft hover-lift rounded-2xl border p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-foreground text-lg font-semibold">
                        Início das aulas práticas
                      </h3>
                      <span className="bg-success/10 text-success inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium">
                        <CircleCheckBig className="h-3 w-3" />
                        Enviado
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      As aulas práticas do módulo de Enfermagem Clínica terão
                      início na próxima segunda-feira.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">Para:</strong>
                        Todos os alunos
                      </span>
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">Entregue:</strong>
                        245/248
                      </span>
                      <span className="text-muted-foreground">
                        10/03/2024 às 14:30
                      </span>
                    </div>
                  </div>
                  <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                    Ver detalhes
                  </Button>
                </div>
              </div>
              <div className="bg-card border-border/50 shadow-soft hover-lift rounded-2xl border p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-foreground text-lg font-semibold">
                        Prazo de entrega de documentos
                      </h3>
                      <span className="bg-success/10 text-success inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium">
                        <CircleCheckBig className="h-3 w-3" />
                        Enviado
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Lembramos que o prazo para entrega de documentos pendentes
                      encerra dia 15/03.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">Para:</strong>
                        Técnico 2024.1
                      </span>
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">Entregue:</strong>
                        52/52
                      </span>
                      <span className="text-muted-foreground">
                        08/03/2024 às 09:00
                      </span>
                    </div>
                  </div>
                  <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                    Ver detalhes
                  </Button>
                </div>
              </div>
              <div className="bg-card border-border/50 shadow-soft hover-lift rounded-2xl border p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-foreground text-lg font-semibold">
                        Semana de provas
                      </h3>
                      <span className="bg-destructive/10 text-destructive inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium">
                        <CircleX className="h-3 w-3" />
                        Falhou
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      A semana de provas do primeiro bimestre será realizada de
                      20 a 24 de março.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">Para:</strong>
                        Selecionados (35)
                      </span>
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">Entregue:</strong>
                        30/35
                      </span>
                      <span className="text-muted-foreground">
                        05/03/2024 às 16:45
                      </span>
                    </div>
                  </div>
                  <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                    Ver detalhes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
