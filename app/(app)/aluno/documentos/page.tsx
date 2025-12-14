import { Button } from "@/app/_components/ui/button";
import SideBar from "../Sidebar";
import { Input } from "@/app/_components/ui/input";

export default function Documentos() {
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
                Meus Documentos
              </h1>
              <p className="text-muted-foreground">
                Gerencie seus documentos acadêmicos
              </p>
            </div>
            <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-foreground text-lg font-semibold">
                    Progresso da Documentação
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    4 de 6 documentos aprovados
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-primary text-3xl font-bold">67%</span>
                </div>
              </div>
              <div className="bg-muted h-3 w-full rounded-full">
                <div className="bg-primary h-3 rounded-full transition-all duration-500"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="bg-card shadow-soft border-success/20 rounded-2xl border p-6 transition-all duration-300">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
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
                      className="lucide lucide-circle-check-big text-success h-6 w-6"
                    >
                      <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                      <path d="m9 11 3 3L22 4"></path>
                    </svg>
                    <div>
                      <h4 className="text-foreground font-semibold">
                        RG (Identidade)
                      </h4>
                      <span className="bg-success/10 text-success mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium">
                        Aprovado
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/30 mb-4 flex items-center gap-2 rounded-lg p-3">
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
                    className="lucide lucide-file-text text-muted-foreground h-4 w-4"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                    <path d="M10 9H8"></path>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                  </svg>
                  <span className="text-muted-foreground flex-1 truncate text-sm">
                    rg_maria_silva.pdf
                  </span>
                  <span className="text-muted-foreground text-xs">
                    01/02/2024
                  </span>
                </div>
                <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
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
                    className="lucide lucide-circle-check-big mr-2 h-4 w-4"
                  >
                    <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                    <path d="m9 11 3 3L22 4"></path>
                  </svg>
                  Documento Aprovado
                </Button>
              </div>
              <div className="bg-card shadow-soft border-success/20 rounded-2xl border p-6 transition-all duration-300">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
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
                      className="lucide lucide-circle-check-big text-success h-6 w-6"
                    >
                      <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                      <path d="m9 11 3 3L22 4"></path>
                    </svg>
                    <div>
                      <h4 className="text-foreground font-semibold">CPF</h4>
                      <span className="bg-success/10 text-success mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium">
                        Aprovado
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/30 mb-4 flex items-center gap-2 rounded-lg p-3">
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
                    className="lucide lucide-file-text text-muted-foreground h-4 w-4"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                    <path d="M10 9H8"></path>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                  </svg>
                  <span className="text-muted-foreground flex-1 truncate text-sm">
                    cpf_maria_silva.pdf
                  </span>
                  <span className="text-muted-foreground text-xs">
                    01/02/2024
                  </span>
                </div>
                <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
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
                    className="lucide lucide-circle-check-big mr-2 h-4 w-4"
                  >
                    <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                    <path d="m9 11 3 3L22 4"></path>
                  </svg>
                  Documento Aprovado
                </Button>
              </div>
              <div className="bg-card shadow-soft border-warning/20 rounded-2xl border p-6 transition-all duration-300">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
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
                      className="lucide lucide-clock text-warning h-6 w-6"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <div>
                      <h4 className="text-foreground font-semibold">
                        Histórico Escolar
                      </h4>
                      <span className="bg-warning/10 text-warning mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium">
                        Pendente
                      </span>
                    </div>
                  </div>
                </div>
                <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap shadow-sm transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
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
                    className="lucide lucide-upload mr-2 h-4 w-4"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" x2="12" y1="3" y2="15"></line>
                  </svg>
                  Enviar Documento
                </Button>
              </div>
              <div className="bg-card shadow-soft border-success/20 rounded-2xl border p-6 transition-all duration-300">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
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
                      className="lucide lucide-circle-check-big text-success h-6 w-6"
                    >
                      <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                      <path d="m9 11 3 3L22 4"></path>
                    </svg>
                    <div>
                      <h4 className="text-foreground font-semibold">
                        Comprovante de Residência
                      </h4>
                      <span className="bg-success/10 text-success mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium">
                        Aprovado
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/30 mb-4 flex items-center gap-2 rounded-lg p-3">
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
                    className="lucide lucide-file-text text-muted-foreground h-4 w-4"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                    <path d="M10 9H8"></path>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                  </svg>
                  <span className="text-muted-foreground flex-1 truncate text-sm">
                    comprovante_residencia.pdf
                  </span>
                  <span className="text-muted-foreground text-xs">
                    05/02/2024
                  </span>
                </div>
                <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
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
                    className="lucide lucide-circle-check-big mr-2 h-4 w-4"
                  >
                    <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                    <path d="m9 11 3 3L22 4"></path>
                  </svg>
                  Documento Aprovado
                </Button>
              </div>
              <div className="bg-card shadow-soft border-destructive/20 rounded-2xl border p-6 transition-all duration-300">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
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
                      className="lucide lucide-circle-x text-destructive h-6 w-6"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="m15 9-6 6"></path>
                      <path d="m9 9 6 6"></path>
                    </svg>
                    <div>
                      <h4 className="text-foreground font-semibold">
                        Certidão de Nascimento
                      </h4>
                      <span className="bg-destructive/10 text-destructive mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium">
                        Rejeitado
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-destructive/5 border-destructive/10 mb-4 rounded-lg border p-3">
                  <p className="text-destructive text-sm">
                    Documento ilegível, favor enviar novamente.
                  </p>
                </div>
                <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-destructive text-destructive-foreground hover:bg-destructive/90 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
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
                    className="lucide lucide-upload mr-2 h-4 w-4"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" x2="12" y1="3" y2="15"></line>
                  </svg>
                  Enviar Novamente
                </Button>
              </div>
              <div className="bg-card shadow-soft border-success/20 rounded-2xl border p-6 transition-all duration-300">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
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
                      className="lucide lucide-circle-check-big text-success h-6 w-6"
                    >
                      <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                      <path d="m9 11 3 3L22 4"></path>
                    </svg>
                    <div>
                      <h4 className="text-foreground font-semibold">
                        Foto 3x4
                      </h4>
                      <span className="bg-success/10 text-success mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium">
                        Aprovado
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/30 mb-4 flex items-center gap-2 rounded-lg p-3">
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
                    className="lucide lucide-file-text text-muted-foreground h-4 w-4"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                    <path d="M10 9H8"></path>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                  </svg>
                  <span className="text-muted-foreground flex-1 truncate text-sm">
                    foto_3x4.jpg
                  </span>
                  <span className="text-muted-foreground text-xs">
                    01/02/2024
                  </span>
                </div>
                <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
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
                    className="lucide lucide-circle-check-big mr-2 h-4 w-4"
                  >
                    <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                    <path d="m9 11 3 3L22 4"></path>
                  </svg>
                  Documento Aprovado
                </Button>
              </div>
            </div>
            <div className="bg-primary/5 border-primary/20 rounded-2xl border p-6">
              <h4 className="text-foreground mb-2 font-semibold">
                Informações Importantes
              </h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>• Os documentos devem estar em formato PDF, JPG ou PNG</li>
                <li>• Tamanho máximo por arquivo: 5MB</li>
                <li>• Certifique-se de que os documentos estão legíveis</li>
                <li>
                  • Documentos rejeitados devem ser reenviados em até 15 dias
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
