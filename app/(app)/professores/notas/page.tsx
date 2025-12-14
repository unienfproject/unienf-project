import { Input } from "@/app/_components/ui/input";
import SideBar from "../SideBar";
import { Button } from "@/app/_components/ui/button";
import { Label } from "@/app/_components/ui/label";
import Link from "next/link";

export default function Notas() {
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
              className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
              href="/professor"
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
              href="/professor/turmas"
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
                className="lucide lucide-folder-open h-5 w-5"
              >
                <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"></path>
              </svg>
              Minhas Turmas
            </Link>
            <Link
              className="bg-sidebar-primary text-sidebar-primary-foreground shadow-soft flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
              href="/professor/notas"
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
              Lançar Notas
            </Link>
            <Link
              className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
              href="/professor/avisos"
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
              href="/professor/perfil"
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
                  Lançar Notas
                </h1>
                <p className="text-muted-foreground">
                  Selecione a turma e a avaliação para lançar as notas
                </p>
              </div>
              <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Turma
                    </Label>
                    <select className="border-input bg-background text-foreground h-10 w-full rounded-lg border px-3">
                      <option value="1">Técnico 2024.1 - Anatomia</option>
                      <option value="2">Técnico 2024.1 - Farmacologia</option>
                      <option value="3">Auxiliar 2024.1 - Biossegurança</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Avaliação
                    </Label>
                    <select className="border-input bg-background text-foreground h-10 w-full rounded-lg border px-3">
                      <option value="prova1">Prova 1</option>
                      <option value="trabalho1">Trabalho 1</option>
                      <option value="prova2">Prova 2</option>
                      <option value="trabalho2">Trabalho 2</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-card border-border/50 shadow-soft overflow-hidden rounded-2xl border">
                <div className="border-border border-b p-6">
                  <h3 className="text-foreground text-lg font-semibold">
                    Técnico 2024.1 - Anatomia - Prova 1
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                          Aluno
                        </th>
                        <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                          Matrícula
                        </th>
                        <th className="text-muted-foreground w-32 px-6 py-4 text-center text-sm font-medium">
                          Nota (0-10)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-border/50 bg-background border-b last:border-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                              <span className="text-primary text-sm font-semibold">
                                M
                              </span>
                            </div>
                            <span className="text-foreground text-sm font-medium">
                              Maria Silva
                            </span>
                          </div>
                        </td>
                        <td className="text-muted-foreground px-6 py-4 text-sm">
                          2024001
                        </td>
                        <td className="px-6 py-4">
                          <Input
                            type="number"
                            className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring mx-auto flex h-10 w-24 rounded-md border px-3 py-2 text-center text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            min="0"
                            max="10"
                            step="0.1"
                            placeholder="0.0"
                            value=""
                          />
                        </td>
                      </tr>
                      <tr className="border-border/50 bg-muted/10 border-b last:border-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                              <span className="text-primary text-sm font-semibold">
                                J
                              </span>
                            </div>
                            <span className="text-foreground text-sm font-medium">
                              João Santos
                            </span>
                          </div>
                        </td>
                        <td className="text-muted-foreground px-6 py-4 text-sm">
                          2024002
                        </td>
                        <td className="px-6 py-4">
                          <Input
                            type="number"
                            className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring mx-auto flex h-10 w-24 rounded-md border px-3 py-2 text-center text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            min="0"
                            max="10"
                            step="0.1"
                            placeholder="0.0"
                            value=""
                          />
                        </td>
                      </tr>
                      <tr className="border-border/50 bg-background border-b last:border-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                              <span className="text-primary text-sm font-semibold">
                                A
                              </span>
                            </div>
                            <span className="text-foreground text-sm font-medium">
                              Ana Costa
                            </span>
                          </div>
                        </td>
                        <td className="text-muted-foreground px-6 py-4 text-sm">
                          2024003
                        </td>
                        <td className="px-6 py-4">
                          <Input
                            type="number"
                            className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring mx-auto flex h-10 w-24 rounded-md border px-3 py-2 text-center text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            min="0"
                            max="10"
                            step="0.1"
                            placeholder="0.0"
                            value=""
                          />
                        </td>
                      </tr>
                      <tr className="border-border/50 bg-muted/10 border-b last:border-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                              <span className="text-primary text-sm font-semibold">
                                C
                              </span>
                            </div>
                            <span className="text-foreground text-sm font-medium">
                              Carlos Oliveira
                            </span>
                          </div>
                        </td>
                        <td className="text-muted-foreground px-6 py-4 text-sm">
                          2024004
                        </td>
                        <td className="px-6 py-4">
                          <Input
                            type="number"
                            className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring mx-auto flex h-10 w-24 rounded-md border px-3 py-2 text-center text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            min="0"
                            max="10"
                            step="0.1"
                            placeholder="0.0"
                            value=""
                          />
                        </td>
                      </tr>
                      <tr className="border-border/50 bg-background border-b last:border-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                              <span className="text-primary text-sm font-semibold">
                                F
                              </span>
                            </div>
                            <span className="text-foreground text-sm font-medium">
                              Fernanda Lima
                            </span>
                          </div>
                        </td>
                        <td className="text-muted-foreground px-6 py-4 text-sm">
                          2024005
                        </td>
                        <td className="px-6 py-4">
                          <Input
                            type="number"
                            className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring mx-auto flex h-10 w-24 rounded-md border px-3 py-2 text-center text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            min="0"
                            max="10"
                            step="0.1"
                            placeholder="0.0"
                            value=""
                          />
                        </td>
                      </tr>
                      <tr className="border-border/50 bg-muted/10 border-b last:border-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                              <span className="text-primary text-sm font-semibold">
                                R
                              </span>
                            </div>
                            <span className="text-foreground text-sm font-medium">
                              Ricardo Souza
                            </span>
                          </div>
                        </td>
                        <td className="text-muted-foreground px-6 py-4 text-sm">
                          2024006
                        </td>
                        <td className="px-6 py-4">
                          <Input
                            type="number"
                            className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring mx-auto flex h-10 w-24 rounded-md border px-3 py-2 text-center text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            min="0"
                            max="10"
                            step="0.1"
                            placeholder="0.0"
                            value=""
                          />
                        </td>
                      </tr>
                      <tr className="border-border/50 bg-background border-b last:border-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                              <span className="text-primary text-sm font-semibold">
                                J
                              </span>
                            </div>
                            <span className="text-foreground text-sm font-medium">
                              Juliana Pereira
                            </span>
                          </div>
                        </td>
                        <td className="text-muted-foreground px-6 py-4 text-sm">
                          2024007
                        </td>
                        <td className="px-6 py-4">
                          <Input
                            type="number"
                            className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring mx-auto flex h-10 w-24 rounded-md border px-3 py-2 text-center text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            min="0"
                            max="10"
                            step="0.1"
                            placeholder="0.0"
                            value=""
                          />
                        </td>
                      </tr>
                      <tr className="border-border/50 bg-muted/10 border-b last:border-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                              <span className="text-primary text-sm font-semibold">
                                P
                              </span>
                            </div>
                            <span className="text-foreground text-sm font-medium">
                              Pedro Mendes
                            </span>
                          </div>
                        </td>
                        <td className="text-muted-foreground px-6 py-4 text-sm">
                          2024008
                        </td>
                        <td className="px-6 py-4">
                          <Input
                            type="number"
                            className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring mx-auto flex h-10 w-24 rounded-md border px-3 py-2 text-center text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            min="0"
                            max="10"
                            step="0.1"
                            placeholder="0.0"
                            value=""
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="border-border bg-muted/20 flex items-center justify-between border-t p-6">
                  <p className="text-muted-foreground text-sm">
                    0 de 8 notas preenchidas
                  </p>
                  <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap shadow-sm transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
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
                      className="lucide lucide-save mr-2 h-4 w-4"
                    >
                      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
                      <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path>
                      <path d="M7 3v4a1 1 0 0 0 1 1h7"></path>
                    </svg>
                    Salvar Notas
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
