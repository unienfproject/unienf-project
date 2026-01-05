import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { Award, TrendingUp } from "lucide-react";
import { listMyNotas } from "@/app/_lib/actions/notas";
import { getUserProfile } from "@/app/_lib/actions/profile";

function formatNota(value: number | null): string {
  if (value === null) return "-";
  return value.toFixed(1);
}

function getStatusBadge(status: "aprovado" | "reprovado" | "em_andamento") {
  if (status === "aprovado") {
    return (
      <span className="bg-success/10 text-success inline-flex rounded-full px-3 py-1 text-xs font-medium">
        Aprovado
      </span>
    );
  }
  if (status === "reprovado") {
    return (
      <span className="bg-destructive/10 text-destructive inline-flex rounded-full px-3 py-1 text-xs font-medium">
        Reprovado
      </span>
    );
  }
  return (
    <span className="bg-muted text-muted-foreground inline-flex rounded-full px-3 py-1 text-xs font-medium">
      Em andamento
    </span>
  );
}

function getNotaColor(value: number | null): string {
  if (value === null) return "text-muted-foreground";
  if (value >= 7) return "text-success";
  if (value >= 5) return "text-warning";
  return "text-destructive";
}

export default async function Notas() {
  const profile = await getUserProfile();

  if (!profile) {
    return (
      <div className="p-6">Sessão inválida. Faça login novamente.</div>
    );
  }

  if (profile.role !== "aluno") {
    return <div className="p-6">Sem acesso às notas do aluno.</div>;
  }

  const notasPorTurma = await listMyNotas();

  // Calcular média geral (média das médias das turmas)
  const mediasComValor = notasPorTurma
    .map((n) => n.media)
    .filter((m): m is number => m !== null);
  const mediaGeral =
    mediasComValor.length > 0
      ? mediasComValor.reduce((acc, cur) => acc + cur, 0) / mediasComValor.length
      : null;

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

          {notasPorTurma.length === 0 ? (
            <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
              <p className="text-muted-foreground text-center">
                Você não está inscrito em nenhuma turma no momento.
              </p>
            </div>
          ) : (
            notasPorTurma.map((turma) => (
              <div
                key={turma.turmaId}
                className="bg-card border-border/50 shadow-soft overflow-hidden rounded-2xl border"
              >
                <div className="border-border bg-muted/20 flex items-center justify-between border-b p-6">
                  <div>
                    <h3 className="text-foreground text-lg font-semibold">
                      {turma.turmaName}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {turma.disciplinaName}
                    </p>
                    <span className="bg-primary/10 text-primary mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium">
                      {turma.status === "aprovado"
                        ? "Aprovado"
                        : turma.status === "reprovado"
                          ? "Reprovado"
                          : "Em andamento"}
                    </span>
                  </div>
                  {turma.media !== null && (
                    <div className="text-right">
                      <p className="text-muted-foreground text-sm">Média</p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-3xl font-bold ${getNotaColor(turma.media)}`}
                        >
                          {formatNota(turma.media)}
                        </span>
                        {turma.media >= 7 && (
                          <TrendingUp className="text-success h-5 w-5" />
                        )}
                      </div>
                    </div>
                  )}
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
                              {turma.disciplinaName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center">
                          <span
                            className={`text-sm font-medium ${getNotaColor(turma.a1)}`}
                          >
                            {formatNota(turma.a1)}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center">
                          <span
                            className={`text-sm font-medium ${getNotaColor(turma.a2)}`}
                          >
                            {formatNota(turma.a2)}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center">
                          <span
                            className={`text-sm font-medium ${getNotaColor(turma.a3)}`}
                          >
                            {formatNota(turma.a3)}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center">
                          <span
                            className={`text-sm font-medium ${getNotaColor(turma.rec)}`}
                          >
                            {formatNota(turma.rec)}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center">
                          <span
                            className={`text-lg font-bold ${getNotaColor(turma.media)}`}
                          >
                            {formatNota(turma.media)}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          {getStatusBadge(turma.status)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))
          )}

          {mediaGeral !== null && notasPorTurma.length > 1 && (
            <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-foreground text-lg font-semibold">
                    Média Geral
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Média de todas as disciplinas
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-3xl font-bold ${getNotaColor(mediaGeral)}`}
                    >
                      {formatNota(mediaGeral)}
                    </span>
                    {mediaGeral >= 7 && (
                      <TrendingUp className="text-success h-5 w-5" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
