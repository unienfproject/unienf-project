import { Input } from "@/app/_components/ui/input";
import SideBar from "./Sidebar";
import Link from "next/link";
import { Button } from "@/app/_components/ui/button";

export default function Overall() {
  return (
    <div>
      <SideBar />
      <div className="bg-background flex min-h-screen">
        <aside className="bg-sidebar fixed top-0 bottom-0 left-0 z-40 flex w-64 flex-col">
          <div className="border-sidebar-border border-b p-6">
            <Link className="flex items-center gap-3" href="/">
              <div className="bg-sidebar-primary flex h-10 w-10 items-center justify-center rounded-xl">
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
                  className="lucide lucide-graduation-cap text-sidebar-primary-foreground h-6 w-6"
                >
                  <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
                  <path d="M22 10v6"></path>
                  <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
                </svg>
              </div>
              <span className="text-sidebar-foreground text-xl font-bold">
                UNIENF
              </span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            <Link
              className="bg-sidebar-primary text-sidebar-primary-foreground shadow-soft flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
              href="/aluno"
            >
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
                className="lucide lucide-layout-dashboard h-5 w-5"
              >
                <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                <rect width="7" height="5" x="3" y="16" rx="1"></rect>
              </svg>
              Visão Geral
            </Link>
            <Link
              className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
              href="/aluno/documentos"
            >
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
                className="lucide lucide-file-text h-5 w-5"
              >
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                <path d="M10 9H8"></path>
                <path d="M16 13H8"></path>
                <path d="M16 17H8"></path>
              </svg>
              Meus Documentos
            </Link>
            <Link
              className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
              href="/aluno/notas"
            >
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
                className="lucide lucide-clipboard-list h-5 w-5"
              >
                <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <path d="M12 11h4"></path>
                <path d="M12 16h4"></path>
                <path d="M8 11h.01"></path>
                <path d="M8 16h.01"></path>
              </svg>
              Minhas Notas
            </Link>
            <Link
              className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
              href="/aluno/avisos"
            >
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
                className="lucide lucide-bell h-5 w-5"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
              </svg>
              Avisos
            </Link>
          </nav>
          <div className="border-sidebar-border space-y-1 border-t p-4">
            <Link
              className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
              href="/aluno/perfil"
            >
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
                className="lucide lucide-user h-5 w-5"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Perfil
            </Link>
            <Link
              className="text-sidebar-foreground/80 hover:bg-destructive hover:text-destructive-foreground flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
              href="/"
            >
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
                className="lucide lucide-log-out h-5 w-5"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" x2="9" y1="12" y2="12"></line>
              </svg>
              Sair
            </Link>
          </div>
        </aside>
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
                  Olá, Maria!
                </h1>
                <p className="text-muted-foreground">
                  Acompanhe seu progresso e atividades
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="shadow-soft hover-lift bg-primary/5 border-primary/20 rounded-2xl border p-6 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm font-medium">
                        Minha Turma
                      </p>
                      <p className="text-foreground text-3xl font-bold">
                        Técnico 2024.1
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
                        className="lucide lucide-book-open h-6 w-6"
                      >
                        <path d="M12 7v14"></path>
                        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="shadow-soft hover-lift bg-success/5 border-success/20 rounded-2xl border p-6 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm font-medium">
                        Média Geral
                      </p>
                      <p className="text-foreground text-3xl font-bold">8.3</p>
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
                        className="lucide lucide-award h-6 w-6"
                      >
                        <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                        <circle cx="12" cy="8" r="6"></circle>
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
                      <p className="text-foreground text-3xl font-bold">2</p>
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
                    <h3 className="text-foreground text-lg font-semibold">
                      Últimas Notas
                    </h3>
                    <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                      Ver todas
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
                        className="lucide lucide-arrow-right ml-2 h-4 w-4"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
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
                          <p className="text-muted-foreground text-sm">
                            Prova 1
                          </p>
                        </div>
                      </div>
                      <span className="text-muted-foreground text-sm">
                        10/03/2024
                      </span>
                    </div>
                    <div className="bg-muted/30 flex items-center justify-between rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-success/10 flex h-12 w-12 items-center justify-center rounded-xl">
                          <span className="text-success text-lg font-bold">
                            9
                          </span>
                        </div>
                        <div>
                          <p className="text-foreground font-medium">
                            Farmacologia
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Trabalho
                          </p>
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
                          <p className="text-muted-foreground text-sm">
                            Prova 1
                          </p>
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
                            className="lucide lucide-circle-check-big text-success h-5 w-5"
                          >
                            <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                            <path d="m9 11 3 3L22 4"></path>
                          </svg>
                          <span className="text-foreground text-sm">
                            Entregues
                          </span>
                        </div>
                        <span className="text-foreground font-semibold">4</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
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
                            className="lucide lucide-clock text-warning h-5 w-5"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <span className="text-foreground text-sm">
                            Pendentes
                          </span>
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
                        className="lucide lucide-bell text-primary h-5 w-5"
                      >
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                      </svg>
                      Avisos Recentes
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-primary/5 border-primary/10 rounded-lg border p-3">
                        <p className="text-foreground text-sm font-medium">
                          Início das aulas práticas
                        </p>
                        <p className="text-muted-foreground text-xs">
                          10/03/2024
                        </p>
                      </div>
                      <div className="bg-primary/5 border-primary/10 rounded-lg border p-3">
                        <p className="text-foreground text-sm font-medium">
                          Prazo de entrega de documentos
                        </p>
                        <p className="text-muted-foreground text-xs">
                          08/03/2024
                        </p>
                      </div>
                    </div>
                    <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                      Ver Todos
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
                        className="lucide lucide-arrow-right ml-2 h-4 w-4"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="bg-warning/5 border-warning/20 flex items-center gap-4 rounded-2xl border p-6">
                <div className="bg-warning/10 flex h-12 w-12 items-center justify-center rounded-xl">
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
                    className="lucide lucide-triangle-alert text-warning h-6 w-6"
                  >
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
                    <path d="M12 9v4"></path>
                    <path d="M12 17h.01"></path>
                  </svg>
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
      </div>
    </div>
  );
}
