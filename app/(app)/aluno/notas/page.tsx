import { Button } from "@/app/_components/ui/button";
import SideBar from "../Sidebar";
import { Input } from "@/app/_components/ui/input";

export default function Notas() {
  return (
    <div>
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
                  M
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-foreground text-sm font-medium">
                  Maria Silva
                </p>
                <p className="text-muted-foreground text-xs">Aluno</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-foreground text-2xl font-bold">
                Minhas Notas
              </h1>
              <p className="text-muted-foreground">
                Acompanhe seu desempenho acadêmico
              </p>
            </div>
            <div className="bg-card border-border/50 shadow-soft overflow-hidden rounded-2xl border">
              <div className="border-border bg-muted/20 flex items-center justify-between border-b p-6">
                <div>
                  <h3 className="text-foreground text-lg font-semibold">
                    Técnico em Enfermagem 2024.1
                  </h3>
                  <span className="bg-primary/10 text-primary mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium">
                    Em andamento
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground text-sm">Média Geral</p>
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-3xl font-bold">
                      8.50
                    </span>
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
                      className="lucide lucide-trending-up text-success h-5 w-5"
                    >
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                      <polyline points="16 7 22 7 22 13"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                        Disciplina
                      </th>
                      <th className="text-muted-foreground px-6 py-4 text-center text-sm font-medium">
                        Nota 1
                      </th>
                      <th className="text-muted-foreground px-6 py-4 text-center text-sm font-medium">
                        Nota 2
                      </th>
                      <th className="text-muted-foreground px-6 py-4 text-center text-sm font-medium">
                        Média
                      </th>
                      <th className="text-muted-foreground px-6 py-4 text-right text-sm font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-border/50 bg-background border-b last:border-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-success/10 flex h-10 w-10 items-center justify-center rounded-lg">
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
                              className="lucide lucide-award text-success h-5 w-5"
                            >
                              <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                              <circle cx="12" cy="8" r="6"></circle>
                            </svg>
                          </div>
                          <span className="text-foreground font-medium">
                            Anatomia Humana
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-success text-sm font-medium">
                          8.5
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-success text-sm font-medium">
                          9.0
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-success text-lg font-bold">
                          8.75
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="bg-success/10 text-success inline-flex rounded-full px-3 py-1 text-xs font-medium">
                          Aprovado
                        </span>
                      </td>
                    </tr>
                    <tr className="border-border/50 bg-muted/10 border-b last:border-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-success/10 flex h-10 w-10 items-center justify-center rounded-lg">
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
                              className="lucide lucide-award text-success h-5 w-5"
                            >
                              <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                              <circle cx="12" cy="8" r="6"></circle>
                            </svg>
                          </div>
                          <span className="text-foreground font-medium">
                            Farmacologia
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-success text-sm font-medium">
                          7.0
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-success text-sm font-medium">
                          8.0
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-success text-lg font-bold">
                          7.50
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="bg-success/10 text-success inline-flex rounded-full px-3 py-1 text-xs font-medium">
                          Aprovado
                        </span>
                      </td>
                    </tr>
                    <tr className="border-border/50 bg-background border-b last:border-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-success/10 flex h-10 w-10 items-center justify-center rounded-lg">
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
                              className="lucide lucide-award text-success h-5 w-5"
                            >
                              <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                              <circle cx="12" cy="8" r="6"></circle>
                            </svg>
                          </div>
                          <span className="text-foreground font-medium">
                            Enfermagem Clínica
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-success text-sm font-medium">
                          9.0
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-success text-sm font-medium">
                          9.5
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-success text-lg font-bold">
                          9.25
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="bg-success/10 text-success inline-flex rounded-full px-3 py-1 text-xs font-medium">
                          Aprovado
                        </span>
                      </td>
                    </tr>
                    <tr className="border-border/50 bg-muted/10 border-b last:border-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
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
                              className="lucide lucide-award text-muted-foreground h-5 w-5"
                            >
                              <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                              <circle cx="12" cy="8" r="6"></circle>
                            </svg>
                          </div>
                          <span className="text-foreground font-medium">
                            Biossegurança
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-warning text-sm font-medium">
                          6.5
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-muted-foreground text-sm font-medium">
                          -
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-muted-foreground text-lg font-bold">
                          -
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="bg-muted text-muted-foreground inline-flex rounded-full px-3 py-1 text-xs font-medium">
                          Em andamento
                        </span>
                      </td>
                    </tr>
                    <tr className="border-border/50 bg-background border-b last:border-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
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
                              className="lucide lucide-award text-muted-foreground h-5 w-5"
                            >
                              <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                              <circle cx="12" cy="8" r="6"></circle>
                            </svg>
                          </div>
                          <span className="text-foreground font-medium">
                            Ética Profissional
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-muted-foreground text-sm font-medium">
                          -
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-muted-foreground text-sm font-medium">
                          -
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-muted-foreground text-lg font-bold">
                          -
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="bg-muted text-muted-foreground inline-flex rounded-full px-3 py-1 text-xs font-medium">
                          Em andamento
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-card border-border/50 shadow-soft overflow-hidden rounded-2xl border">
              <div className="border-border bg-muted/20 flex items-center justify-between border-b p-6">
                <div>
                  <h3 className="text-foreground text-lg font-semibold">
                    Auxiliar de Enfermagem 2023.2
                  </h3>
                  <span className="bg-success/10 text-success mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium">
                    Concluído
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground text-sm">Média Geral</p>
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-3xl font-bold">
                      8.50
                    </span>
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
                      className="lucide lucide-trending-up text-success h-5 w-5"
                    >
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                      <polyline points="16 7 22 7 22 13"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                        Disciplina
                      </th>
                      <th className="text-muted-foreground px-6 py-4 text-center text-sm font-medium">
                        Nota 1
                      </th>
                      <th className="text-muted-foreground px-6 py-4 text-center text-sm font-medium">
                        Nota 2
                      </th>
                      <th className="text-muted-foreground px-6 py-4 text-center text-sm font-medium">
                        Média
                      </th>
                      <th className="text-muted-foreground px-6 py-4 text-right text-sm font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-border/50 bg-background border-b last:border-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-success/10 flex h-10 w-10 items-center justify-center rounded-lg">
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
                              className="lucide lucide-award text-success h-5 w-5"
                            >
                              <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                              <circle cx="12" cy="8" r="6"></circle>
                            </svg>
                          </div>
                          <span className="text-foreground font-medium">
                            Fundamentos de Enfermagem
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-success text-sm font-medium">
                          8.0
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-success text-sm font-medium">
                          8.5
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-success text-lg font-bold">
                          8.25
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="bg-success/10 text-success inline-flex rounded-full px-3 py-1 text-xs font-medium">
                          Aprovado
                        </span>
                      </td>
                    </tr>
                    <tr className="border-border/50 bg-muted/10 border-b last:border-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-success/10 flex h-10 w-10 items-center justify-center rounded-lg">
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
                              className="lucide lucide-award text-success h-5 w-5"
                            >
                              <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                              <circle cx="12" cy="8" r="6"></circle>
                            </svg>
                          </div>
                          <span className="text-foreground font-medium">
                            Primeiros Socorros
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-success text-sm font-medium">
                          9.5
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-success text-sm font-medium">
                          9.0
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-success text-lg font-bold">
                          9.25
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="bg-success/10 text-success inline-flex rounded-full px-3 py-1 text-xs font-medium">
                          Aprovado
                        </span>
                      </td>
                    </tr>
                    <tr className="border-border/50 bg-background border-b last:border-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-success/10 flex h-10 w-10 items-center justify-center rounded-lg">
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
                              className="lucide lucide-award text-success h-5 w-5"
                            >
                              <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                              <circle cx="12" cy="8" r="6"></circle>
                            </svg>
                          </div>
                          <span className="text-foreground font-medium">
                            Saúde Coletiva
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-success text-sm font-medium">
                          7.5
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-success text-sm font-medium">
                          8.0
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-success text-lg font-bold">
                          7.75
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="bg-success/10 text-success inline-flex rounded-full px-3 py-1 text-xs font-medium">
                          Aprovado
                        </span>
                      </td>
                    </tr>
                    <tr className="border-border/50 bg-muted/10 border-b last:border-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-success/10 flex h-10 w-10 items-center justify-center rounded-lg">
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
                              className="lucide lucide-award text-success h-5 w-5"
                            >
                              <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                              <circle cx="12" cy="8" r="6"></circle>
                            </svg>
                          </div>
                          <span className="text-foreground font-medium">
                            Higiene e Profilaxia
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-success text-sm font-medium">
                          8.5
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-success text-sm font-medium">
                          9.0
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-success text-lg font-bold">
                          8.75
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="bg-success/10 text-success inline-flex rounded-full px-3 py-1 text-xs font-medium">
                          Aprovado
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
