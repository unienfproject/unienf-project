import { Table } from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function PerfilAluno() {
  return (
    <div className="ml-64 flex-1">
      <main className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-10 items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
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
                className="lucide lucide-arrow-left h-5 w-5"
              >
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
            </Button>
            <div className="flex-1">
              <h1 className="text-foreground text-2xl font-bold">
                Perfil do Aluno
              </h1>
              <p className="text-muted-foreground">
                Visualize e gerencie os dados do aluno
              </p>
            </div>
            <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap shadow-sm transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
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
                className="lucide lucide-square-pen mr-2 h-4 w-4"
              >
                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
              </svg>
              Editar
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-1">
              <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
                <div className="mb-6 flex flex-col items-center text-center">
                  <div className="bg-primary/10 mb-4 flex h-24 w-24 items-center justify-center rounded-full">
                    <span className="text-primary text-3xl font-bold">M</span>
                  </div>
                  <h2 className="text-foreground text-xl font-semibold">
                    Maria Silva
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Matrícula: 2024001
                  </p>
                  <span className="bg-primary/10 text-primary mt-2 rounded-full px-3 py-1 text-xs font-medium">
                    Técnico em Enfermagem 2024.1
                  </span>
                </div>
                <div className="space-y-4">
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
                      className="lucide lucide-mail text-muted-foreground h-5 w-5"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                    <span className="text-foreground text-sm">
                      maria.silva@email.com
                    </span>
                  </div>
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
                      className="lucide lucide-phone text-muted-foreground h-5 w-5"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span className="text-foreground text-sm">
                      (11) 98765-4321
                    </span>
                  </div>
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
                      className="lucide lucide-calendar text-muted-foreground h-5 w-5"
                    >
                      <path d="M8 2v4"></path>
                      <path d="M16 2v4"></path>
                      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                      <path d="M3 10h18"></path>
                    </svg>
                    <span className="text-foreground text-sm">15/03/1998</span>
                  </div>
                  <div className="flex items-start gap-3">
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
                      className="lucide lucide-map-pin text-muted-foreground h-5 w-5 flex-shrink-0"
                    >
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span className="text-foreground text-sm">
                      Rua das Flores, 123 - São Paulo, SP
                    </span>
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
                    className="lucide lucide-triangle-alert text-warning h-5 w-5"
                  >
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
                    <path d="M12 9v4"></path>
                    <path d="M12 17h.01"></path>
                  </svg>
                  Advertências
                </h3>
                <div className="space-y-3">
                  <div className="bg-warning/5 border-warning/20 rounded-lg border p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-warning text-sm font-medium">
                        Advertência
                      </span>
                      <span className="text-muted-foreground text-xs">
                        15/03/2024
                      </span>
                    </div>
                    <p className="text-foreground text-sm">
                      Falta não justificada em estágio
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6 lg:col-span-2">
              <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
                <h3 className="text-foreground mb-4 text-lg font-semibold">
                  Documentos
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="bg-success/5 border-success/20 rounded-xl border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-foreground font-medium">RG</p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          Entregue em 01/02/2024
                        </p>
                      </div>
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
                    </div>
                  </div>
                  <div className="bg-success/5 border-success/20 rounded-xl border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-foreground font-medium">CPF</p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          Entregue em 01/02/2024
                        </p>
                      </div>
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
                    </div>
                  </div>
                  <div className="bg-warning/5 border-warning/20 rounded-xl border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-foreground font-medium">
                          Histórico Escolar
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          Pendente
                        </p>
                      </div>
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
                    </div>
                    <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-input bg-background hover:bg-accent hover:text-accent-foreground mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                      Marcar como Entregue
                    </Button>
                  </div>
                  <div className="bg-success/5 border-success/20 rounded-xl border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-foreground font-medium">
                          Comprovante de Residência
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          Entregue em 05/02/2024
                        </p>
                      </div>
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
                    </div>
                  </div>
                  <div className="bg-destructive/5 border-destructive/20 rounded-xl border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-foreground font-medium">
                          Certidão de Nascimento
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          Rejeitado
                        </p>
                        <p className="text-destructive mt-1 text-xs">
                          Documento ilegível
                        </p>
                      </div>
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
                        className="lucide lucide-circle-x text-destructive h-5 w-5"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m15 9-6 6"></path>
                        <path d="m9 9 6 6"></path>
                      </svg>
                    </div>
                    <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-input bg-background hover:bg-accent hover:text-accent-foreground mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                      Solicitar Novo
                    </Button>
                  </div>
                  <div className="bg-success/5 border-success/20 rounded-xl border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-foreground font-medium">Foto 3x4</p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          Entregue em 01/02/2024
                        </p>
                      </div>
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
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
                <h3 className="text-foreground mb-4 text-lg font-semibold">
                  Histórico de Notas
                </h3>
                <div className="overflow-x-auto">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="border-border border-b">
                        <TableHead className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                          Disciplina
                        </TableHead>
                        <TableHead className="text-muted-foreground px-4 py-3 text-center text-sm font-medium">
                          Nota 1
                        </TableHead>
                        <TableHead className="text-muted-foreground px-4 py-3 text-center text-sm font-medium">
                          Nota 2
                        </TableHead>
                        <TableHead className="text-muted-foreground px-4 py-3 text-center text-sm font-medium">
                          Média
                        </TableHead>
                        <TableHead className="text-muted-foreground px-4 py-3 text-right text-sm font-medium">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="border-border/50 border-b last:border-0">
                        <TableCell className="text-foreground px-4 py-3 text-sm">
                          Anatomia Humana
                        </TableCell>
                        <TableCell className="text-foreground px-4 py-3 text-center text-sm">
                          8.5
                        </TableCell>
                        <TableCell className="text-foreground px-4 py-3 text-center text-sm">
                          9
                        </TableCell>
                        <TableCell className="text-foreground px-4 py-3 text-center text-sm font-semibold">
                          8.75
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right">
                          <span className="bg-success/10 text-success inline-flex rounded-full px-3 py-1 text-xs font-medium">
                            Aprovado
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-border/50 border-b last:border-0">
                        <TableCell className="text-foreground px-4 py-3 text-sm">
                          Farmacologia
                        </TableCell>
                        <TableCell className="text-foreground px-4 py-3 text-center text-sm">
                          7
                        </TableCell>
                        <TableCell className="text-foreground px-4 py-3 text-center text-sm">
                          8
                        </TableCell>
                        <TableCell className="text-foreground px-4 py-3 text-center text-sm font-semibold">
                          7.5
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right">
                          <span className="bg-success/10 text-success inline-flex rounded-full px-3 py-1 text-xs font-medium">
                            Aprovado
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-border/50 border-b last:border-0">
                        <TableCell className="text-foreground px-4 py-3 text-sm">
                          Enfermagem Clínica
                        </TableCell>
                        <TableCell className="text-foreground px-4 py-3 text-center text-sm">
                          9
                        </TableCell>
                        <TableCell className="text-foreground px-4 py-3 text-center text-sm">
                          9.5
                        </TableCell>
                        <TableCell className="text-foreground px-4 py-3 text-center text-sm font-semibold">
                          9.25
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right">
                          <span className="bg-success/10 text-success inline-flex rounded-full px-3 py-1 text-xs font-medium">
                            Aprovado
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-border/50 border-b last:border-0">
                        <TableCell className="text-foreground px-4 py-3 text-sm">
                          Biossegurança
                        </TableCell>
                        <TableCell className="text-foreground px-4 py-3 text-center text-sm">
                          6.5
                        </TableCell>
                        <TableCell className="text-foreground px-4 py-3 text-center text-sm">
                          -
                        </TableCell>
                        <TableCell className="text-foreground px-4 py-3 text-center text-sm font-semibold">
                          -
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right">
                          <span className="bg-muted text-muted-foreground inline-flex rounded-full px-3 py-1 text-xs font-medium">
                            Em andamento
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
