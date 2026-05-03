"use client";

import AdminPeriodFilter from "@/app/_components/admin/AdminPeriodFilter";
import RegistrationBarChart from "@/app/_components/admin/RegistrationBarChart";
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
  FolderOpen,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

import type {
  DashboardStats,
  RegistrationStats,
} from "@/app/_lib/actions/dashboard";
import type { RecentAuditActivity } from "@/app/_lib/actions/audit";
import type { PendingDocumentRow } from "@/app/_lib/actions/documents";
import { markDocumentAsDelivered } from "@/app/_lib/actions/documents";

export default function PendingDocumentsClient({
  initialRows = [],
  stats,
  registrationStats = [],
  recentActivities = [],
}: {
  initialRows?: PendingDocumentRow[];
  stats: DashboardStats;
  registrationStats?: RegistrationStats[];
  recentActivities?: RecentAuditActivity[];
}) {
  const [renderedAt] = useState(() => Date.now());

  function formatRelativeTime(iso: string) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "-";
    const diffMs = renderedAt - date.getTime();
    const minuteMs = 60 * 1000;
    const hourMs = 60 * minuteMs;
    const dayMs = 24 * hourMs;

    if (diffMs < hourMs) {
      const minutes = Math.max(1, Math.floor(diffMs / minuteMs));
      return `Há ${minutes} min`;
    }
    if (diffMs < dayMs) {
      const hours = Math.floor(diffMs / hourMs);
      return `Há ${hours} h`;
    }
    const days = Math.floor(diffMs / dayMs);
    return `Há ${days} dia${days > 1 ? "s" : ""}`;
  }

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
      <main className="flex flex-1 flex-col">
        <div className="space-y-6">
          <div>
            <h1 className="text-foreground text-xl font-bold">Visão Geral</h1>
            <p className="text-muted-foreground">
              Acompanhe as principais métricas da instituição
            </p>
          </div>

          <div className="flex gap-3 flex-row justify-between">
            <StatCard
              label="Total de Alunos"
              value={stats.totalAlunos}
              icon={Users}
              className="w-full"
              variant="default"
            />
            <StatCard
              label="Turmas Ativas"
              value={stats.turmasAtivas}
              icon={FolderOpen}
              className="w-full"
              variant="success"
            />
            <StatCard
              label="Professores"
              value={stats.totalProfessores}
              icon={UserCheck}
              className="w-full"
              variant="muted"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="bg-card border-border/50 shadow-soft self-start rounded-2xl border p-6 lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-foreground text-base font-semibold">
                    Matrículas por Mês
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Últimos 6 meses
                  </p>
                </div>
                <AdminPeriodFilter />
              </div>
              <RegistrationBarChart data={registrationStats} />
            </div>

            <div className="bg-card border-border/50 shadow-soft self-start rounded-2xl border p-6">
              <h3 className="text-foreground mb-4 text-base font-semibold">
                Atividades Recentes
              </h3>
              <div className="max-h-72 space-y-4 overflow-y-auto pr-1">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <ActivityItem
                      key={activity.id}
                      title={activity.title}
                      description={activity.description}
                      time={formatRelativeTime(activity.actedAt)}
                      variant="primary"
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Sem atividades recentes no audit log.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-foreground text-base font-semibold">
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


