"use client";

import { finalizeClass } from "@/app/_lib/actions/classes";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

function Kpi({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="text-xs font-medium text-slate-600">{title}</span>
      <span className="text-2xl font-bold text-slate-900">{value}</span>
    </div>
  );
}

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
import CreateClassModal from "./CreateClassmodal";
import { Input } from "../../ui/input";

type ClassRow = {
  id: string;
  name: string;
  tag: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  status: "ativa" | "finalizada";
};

type PickerItem = { id: string; label: string };

export default function TeacherClassesView({
  teacherId,
  teacherName,
  classes,
  subjects,
  students,
}: {
  teacherId: string;
  teacherName: string;
  classes: ClassRow[];
  subjects: PickerItem[];
  students: PickerItem[];
}) {
  const [query, setQuery] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return classes;
    return classes.filter((t) =>
      `${t.name} ${t.tag}`.toLowerCase().includes(q),
    );
  }, [classes, query]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 p-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Minhas Turmas</h1>
          <p className="text-slate-600">
            Professor: {teacherName}. <br />
            Aqui você gerencia turmas, alunos, notas e frequência.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-600">Buscar</span>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 w-[260px] rounded-md border border-slate-200 bg-white px-3 text-sm"
              placeholder="Digite nome ou etiqueta..."
            />
          </div>

          <Button
            type="button"
            onClick={() => setOpenCreate(true)}
            className="bg-primary hover:bg-primary h-10 rounded-md px-4 text-sm font-medium text-white"
          >
            Nova turma
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 p-6 md:grid-cols-3">
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

      {/* Tabela */}
      <div className="m-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b p-4">
          <h2 className="font-semibold text-slate-900">Turmas</h2>
          <p className="text-sm text-slate-600">
            Apenas turmas criadas por você ou vinculadas a você.
          </p>
        </div>

        <div className="overflow-auto">
          <Table className="w-full min-w-[1100px] text-sm">
            <TableHeader className="border-b bg-slate-50">
              <TableRow>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Turma
                </TableHead>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Etiqueta
                </TableHead>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Início
                </TableHead>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Término
                </TableHead>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Status
                </TableHead>
                <TableHead className="p-3 text-left font-semibold text-slate-700">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} className="border-b last:border-b-0">
                  <TableCell className="p-3 font-medium text-slate-900">
                    {c.name}
                  </TableCell>
                  <TableCell className="p-3 text-slate-700">{c.tag}</TableCell>
                  <TableCell className="p-3 text-slate-700">
                    {c.start_date}
                  </TableCell>
                  <TableCell className="p-3 text-slate-700">
                    {c.end_date}
                  </TableCell>
                  <TableCell className="p-3">
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

                  <TableCell className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/professores/turmas/${c.id}`}
                        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 hover:bg-slate-50"
                      >
                        Ver Turma
                      </Link>

                      <Link
                        href={`/professores/turmas/${c.id}/notas`}
                        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 hover:bg-slate-50"
                      >
                        Lançar Notas
                      </Link>

                      <Link
                        href={`/professores/turmas/${c.id}/frequencia`}
                        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 hover:bg-slate-50"
                      >
                        Frequência
                      </Link>

                      <Button
                        type="button"
                        disabled={isPending || c.status === "finalizada"}
                        onClick={() => {
                          startTransition(async () => {
                            await finalizeClass({ classId: c.id, teacherId });
                          });
                        }}
                        className="rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
                      >
                        Finalizar
                      </Button>
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
          Ao finalizar uma turma, você encerra lançamentos e gera base para
          relatório (impressão via coordenação/administrativo).
        </div>
      </div>

      {openCreate ? (
        <CreateClassModal
          teacherId={teacherId}
          subjects={subjects}
          students={students}
          onClose={() => setOpenCreate(false)}
        />
      ) : null}
    </div>
  );
}
