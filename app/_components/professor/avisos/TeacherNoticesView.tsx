"use client";

import { useMemo, useState, useTransition } from "react";
import { createNotice } from "@/app/_lib/actions/notices";
import { NoticeRow } from "@/app/_lib/actions/notices";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Button } from "../../ui/button";

type PickerItem = { id: string; label: string };

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR");
  } catch {
    return iso;
  }
}

function Kpi({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="text-xs font-medium text-slate-600">{title}</span>
      <span className="text-2xl font-bold text-slate-900">{value}</span>
    </div>
  );
}

function CreateNoticeModal({
  teacherId,
  classes,
  students,
  onClose,
}: {
  teacherId: string;
  classes: { id: string; label: string }[];
  students: { id: string; label: string }[];
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [targetType, setTargetType] = useState<"turma" | "alunos">("turma");
  const [selectedClassId, setSelectedClassId] = useState<string>(
    classes[0]?.id ?? "",
  );

  const [studentQuery, setStudentQuery] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const filteredStudents = useMemo(() => {
    const q = studentQuery.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => s.label.toLowerCase().includes(q));
  }, [studentQuery, students]);

  function toggleStudent(id: string) {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-lg">
        <div className="flex items-start justify-between gap-3 border-b p-5">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Criar aviso
            </h3>
            <p className="text-sm text-slate-600">
              Envie para uma turma inteira ou selecione alunos manualmente.
            </p>
          </div>

          <Button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
          >
            Fechar
          </Button>
        </div>

        <form
          className="flex flex-col gap-5 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);

            if (!title.trim() || !message.trim()) {
              setError("Informe título e mensagem.");
              return;
            }

            if (targetType === "turma" && !selectedClassId) {
              setError("Selecione uma turma.");
              return;
            }

            if (targetType === "alunos" && selectedStudentIds.length === 0) {
              setError("Selecione ao menos um aluno.");
              return;
            }

            startTransition(async () => {
              try {
                await createNotice({
                  teacherId,
                  title: title.trim(),
                  message: message.trim(),
                  target:
                    targetType === "turma"
                      ? { type: "turma", classId: selectedClassId }
                      : { type: "alunos", studentIds: selectedStudentIds },
                });
                onClose();
              } catch (err: unknown) {
                setError(
                  err instanceof Error ? err.message : "Erro ao criar aviso.",
                );
              }
            });
          }}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Título">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 rounded-md border border-slate-200 px-3 text-sm"
                placeholder="Ex.: Aviso de prova"
                required
              />
            </Field>

            <Field label="Destino">
              <Select
                value={targetType}
                onValueChange={(value) =>
                  setTargetType(value as "turma" | "alunos")
                }
              >
                <SelectTrigger className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="turma">Turma inteira</SelectItem>
                  <SelectItem value="alunos">Selecionar alunos</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Mensagem">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] rounded-md border border-slate-200 px-3 py-2 text-sm"
              placeholder="Digite o aviso..."
              required
            />
          </Field>

          {targetType === "turma" ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-slate-900">
                    Selecionar turma
                  </h4>
                  <p className="text-xs text-slate-600">
                    Envia para todos os alunos vinculados à turma.
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <Select
                  value={selectedClassId}
                  onValueChange={setSelectedClassId}
                >
                  <SelectTrigger className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-slate-900">
                    Selecionar alunos
                  </h4>
                  <p className="text-xs text-slate-600">
                    Selecione manualmente alunos unitários ou múltiplos.
                  </p>
                </div>

                <span className="text-xs font-medium text-slate-600">
                  Selecionados: {selectedStudentIds.length}
                </span>
              </div>

              <div className="mt-3">
                <Input
                  value={studentQuery}
                  onChange={(e) => setStudentQuery(e.target.value)}
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  placeholder="Buscar aluno..."
                />
              </div>

              <div className="mt-3 max-h-56 overflow-auto rounded-xl border border-slate-200">
                {filteredStudents.map((s) => {
                  const active = selectedStudentIds.includes(s.id);
                  return (
                    <Button
                      key={s.id}
                      type="button"
                      onClick={() => toggleStudent(s.id)}
                      className={[
                        "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm",
                        "hover:bg-slate-50",
                        active ? "bg-sky-50" : "bg-white",
                      ].join(" ")}
                    >
                      <span className="text-slate-900">{s.label}</span>
                      <span
                        className={[
                          "rounded-full px-2 py-1 text-xs font-medium",
                          active
                            ? "bg-sky-100 text-sky-700"
                            : "bg-slate-100 text-slate-700",
                        ].join(" ")}
                      >
                        {active ? "Selecionado" : "Selecionar"}
                      </span>
                    </Button>
                  );
                })}

                {!filteredStudents.length ? (
                  <div className="p-4 text-sm text-slate-500">
                    Nenhum aluno encontrado.
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex items-center justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="h-10 rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              Cancelar
            </Button>
            <Button
              disabled={isPending}
              type="submit"
              className="h-10 rounded-md bg-sky-500 px-4 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-60"
            >
              {isPending ? "Enviando..." : "Publicar aviso"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </div>
  );
}

export default function TeacherNoticesView({
  teacherId,
  teacherName,
  notices,
  classes,
  students,
}: {
  teacherId: string;
  teacherName: string;
  notices: NoticeRow[];
  classes: PickerItem[];
  students: PickerItem[];
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"todos" | "meus" | "coord_admin">(
    "todos",
  );
  const [openCreate, setOpenCreate] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let base = notices;

    if (filter === "meus") {
      base = base.filter(
        (n) => n.author_role === "professor" && n.author_name === teacherName,
      );
    }
    if (filter === "coord_admin") {
      base = base.filter((n) => n.author_role !== "professor");
    }

    if (!q) return base;
    return base.filter((n) =>
      `${n.title} ${n.message} ${n.author_name}`.toLowerCase().includes(q),
    );
  }, [notices, query, filter, teacherName]);

  return (
    <div className="flex flex-col gap-6">
      <main className="p-4">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Avisos</h1>
          <p className="text-slate-600">
            Professor: {teacherName}. <br/>
            Visualize avisos e envie comunicados para alunos ou turmas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-600">Buscar</span>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 w-[280px] rounded-md border border-slate-200 bg-white px-3 text-sm"
              placeholder="Título, mensagem ou autor..."
            />
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-xs text-slate-600">Filtro</span>
            <Select
              value={filter}
              onValueChange={(value) =>
                setFilter(value as "todos" | "meus" | "coord_admin")
              }
            >
              <SelectTrigger className="h-10 w-[220px] rounded-md border border-slate-200 bg-white px-3 text-sm">
                <SelectValue placeholder="Filtrar avisos..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="meus">Meus avisos</SelectItem>
                <SelectItem value="coord_admin">
                  Coordenação/Administrativo
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            onClick={() => setOpenCreate(true)}
            className="h-10 rounded-md bg-sky-500 px-4 text-sm font-medium text-white hover:bg-sky-600"
          >
            Criar aviso
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Kpi title="Total de avisos" value={String(notices.length)} />
        <Kpi
          title="De coordenação/admin"
          value={String(
            notices.filter((n) => n.author_role !== "professor").length,
          )}
        />
        <Kpi
          title="Meus avisos"
          value={String(
            notices.filter((n) => n.author_role === "professor").length,
          )}
        />
      </div>

      <div className="overflow-hidden gap-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b p-4">
          <h2 className="font-semibold text-slate-900">Últimos avisos</h2>
          <p className="text-sm text-slate-600">
            Lista de avisos visíveis para você.
          </p>
        </div>

        <div className="divide-y gap-4">
          {filtered.map((n) => (
            <div key={n.id} className="p-4 gap-4 flex flex-col">
              <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                <div className="flex flex-col">
                  <h3 className="text-base font-semibold text-slate-900">
                    {n.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {n.author_name} • {n.author_role} •{" "}
                    {formatDate(n.created_at)}
                  </p>
                </div>

                <span className="mt-2 inline-flex w-fit rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 md:mt-0">
                  {n.audience.type === "turma"
                    ? `Turma: ${n.audience.classLabel}`
                    : `Alunos: ${n.audience.studentCount}`}
                </span>
              </div>

              <p className="mt-3 text-sm whitespace-pre-line text-slate-700">
                {n.message}
              </p>
            </div>
          ))}

          {!filtered.length ? (
            <div className="p-6 text-center text-slate-500">
              Nenhum aviso encontrado.
            </div>
          ) : null}
        </div>
        
      </div>
      </main>

      {openCreate ? (
        <CreateNoticeModal
          teacherId={teacherId}
          classes={classes}
          students={students}
          onClose={() => setOpenCreate(false)}
        />
      ) : null}
    </div>
  );
}
