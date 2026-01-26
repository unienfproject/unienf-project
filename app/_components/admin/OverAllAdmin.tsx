"use client";

import PeriodRangeButton from "@/app/_components/admin/PeriodRangeButton";
import ActivityItem from "@/app/_components/aluno/ActivityItem";
import StatCard from "@/app/_components/StatCard";
import { Button } from "@/app/_components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import {
  Check,
  FileText,
  FolderOpen,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

import type { DashboardStats, RegistrationStats } from "@/app/_lib/actions/dashboard";
import type { PendingDocumentRow } from "@/app/_lib/actions/documents";
import { markDocumentAsDelivered } from "@/app/_lib/actions/documents";

export default function PendingDocumentsClient({
  initialRows = [],
  stats,
  registrationStats = [],
}: {
  initialRows?: PendingDocumentRow[];
  stats: DashboardStats;
  registrationStats?: RegistrationStats[];
}) {
  const [rows, setRows] = useState<PendingDocumentRow[]>(initialRows);
  const [isPending, startTransition] = useTransition();

  function handleCheck(documentId: string) {
    startTransition(async () => {
      await markDocumentAsDelivered({ documentId });
      setRows((prev) => prev.filter((r) => r.documentId !== documentId));
    });
  }

  return (
    <main className="flex-1">
      <main className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-foreground text-2xl font-bold">Visão Geral</h1>
            <p className="text-muted-foreground">
              Acompanhe as principais métricas da instituição
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total de Alunos"
              value={stats.totalAlunos}
              icon={Users}
              variant="default"
            />
            <StatCard
              label="Turmas Ativas"
              value={stats.turmasAtivas}
              icon={FolderOpen}
              variant="success"
            />
            <StatCard
              label="Professores"
              value={stats.totalProfessores}
              icon={UserCheck}
              variant="muted"
            />
            <StatCard
              label="Documentos Pendentes"
              value={stats.documentosPendentes}
              icon={FileText}
              variant="warning"
            />
          </div>

          {/* restante do layout permanece igual */}
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
                <PeriodRangeButton />
              </div>
              {registrationStats.length > 0 ? (
                <div className="flex h-64 items-end gap-2 pt-4">
                  {registrationStats.map((d) => {
                    const max = Math.max(...registrationStats.map((s) => s.count), 1);
                    const heightPct = (d.count / max) * 100;
                    return (
                      <div key={d.label} className="group relative flex flex-1 flex-col items-center gap-2">
                        <div
                          className="w-full min-h-[4px] rounded-t-md bg-sky-500 transition-all hover:bg-sky-600"
                          style={{ height: `${heightPct}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                            {d.count} alunos
                          </div>
                        </div>
                        <span className="text-xs text-slate-600 whitespace-nowrap">{d.label}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-muted/30 flex h-64 items-center justify-center rounded-xl">
                  <div className="text-center">
                    <TrendingUp className="text-primary mx-auto mb-3 h-12 w-12" />
                    <p className="text-muted-foreground">Sem dados no período</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Atividades Recentes
              </h3>
              <div className="space-y-4">
                <ActivityItem
                  title="Novo aluno matriculado"
                  description="Maria Silva"
                  time="Há 2 horas"
                  variant="primary"
                />
                <ActivityItem
                  title="Documentos aprovados"
                  description="João Santos"
                  time="Há 3 horas"
                  variant="primary"
                />
                <ActivityItem
                  title="Nota lançada"
                  description="Prof. Ana Costa"
                  time="Há 5 horas"
                  variant="primary"
                />
                <ActivityItem
                  title="Nova turma criada"
                  description="Turma 2024.1"
                  time="Há 1 dia"
                  variant="primary"
                />
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
            </div>

            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-border border-b">
                    <TableHead className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                      Aluno
                    </TableHead>
                    <TableHead className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                      Documento
                    </TableHead>
                    <TableHead className="text-muted-foreground px-4 py-3 text-right text-sm font-medium">
                      Ação
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.documentId}
                      className="border-border/50 border-b last:border-0"
                    >
                      <TableCell className="text-foreground px-4 py-3 text-sm">
                        {row.alunoName}
                      </TableCell>

                      <TableCell className="text-foreground px-4 py-3 text-sm">
                        {row.documentTypeName}
                      </TableCell>

                      <TableCell className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            className="gap-2"
                            disabled={isPending}
                            onClick={() => handleCheck(row.documentId)}
                            title="Marcar como entregue"
                          >
                            <Check className="h-4 w-4" />
                            Check
                          </Button>

                          <Button asChild size="sm" variant="outline">
                            <Link
                              href={`/recepcao/alunos/${row.alunoId}/documentos`}
                            >
                              Ver documentos
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {!rows.length && (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-muted-foreground py-8 text-center text-sm"
                      >
                        Nenhum documento pendente de verificação.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
    </main>
  );
}
