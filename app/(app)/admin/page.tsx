import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import SideBar from "@/app/(app)/admin/SideBar";

export default function Overall() {
  return (
    <main>
      <SideBar />
      <div className="ml-64 flex-1">
        <header className="bg-card border-border flex h-16 items-center justify-between border-b px-6">
          <div className="max-w-md flex-1">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-search text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              <Input
                type="text"
                className="border-input ring-offset-background file:text-foreground placeholder:text-muted-foreground bg-muted/50 focus-visible:ring-primary flex h-10 w-full rounded-md border-0 px-3 py-2 pl-10 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="Buscar..."
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground relative inline-flex h-10 w-10 items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-bell text-muted-foreground h-5 w-5"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
              </svg>
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
            <div>
              <h1 className="text-foreground text-2xl font-bold">
                Visão Geral
              </h1>
              <p className="text-muted-foreground">
                Acompanhe as principais métricas da instituição
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="shadow-soft hover-lift bg-primary/5 border-primary/20 rounded-2xl border p-6 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Total de Alunos
                    </p>
                    <p className="text-foreground text-3xl font-bold">248</p>
                    <p className="text-success mt-2 text-sm font-medium">
                      +12% este mês
                    </p>
                  </div>
                  <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-users h-6 w-6"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="shadow-soft hover-lift bg-success/5 border-success/20 rounded-2xl border p-6 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Turmas Ativas
                    </p>
                    <p className="text-foreground text-3xl font-bold">8</p>
                  </div>
                  <div className="bg-success/10 text-success flex h-12 w-12 items-center justify-center rounded-xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-folder-open h-6 w-6"
                    >
                      <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="border-border/50 shadow-soft hover-lift bg-card rounded-2xl border p-6 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Professores
                    </p>
                    <p className="text-foreground text-3xl font-bold">15</p>
                  </div>
                  <div className="bg-muted text-muted-foreground flex h-12 w-12 items-center justify-center rounded-xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-user-check h-6 w-6"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <polyline points="16 11 18 13 22 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="shadow-soft hover-lift bg-warning/5 border-warning/20 rounded-2xl border p-6 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Documentos Pendentes
                    </p>
                    <p className="text-foreground text-3xl font-bold">23</p>
                  </div>
                  <div className="bg-warning/10 text-warning flex h-12 w-12 items-center justify-center rounded-xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-file-text h-6 w-6"
                    >
                      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                      <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                      <path d="M10 9H8"></path>
                      <path d="M16 13H8"></path>
                      <path d="M16 17H8"></path>
                    </svg>
                  </div>
                </div>
              </div>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-calendar mr-2 h-4 w-4"
                    >
                      <path d="M8 2v4"></path>
                      <path d="M16 2v4"></path>
                      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                      <path d="M3 10h18"></path>
                    </svg>
                    Período
                  </Button>
                </div>
                <div className="bg-muted/30 flex h-64 items-center justify-center rounded-xl">
                  <div className="text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-trending-up text-primary mx-auto mb-3 h-12 w-12"
                    >
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                      <polyline points="16 7 22 7 22 13"></polyline>
                    </svg>
                    <p className="text-muted-foreground">
                      Gráfico de Matrículas
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
                <h3 className="text-foreground mb-4 text-lg font-semibold">
                  Atividades Recentes
                </h3>
                <div className="space-y-4">
                  <div className="border-border/50 flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0">
                    <div className="bg-primary mt-2 h-2 w-2 rounded-full"></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground text-sm font-medium">
                        Novo aluno matriculado
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Maria Silva
                      </p>
                    </div>
                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                      Há 2 horas
                    </span>
                  </div>
                  <div className="border-border/50 flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0">
                    <div className="bg-primary mt-2 h-2 w-2 rounded-full"></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground text-sm font-medium">
                        Documentos aprovados
                      </p>
                      <p className="text-muted-foreground text-sm">
                        João Santos
                      </p>
                    </div>
                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                      Há 3 horas
                    </span>
                  </div>
                  <div className="border-border/50 flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0">
                    <div className="bg-primary mt-2 h-2 w-2 rounded-full"></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground text-sm font-medium">
                        Nota lançada
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Prof. Ana Costa
                      </p>
                    </div>
                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                      Há 5 horas
                    </span>
                  </div>
                  <div className="border-border/50 flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0">
                    <div className="bg-primary mt-2 h-2 w-2 rounded-full"></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground text-sm font-medium">
                        Nova turma criada
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Turma 2024.1
                      </p>
                    </div>
                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                      Há 1 dia
                    </span>
                  </div>
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
                <table className="w-full">
                  <thead>
                    <tr className="border-border border-b">
                      <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                        Aluno
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                        Documento
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                        Status
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-right text-sm font-medium">
                        Ação
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-border/50 table-row-alternate border-b last:border-0">
                      <td className="text-foreground px-4 py-3 text-sm">
                        Carlos Oliveira
                      </td>
                      <td className="text-foreground px-4 py-3 text-sm">RG</td>
                      <td className="px-4 py-3">
                        <span className="bg-warning/10 text-warning inline-flex rounded-full px-2 py-1 text-xs font-medium">
                          Pendente
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                          Revisar
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-border/50 table-row-alternate border-b last:border-0">
                      <td className="text-foreground px-4 py-3 text-sm">
                        Fernanda Lima
                      </td>
                      <td className="text-foreground px-4 py-3 text-sm">
                        Histórico Escolar
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-warning/10 text-warning inline-flex rounded-full px-2 py-1 text-xs font-medium">
                          Pendente
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                          Revisar
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-border/50 table-row-alternate border-b last:border-0">
                      <td className="text-foreground px-4 py-3 text-sm">
                        Ricardo Souza
                      </td>
                      <td className="text-foreground px-4 py-3 text-sm">
                        Comprovante de Residência
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-destructive/10 text-destructive inline-flex rounded-full px-2 py-1 text-xs font-medium">
                          Rejeitado
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                          Revisar
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
}
