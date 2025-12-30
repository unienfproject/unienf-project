import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { Award, TrendingUp } from "lucide-react";

export default function Notas() {
  return (
    <div className="flex-1">
      <main className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-foreground text-2xl font-bold">Minhas Notas</h1>
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
                  <span className="text-primary text-3xl font-bold">8.50</span>
                  <TrendingUp className="text-success h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                      Disciplina
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-center text-sm font-medium">
                      Avaliação 1
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-center text-sm font-medium">
                      Avaliação 2
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-center text-sm font-medium">
                      Avaliação 3
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-center text-sm font-medium">
                      Recuperação
                    </TableHead>
                    {/*/A nota da Recuperação vai substituir a nota da média das 3 avaliações se for maior que a media.
                      //Então (IF "RECUPERAÇÃO" > "AVA1+AVA2+AVA3/3" = "RECUPERAÇÃO" ELSE = AVA1+AVA2+AVA3/3)*/}
                    <TableHead className="text-muted-foreground px-6 py-4 text-center text-sm font-medium">
                      Média
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-right text-sm font-medium">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-border/50 bg-background border-b last:border-0">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-success/10 flex h-10 w-10 items-center justify-center rounded-lg">
                          <Award className="text-success h-5 w-5" />
                        </div>
                        <span className="text-foreground font-medium">
                          Anatomia Humana
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        8.5
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        9.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        9.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        0.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-lg font-bold">
                        8.8
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <span className="bg-success/10 text-success inline-flex rounded-full px-3 py-1 text-xs font-medium">
                        Aprovado
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-border/50 bg-muted/10 border-b last:border-0">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-success/10 flex h-10 w-10 items-center justify-center rounded-lg">
                          <Award className="text-success h-5 w-5" />
                        </div>
                        <span className="text-foreground font-medium">
                          Farmacologia
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        7.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        8.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        9.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        0.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-lg font-bold">
                        8.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <span className="bg-success/10 text-success inline-flex rounded-full px-3 py-1 text-xs font-medium">
                        Aprovado
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-border/50 bg-background border-b last:border-0">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-success/10 flex h-10 w-10 items-center justify-center rounded-lg">
                          <Award className="text-success h-5 w-5" />
                        </div>
                        <span className="text-foreground font-medium">
                          Enfermagem Clínica
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        9.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        9.5
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        9.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        0.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-lg font-bold">
                        9.25
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <span className="bg-success/10 text-success inline-flex rounded-full px-3 py-1 text-xs font-medium">
                        Aprovado
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-border/50 bg-muted/10 border-b last:border-0">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                          <Award className="text-muted-foreground h-5 w-5" />
                        </div>
                        <span className="text-foreground font-medium">
                          Biossegurança
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-warning text-sm font-medium">
                        6.5
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-muted-foreground text-sm font-medium">
                        -
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        -
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        -
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-muted-foreground text-lg font-bold">
                        -
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <span className="bg-muted text-muted-foreground inline-flex rounded-full px-3 py-1 text-xs font-medium">
                        Em andamento
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-border/50 bg-background border-b last:border-0">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                          <Award className="text-muted-foreground h-5 w-5" />
                        </div>
                        <span className="text-foreground font-medium">
                          Ética Profissional
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-muted-foreground text-sm font-medium">
                        -
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-muted-foreground text-sm font-medium">
                        -
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        -
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        -
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-muted-foreground text-lg font-bold">
                        -
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <span className="bg-muted text-muted-foreground inline-flex rounded-full px-3 py-1 text-xs font-medium">
                        Em andamento
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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
                  <span className="text-primary text-3xl font-bold">8.50</span>
                  <TrendingUp className="text-success h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                      Disciplina
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-center text-sm font-medium">
                      Avaliação 1
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-center text-sm font-medium">
                      Avaliação 2
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-center text-sm font-medium">
                      Avaliação 3
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-center text-sm font-medium">
                      Recuperação
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-center text-sm font-medium">
                      Média
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-right text-sm font-medium">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-border/50 bg-background border-b last:border-0">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-success/10 flex h-10 w-10 items-center justify-center rounded-lg">
                          <Award className="text-success h-5 w-5" />
                        </div>
                        <span className="text-foreground font-medium">
                          Fundamentos de Enfermagem
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        8.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        8.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        8.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        0.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-lg font-bold">
                        8.25
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <span className="bg-success/10 text-success inline-flex rounded-full px-3 py-1 text-xs font-medium">
                        Aprovado
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-border/50 bg-muted/10 border-b last:border-0">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-success/10 flex h-10 w-10 items-center justify-center rounded-lg">
                          <Award className="text-success h-5 w-5" />
                        </div>
                        <span className="text-foreground font-medium">
                          Primeiros Socorros
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        9.5
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        8.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        8.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        0.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-lg font-bold">
                        9.25
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <span className="bg-success/10 text-success inline-flex rounded-full px-3 py-1 text-xs font-medium">
                        Aprovado
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-border/50 bg-background border-b last:border-0">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-success/10 flex h-10 w-10 items-center justify-center rounded-lg">
                          <Award className="text-success h-5 w-5" />
                        </div>
                        <span className="text-foreground font-medium">
                          Saúde Coletiva
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        7.5
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        8.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        8.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        0.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-lg font-bold">
                        7.75
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <span className="bg-success/10 text-success inline-flex rounded-full px-3 py-1 text-xs font-medium">
                        Aprovado
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-border/50 bg-muted/10 border-b last:border-0">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-success/10 flex h-10 w-10 items-center justify-center rounded-lg">
                          <Award className="text-success h-5 w-5" />
                        </div>
                        <span className="text-foreground font-medium">
                          Higiene e Profilaxia
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        8.5
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        9.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        8.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-sm font-medium">
                        0.0
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-success text-lg font-bold">
                        8.75
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <span className="bg-success/10 text-success inline-flex rounded-full px-3 py-1 text-xs font-medium">
                        Aprovado
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
