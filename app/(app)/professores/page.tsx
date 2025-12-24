import StatCard from "@/app/_components/StatCard";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Calendar,
  ClipboardList,
  Search,
  Users,
} from "lucide-react";
import NewUser from "@/app/(app)/admin/users/page";

export default function Overall() {
  return (
    <div className="flex-1">
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
          <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground relative inline-flex h-10 w-10 cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
            <Bell className="text-muted-foreground h-5 w-5" />
            <span className="bg-destructive absolute top-1 right-1 h-2 w-2 rounded-full"></span>
          </Button>
          <div className="border-border flex items-center gap-3 border-l pl-4">
            <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-full">
              <span className="text-primary-foreground text-sm font-semibold">
                P
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-foreground text-sm font-medium">
                Prof. Ana Costa
              </p>
              <p className="text-muted-foreground text-xs">Professor</p>
            </div>
          </div>
        </div>
      </header>
      <main className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-foreground text-2xl font-bold">
              Olá, Professora Ana!
            </h1>
            <p className="text-muted-foreground">
              Confira suas turmas e atividades do dia
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatCard
              label="Minhas Turmas"
              value={3}
              icon={BookOpen}
              variant="default"
            />
            <StatCard
              label="Total de Alunos"
              value={85}
              icon={Users}
              variant="muted"
            />
            <StatCard
              label="Notas Pendentes"
              value={2}
              icon={ClipboardList}
              variant="warning"
            />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6 lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-foreground text-lg font-semibold">
                  Minhas Turmas
                </h3>
                <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                  Ver todas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="bg-muted/30 hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-xl p-4 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
                      <BookOpen className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">
                        Técnico 2024.1 - Anatomia
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Seg/Qua 19h-21h
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground text-lg font-semibold">32</p>
                    <p className="text-muted-foreground text-xs">alunos</p>
                  </div>
                </div>
                <div className="bg-muted/30 hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-xl p-4 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
                      <BookOpen className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">
                        Técnico 2024.1 - Farmacologia
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Ter/Qui 19h-21h
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground text-lg font-semibold">28</p>
                    <p className="text-muted-foreground text-xs">alunos</p>
                  </div>
                </div>
                <div className="bg-muted/30 hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-xl p-4 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
                      <BookOpen className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">
                        Auxiliar 2024.1 - Biossegurança
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Sex 14h-18h
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground text-lg font-semibold">25</p>
                    <p className="text-muted-foreground text-xs">alunos</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
              <h3 className="text-foreground mb-4 flex items-center gap-2 text-lg font-semibold">
                <Calendar className="text-primary h-5 w-5" />
                Próximas Aulas
              </h3>
              <div className="space-y-4">
                <div className="bg-primary/5 border-primary/10 rounded-xl border p-4">
                  <p className="text-foreground mb-1 font-medium">
                    Técnico 2024.1 - Anatomia
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary font-medium">Hoje</span>
                    <span className="text-muted-foreground">19h-21h</span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm">Sala 101</p>
                </div>
                <div className="bg-primary/5 border-primary/10 rounded-xl border p-4">
                  <p className="text-foreground mb-1 font-medium">
                    Técnico 2024.1 - Farmacologia
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary font-medium">Amanhã</span>
                    <span className="text-muted-foreground">19h-21h</span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm">Sala 203</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
            <h3 className="text-foreground mb-4 text-lg font-semibold">
              Pendências
            </h3>
            <div className="space-y-3">
              <div className="bg-warning/5 border-warning/20 flex items-center justify-between rounded-xl border p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-warning/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <ClipboardList className="text-warning h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">
                      Lançar notas da Prova 1 - Anatomia
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Prazo: 15/03/2024
                    </p>
                  </div>
                </div>
                <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-sm font-medium whitespace-nowrap shadow-sm transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                  Resolver
                </Button>
              </div>
              <div className="bg-warning/5 border-warning/20 flex items-center justify-between rounded-xl border p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-warning/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <ClipboardList className="text-warning h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">
                      Registrar frequência da aula de sexta
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Prazo: 11/03/2024
                    </p>
                  </div>
                </div>
                <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-sm font-medium whitespace-nowrap shadow-sm transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                  Resolver
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

  );
}
