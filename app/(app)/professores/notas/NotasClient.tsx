"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { Save } from "lucide-react";

import { upsertGradesBulk } from "@/app/_lib/actions/notas";

type TurmaItem = { id: string; name: string; tag: string };
type AvaliacaoItem = { id: string; label: string };

type AlunoNotaRow = {
  alunoId: string;
  alunoName: string;
  etiquetas: string | null;
  nota: number | null;
};

export default function NotasClient(props: {
  teacherName: string;
  teacherId: string;

  turmas: TurmaItem[];
  turmaId: string;

  avaliacoes: AvaliacaoItem[];
  avaliacaoId: string;

  alunos: AlunoNotaRow[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [draft, setDraft] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const a of props.alunos ?? []) {
      initial[a.alunoId] = a.nota == null ? "" : String(a.nota);
    }
    return initial;
  });

  useMemo(() => {
    const next: Record<string, string> = {};
    for (const a of props.alunos ?? []) {
      next[a.alunoId] = a.nota == null ? "" : String(a.nota);
    }
    setDraft(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.turmaId, props.avaliacaoId]);

  const filledCount = useMemo(() => {
    return Object.values(draft).filter((v) => v.trim() !== "").length;
  }, [draft]);

  const turmaTitle = useMemo(() => {
    const t = props.turmas.find((x) => x.id === props.turmaId);
    return t ? `${t.name}${t.tag ? ` - ${t.tag}` : ""}` : "Selecione uma turma";
  }, [props.turmas, props.turmaId]);

  const avaliacaoTitle = useMemo(() => {
    const a = props.avaliacoes.find((x) => x.id === props.avaliacaoId);
    return a ? a.label : "Selecione a avaliação";
  }, [props.avaliacoes, props.avaliacaoId]);

  function setQuery(nextTurmaId: string, nextAvaliacaoId?: string) {
    const params = new URLSearchParams();
    if (nextTurmaId) params.set("turmaId", nextTurmaId);
    if (nextAvaliacaoId) params.set("avaliacaoId", nextAvaliacaoId);
    router.push(`/professores/notas?${params.toString()}`);
  }

  function handleSave() {
    startTransition(async () => {
      const payload = Object.entries(draft)
        .filter(([, value]) => value.trim() !== "")
        .map(([alunoId, value]) => ({
          alunoId,
          nota: Number(value),
        }));

      await upsertGradesBulk({
        teacherId: props.teacherId,
        turmaId: props.turmaId,
        avaliacaoId: props.avaliacaoId,
        grades: payload,
      });

      // opcional: revalidar via server action e “atualizar” a página
      router.refresh();
    });
  }

  return (
    <div className="flex-1">
      <main className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-foreground text-2xl font-bold">Lançar Notas</h1>
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
                <Select
                  value={props.turmaId || undefined}
                  onValueChange={(value) => setQuery(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {props.turmas.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name} {t.tag ? `- ${t.tag}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Avaliação
                </Label>
                <Select
                  value={props.avaliacaoId || undefined}
                  onValueChange={(value) => setQuery(props.turmaId, value)}
                  disabled={!props.turmaId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a avaliação" />
                  </SelectTrigger>
                  <SelectContent>
                    {props.avaliacoes.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-card border-border/50 shadow-soft overflow-hidden rounded-2xl border">
            <div className="border-border border-b p-6">
              <h3 className="text-foreground text-lg font-semibold">
                {turmaTitle} - {avaliacaoTitle}
              </h3>
            </div>

            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                      Aluno
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                      Etiqueta
                    </TableHead>
                    <TableHead className="text-muted-foreground w-32 px-6 py-4 text-center text-sm font-medium">
                      Nota (0-10)
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {!props.turmaId || !props.avaliacaoId ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="px-6 py-8 text-center text-sm text-slate-500"
                      >
                        Selecione uma turma e uma avaliação para listar os
                        alunos.
                      </TableCell>
                    </TableRow>
                  ) : (props.alunos ?? []).length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="px-6 py-8 text-center text-sm text-slate-500"
                      >
                        Nenhum aluno vinculado a esta turma.
                      </TableCell>
                    </TableRow>
                  ) : (
                    (props.alunos ?? []).map((aluno, idx) => {
                      const initials = (aluno.alunoName || "A")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);

                      const zebra = idx % 2 === 1;

                      return (
                        <TableRow
                          key={aluno.alunoId}
                          className={`border-border/50 border-b last:border-0 ${zebra ? "bg-muted/10" : "bg-background"}`}
                        >
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                                <span className="text-primary text-sm font-semibold">
                                  {initials}
                                </span>
                              </div>
                              <span className="text-foreground text-sm font-medium">
                                {aluno.alunoName}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="text-muted-foreground px-6 py-4 text-sm">
                            {aluno.etiquetas ?? "-"}
                          </TableCell>

                          <TableCell className="px-6 py-4">
                            <Input
                              type="number"
                              className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring mx-auto flex h-10 w-24 rounded-md border px-3 py-2 text-center text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                              min="0"
                              max="10"
                              step="0.1"
                              placeholder="0.0"
                              value={draft[aluno.alunoId] ?? ""}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  [aluno.alunoId]: e.target.value,
                                }))
                              }
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="border-border bg-muted/20 flex items-center justify-between border-t p-6">
              <p className="text-muted-foreground text-sm">
                {filledCount} de {(props.alunos ?? []).length} notas preenchidas
              </p>

              <Button
                className="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap shadow-sm transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                onClick={handleSave}
                disabled={
                  isPending ||
                  !props.turmaId ||
                  !props.avaliacaoId ||
                  (props.alunos ?? []).length === 0
                }
              >
                <Save className="mr-2 h-4 w-4" />
                Salvar Notas
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
