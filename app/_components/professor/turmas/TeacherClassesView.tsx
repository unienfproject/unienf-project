"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import AttendanceModal from "./AttendanceModal";
import {
  EllipsisVertical,
  Eye,
  GraduationCap,
  NotebookPen,
} from "lucide-react";

function Kpi({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="text-xs font-medium text-slate-600">{title}</span>
      <span className="text-2xl font-bold text-slate-900">{value}</span>
    </div>
  );
}

type ClassRow = {
  id: string;
  name: string;
  tag: string;
  start_date: string;
  end_date: string;
  status: "ativa" | "finalizada";
};

export default function TeacherClassesView({
  teacherName,
  classes,
}: {
  teacherName: string;
  classes: ClassRow[];
}) {
  const [query, setQuery] = useState("");
  const [attendanceClass, setAttendanceClass] = useState<ClassRow | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return classes;
    return classes.filter((t) =>
      `${t.name} ${t.tag}`.toLowerCase().includes(q),
    );
  }, [classes, query]);

  return (
    <div className="flex flex-col">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-slate-900">
              Minhas Turmas
            </h1>
            <p className="text-slate-600">
              Professor: {teacherName}. <br />
              Consulte suas turmas, lance notas e registre frequencia.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-600">Buscar</span>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm md:w-[280px]"
                placeholder="Digite nome ou etiqueta..."
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Kpi
            title="Turmas ativas"
            value={String(classes.filter((c) => c.status === "ativa").length)}
          />
          <Kpi
            title="Turmas finalizadas"
            value={String(
              classes.filter((c) => c.status === "finalizada").length,
            )}
          />
          <Kpi title="Total de turmas" value={String(classes.length)} />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b px-5 py-5">
            <h2 className="font-semibold text-slate-900">Turmas</h2>
            <p className="mt-1 text-sm text-slate-600">
              Apenas turmas criadas por voce ou vinculadas a voce.
            </p>
          </div>

          <div className="w-full">
            <Table className="table-fixed w-full text-sm [&_td]:whitespace-normal [&_th]:whitespace-normal">
              <TableHeader className="border-b bg-slate-50">
                <TableRow>
                  <TableHead className="w-[26%] px-4 py-4 text-left font-semibold text-slate-700">
                    Turma
                  </TableHead>
                  <TableHead className="w-[32%] px-4 py-4 text-left font-semibold text-slate-700">
                    Etiqueta
                  </TableHead>
                  <TableHead className="w-[12%] px-4 py-4 text-left font-semibold text-slate-700">
                    Inicio
                  </TableHead>
                  <TableHead className="w-[12%] px-4 py-4 text-left font-semibold text-slate-700">
                    Termino
                  </TableHead>
                  <TableHead className="w-[10%] px-4 py-4 text-left font-semibold text-slate-700">
                    Status
                  </TableHead>
                  <TableHead className="w-[8%] px-4 py-4 text-right font-semibold text-slate-700">
                    Acoes
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id} className="border-b last:border-b-0">
                    <TableCell className="px-4 py-4 align-top font-medium text-slate-900">
                      <span className="block break-words leading-5">{c.name}</span>
                    </TableCell>
                    <TableCell className="px-4 py-4 align-top text-slate-700">
                      <span className="block break-words leading-5">{c.tag}</span>
                    </TableCell>
                    <TableCell className="px-4 py-4 align-top text-slate-700">
                      {c.start_date}
                    </TableCell>
                    <TableCell className="px-4 py-4 align-top text-slate-700">
                      {c.end_date}
                    </TableCell>
                    <TableCell className="px-4 py-4 align-top">
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                          c.status === "ativa"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-700",
                        ].join(" ")}
                      >
                        {c.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-right align-top">
                      <div className="flex items-center justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100"
                              aria-label="Acoes da turma"
                            >
                              <EllipsisVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuLabel>Acoes</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/professores/turmas/${c.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver turma
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/professores/turmas/${c.id}`}>
                                <GraduationCap className="mr-2 h-4 w-4" />
                                Lancar notas
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setAttendanceClass(c)}>
                              <NotebookPen className="mr-2 h-4 w-4" />
                              Frequencia
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {!filtered.length ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="p-6 text-center text-slate-500"
                    >
                      Nenhuma turma encontrada.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>

          <div className="border-t p-4 text-xs text-slate-500">
            Ao finalizar uma turma, voce encerra lancamentos e gera base para
            relatorio (impressao via coordenacao/administrativo).
          </div>
        </div>
      </div>

      <AttendanceModal
        turma={attendanceClass}
        open={attendanceClass !== null}
        onOpenChange={(open) => {
          if (!open) setAttendanceClass(null);
        }}
      />
    </div>
  );
}
