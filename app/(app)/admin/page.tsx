import ActivityItem from "@/app/_components/aluno/ActivityItem";
import StatCard from "@/app/_components/StatCard";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import {
  Bell,
  Calendar,
  FileText,
  FolderOpen,
  Plus,
  Search,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function Overall() {
  return (
    <main className="flex-1">
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
          <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap shadow-sm transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
            <Plus className="h-5 w-5 text-white" />
            <Link href="/NewStudent">Nova Matrícula</Link>
          </Button>
          <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground relative inline-flex h-10 w-10 items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
            <Bell className="h-5 w-5 text-white" />
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
          <div>
            <h1 className="text-foreground text-2xl font-bold">Visão Geral</h1>
            <p className="text-muted-foreground">
              Acompanhe as principais métricas da instituição
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total de Alunos"
              value={248}
              icon={Users}
              variant="default"
              trend="+12% este mês"
            />
            <StatCard
              label="Turmas Ativas"
              value={8}
              icon={FolderOpen}
              variant="success"
            />
            <StatCard
              label="Professores"
              value={15}
              icon={UserCheck}
              variant="muted"
            />
            <StatCard
              label="Documentos Pendentes"
              value={23}
              icon={FileText}
              variant="warning"
            />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6 lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-foreground text-lg font-semibold">
                    Matrículas por Mês
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Últimos 6 meses
                  </p>
                </div>
                <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                  <Calendar className="mr-2 h-4 w-4" />
                  Período
                </Button>
              </div>
              <div className="bg-muted/30 flex h-64 items-center justify-center rounded-xl">
                <div className="text-center">
                  <TrendingUp className="text-primary mx-auto mb-3 h-12 w-12" />
                  <p className="text-muted-foreground">Gráfico de Matrículas</p>
                </div>
              </div>
            </div>
            <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Atividades Recentes
              </h3>
              <div className="space-y-4">
                <ActivityItem
                  title="Novo aluno matriculado"
                  description="Maria Silva"
                  time="Há 2 horas"
                  variant="primary"
                />
                <ActivityItem
                  title="Documentos aprovados"
                  description="João Santos"
                  time="Há 3 horas"
                  variant="primary"
                />
                <ActivityItem
                  title="Nota lançada"
                  description="Prof. Ana Costa"
                  time="Há 5 horas"
                  variant="primary"
                />
                <ActivityItem
                  title="Nova turma criada"
                  description="Turma 2024.1"
                  time="Há 1 dia"
                  variant="primary"
                />
              </div>
            </div>
          </div>
          <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-foreground text-lg font-semibold">
                  Documentos Pendentes
                </h3>
                <p className="text-muted-foreground text-sm">
                  Documentos que precisam de atenção
                </p>
              </div>
              <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                Ver todos
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-border border-b">
                    <TableHead className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                      Aluno
                    </TableHead>
                    <TableHead className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                      Documento
                    </TableHead>
                    <TableHead className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                      Status
                    </TableHead>
                    <TableHead className="text-muted-foreground px-4 py-3 text-right text-sm font-medium">
                      Ação
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-border/50 table-row-alternate border-b last:border-0">
                    <TableCell className="text-foreground px-4 py-3 text-sm">
                      Carlos Oliveira
                    </TableCell>
                    <TableCell className="text-foreground px-4 py-3 text-sm">
                      RG
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="bg-warning/10 text-warning inline-flex rounded-full px-2 py-1 text-xs font-medium">
                        Pendente
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                        Revisar
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-border/50 table-row-alternate border-b last:border-0">
                    <TableCell className="text-foreground px-4 py-3 text-sm">
                      Fernanda Lima
                    </TableCell>
                    <TableCell className="text-foreground px-4 py-3 text-sm">
                      Histórico Escolar
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="bg-warning/10 text-warning inline-flex rounded-full px-2 py-1 text-xs font-medium">
                        Pendente
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                        Revisar
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-border/50 table-row-alternate border-b last:border-0">
                    <TableCell className="text-foreground px-4 py-3 text-sm">
                      Ricardo Souza
                    </TableCell>
                    <TableCell className="text-foreground px-4 py-3 text-sm">
                      Comprovante de Residência
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="bg-destructive/10 text-destructive inline-flex rounded-full px-2 py-1 text-xs font-medium">
                        Rejeitado
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                        Revisar
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
    </main>
  );
}
