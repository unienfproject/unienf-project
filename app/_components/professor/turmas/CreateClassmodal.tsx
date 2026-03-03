"use client";

import { useMemo, useState, useTransition } from "react";
import { createClass } from "@/app/_lib/actions/classes";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

type PickerItem = { id: string; label: string };

export default function CreateClassModal({
  teacherId,
  teacherName,
  subjects,
  students,
  onClose,
}: {
  teacherId: string;
  teacherName: string;
  subjects: PickerItem[];
  students: PickerItem[];
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const [startDate, setStartDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [endDate, setEndDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );

  const [subjectQuery, setSubjectQuery] = useState("");
  const [studentQuery, setStudentQuery] = useState("");

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const filteredSubjects = useMemo(() => {
    const q = subjectQuery.trim().toLowerCase();
    if (!q) return subjects;
    return subjects.filter((s) => s.label.toLowerCase().includes(q));
  }, [subjectQuery, subjects]);

  const filteredStudents = useMemo(() => {
    const q = studentQuery.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => s.label.toLowerCase().includes(q));
  }, [studentQuery, students]);

  const autoTag = useMemo(() => {
    const disciplinaNome =
      subjects.find((s) => s.id === selectedSubjectId)?.label ?? "";
    const inicio = startDate || "";
    const termino = endDate || startDate || "";

    if (!disciplinaNome || !teacherName || !inicio || !termino) return "";
    return `${disciplinaNome} - ${teacherName} - ${inicio} - ${termino}`;
  }, [subjects, selectedSubjectId, teacherName, startDate, endDate]);

  function toggleStudent(list: string[], id: string) {
    return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-lg">
        <div className="flex items-start justify-between gap-3 border-b p-5">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Nova turma</h3>
            <p className="text-sm text-slate-600">
              Defina dados, selecione uma disciplina e vincule alunos.
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

            if (!selectedSubjectId) {
              setError("Selecione uma disciplina.");
              return;
            }

            startTransition(async () => {
              try {
                await createClass({
                  teacherId,
                  startDate,
                  endDate,
                  subjectIds: [selectedSubjectId],
                  studentIds: selectedStudentIds,
                });
                onClose();
              } catch (err: unknown) {
                setError(
                  err instanceof Error ? err.message : "Erro ao criar turma.",
                );
              }
            });
          }}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Etiqueta (automática)">
              <Input
                value={autoTag}
                readOnly
                className="h-10 rounded-md border border-slate-200 px-3 text-sm"
                placeholder="Será gerada automaticamente"
              />
            </Field>

            <Field label="Início">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-10 rounded-md border border-slate-200 px-3 text-sm"
                required
              />
            </Field>

            <Field label="Término">
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-10 rounded-md border border-slate-200 px-3 text-sm"
                required
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Picker
              title="Disciplinas"
              query={subjectQuery}
              onQuery={setSubjectQuery}
              items={filteredSubjects}
              selectedIds={selectedSubjectId ? [selectedSubjectId] : []}
              onToggle={(id) =>
                setSelectedSubjectId((prev) => (prev === id ? null : id))
              }
              helper="Selecione a disciplina da turma."
            />

            <Picker
              title="Alunos"
              query={studentQuery}
              onQuery={setStudentQuery}
              items={filteredStudents}
              selectedIds={selectedStudentIds}
              onToggle={(id) =>
                setSelectedStudentIds((prev) => toggleStudent(prev, id))
              }
              helper="Opcional: vincule alunos agora, ou depois na tela de turma."
            />
          </div>

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
              {isPending ? "Salvando..." : "Criar turma"}
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

function Picker({
  title,
  helper,
  query,
  onQuery,
  items,
  selectedIds,
  onToggle,
}: {
  title: string;
  helper: string;
  query: string;
  onQuery: (v: string) => void;
  items: { id: string; label: string }[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-slate-900">{title}</h4>
          <p className="text-xs text-slate-600">{helper}</p>
        </div>
        <span className="text-xs font-medium text-slate-600">
          Selecionados: {selectedIds.length}
        </span>
      </div>

      <div className="mt-3">
        <Input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
          placeholder={`Buscar ${title.toLowerCase()}...`}
        />
      </div>

      <div className="mt-3 max-h-56 overflow-auto rounded-xl border border-slate-200">
        {items.map((it) => {
          const active = selectedIds.includes(it.id);
          return (
            <Button
              key={it.id}
              type="button"
              onClick={() => onToggle(it.id)}
              className={[
                "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm",
                "hover:bg-slate-50",
                active ? "bg-sky-50" : "bg-white",
              ].join(" ")}
            >
              <span className="text-slate-900">{it.label}</span>
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

        {!items.length ? (
          <div className="p-4 text-sm text-slate-500">Nenhum item encontrado.</div>
        ) : null}
      </div>
    </div>
  );
}
