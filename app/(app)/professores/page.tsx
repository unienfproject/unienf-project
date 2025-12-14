import { Input } from "@/app/_components/ui/input";
import SideBar from "./SideBar";
import { Button } from "@/app/_components/ui/button";

export default function Overall() {
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
            <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground relative inline-flex h-10 w-10 cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
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
              <div className="shadow-soft hover-lift bg-primary/5 border-primary/20 rounded-2xl border p-6 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Minhas Turmas
                    </p>
                    <p className="text-foreground text-3xl font-bold">3</p>
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
              <div className="border-border/50 shadow-soft hover-lift bg-card rounded-2xl border p-6 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Total de Alunos
                    </p>
                    <p className="text-foreground text-3xl font-bold">85</p>
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
              <div className="shadow-soft hover-lift bg-warning/5 border-warning/20 rounded-2xl border p-6 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Notas Pendentes
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
                      className="lucide lucide-clipboard-list h-6 w-6"
                    >
                      <rect
                        width="8"
                        height="4"
                        x="8"
                        y="2"
                        rx="1"
                        ry="1"
                      ></rect>
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                      <path d="M12 11h4"></path>
                      <path d="M12 16h4"></path>
                      <path d="M8 11h.01"></path>
                      <path d="M8 16h.01"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6 lg:col-span-2">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-foreground text-lg font-semibold">
                    Minhas Turmas
                  </h3>
                  <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
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
                  <div className="bg-muted/30 hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-xl p-4 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
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
                          className="lucide lucide-book-open text-primary h-6 w-6"
                        >
                          <path d="M12 7v14"></path>
                          <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
                        </svg>
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
                      <p className="text-foreground text-lg font-semibold">
                        32
                      </p>
                      <p className="text-muted-foreground text-xs">alunos</p>
                    </div>
                  </div>
                  <div className="bg-muted/30 hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-xl p-4 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
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
                          className="lucide lucide-book-open text-primary h-6 w-6"
                        >
                          <path d="M12 7v14"></path>
                          <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
                        </svg>
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
                      <p className="text-foreground text-lg font-semibold">
                        28
                      </p>
                      <p className="text-muted-foreground text-xs">alunos</p>
                    </div>
                  </div>
                  <div className="bg-muted/30 hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-xl p-4 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
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
                          className="lucide lucide-book-open text-primary h-6 w-6"
                        >
                          <path d="M12 7v14"></path>
                          <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
                        </svg>
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
                      <p className="text-foreground text-lg font-semibold">
                        25
                      </p>
                      <p className="text-muted-foreground text-xs">alunos</p>
                    </div>
                  </div>
                </div>
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
                    className="lucide lucide-calendar text-primary h-5 w-5"
                  >
                    <path d="M8 2v4"></path>
                    <path d="M16 2v4"></path>
                    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                    <path d="M3 10h18"></path>
                  </svg>
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
                    <p className="text-muted-foreground mt-1 text-sm">
                      Sala 101
                    </p>
                  </div>
                  <div className="bg-primary/5 border-primary/10 rounded-xl border p-4">
                    <p className="text-foreground mb-1 font-medium">
                      Técnico 2024.1 - Farmacologia
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary font-medium">Amanhã</span>
                      <span className="text-muted-foreground">19h-21h</span>
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Sala 203
                    </p>
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
                        className="lucide lucide-clipboard-list text-warning h-5 w-5"
                      >
                        <rect
                          width="8"
                          height="4"
                          x="8"
                          y="2"
                          rx="1"
                          ry="1"
                        ></rect>
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <path d="M12 11h4"></path>
                        <path d="M12 16h4"></path>
                        <path d="M8 11h.01"></path>
                        <path d="M8 16h.01"></path>
                      </svg>
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
                        className="lucide lucide-clipboard-list text-warning h-5 w-5"
                      >
                        <rect
                          width="8"
                          height="4"
                          x="8"
                          y="2"
                          rx="1"
                          ry="1"
                        ></rect>
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <path d="M12 11h4"></path>
                        <path d="M12 16h4"></path>
                        <path d="M8 11h.01"></path>
                        <path d="M8 16h.01"></path>
                      </svg>
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
    </div>
  );
}
