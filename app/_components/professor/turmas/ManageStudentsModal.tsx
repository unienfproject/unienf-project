"use client";

import { useState, useTransition } from "react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { addStudentToClass, removeStudentFromClass } from "@/app/_lib/actions/classes";
import { useRouter } from "next/navigation";
import { X, Plus, Search } from "lucide-react";

type Student = {
  id: string;
  name: string;
  email: string;
};

type PickerItem = { id: string; label: string };

export default function ManageStudentsModal({
  classId,
  teacherId,
  currentStudents,
  allStudents,
}: {
  classId: string;
  teacherId: string;
  currentStudents: Student[];
  allStudents: PickerItem[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const currentStudentIds = new Set(currentStudents.map((s) => s.id));

  const availableStudents = allStudents.filter(
    (s) => !currentStudentIds.has(s.id),
  );

  const filteredStudents = availableStudents.filter((s) =>
    s.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function handleAdd(studentId: string) {
    startTransition(async () => {
      try {
        await addStudentToClass({
          classId,
          studentId,
          teacherId,
        });
        router.refresh();
      } catch (error) {
        alert(error instanceof Error ? error.message : "Erro ao adicionar aluno.");
      }
    });
  }

  function handleRemove(studentId: string) {
    if (!confirm("Tem certeza que deseja remover este aluno da turma?")) {
      return;
    }

    startTransition(async () => {
      try {
        await removeStudentFromClass({
          classId,
          studentId,
          teacherId,
        });
        router.refresh();
      } catch (error) {
        alert(error instanceof Error ? error.message : "Erro ao remover aluno.");
      }
    });
  }

  if (!open) {
    return (
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-primary hover:bg-primary h-10 rounded-md px-4 text-sm font-medium text-white"
      >
        <Plus className="mr-2 h-4 w-4" />
        Gerenciar Alunos
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-lg">
        <div className="flex items-start justify-between gap-3 border-b p-5">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Gerenciar Alunos
            </h3>
            <p className="text-sm text-slate-600">
              Adicione ou remova alunos desta turma
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-5 p-5">
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">
              Alunos na Turma ({currentStudents.length})
            </h4>
            {currentStudents.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhum aluno na turma.</p>
            ) : (
              <div className="space-y-2">
                {currentStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {student.name}
                      </p>
                      <p className="text-xs text-slate-600">{student.email}</p>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemove(student.id)}
                      disabled={isPending}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">
              Adicionar Alunos ({availableStudents.length} disponíveis)
            </h4>
            <div className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar aluno..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {filteredStudents.length === 0 ? (
                <p className="text-sm text-slate-500">
                  {query.trim()
                    ? "Nenhum aluno encontrado."
                    : "Todos os alunos já estão na turma."}
                </p>
              ) : (
                filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3"
                  >
                    <p className="text-sm font-medium text-slate-900">
                      {student.label}
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleAdd(student.id)}
                      disabled={isPending}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="border-t p-4">
          <Button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}

