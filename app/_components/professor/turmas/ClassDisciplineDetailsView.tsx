"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  GraduationCap,
  Mail,
  Save,
  UserRound,
  Users,
} from "lucide-react";

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
import { upsertTurmaGradesAccess } from "@/app/_lib/actions/notas";
import type { StudentForGradesRow } from "@/app/_lib/actions/notas";
import { notifyDataChanged } from "@/app/_lib/client/dataRefresh";
import ManageStudentsModal from "@/app/_components/professor/turmas/ManageStudentsModal";
import RemoveStudentButton from "@/app/_components/professor/turmas/RemoveStudentButton";

type Student = {
  id: string;
  name: string;
  email: string;
};

type PickerItem = { id: string; label: string; description?: string | null };

type ClassDetails = {
  id: string;
  tag: string;
  startDate: string;
  endDate: string;
  status: "ativa" | "finalizada" | string;
  disciplinaName: string | null;
  professorId: string | null;
  professorName: string | null;
  students: Student[];
};

type AssessmentItem = { id: string; label: string };

function formatDate(value: string) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function initials(name: string) {
  return (name || "A")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ClassDisciplineDetailsView({
  details,
  assessments,
  selectedAssessmentId,
  gradeRows,
  backHref,
  profileHrefPrefix,
  baseHref,
  teacherId,
  allStudents = [],
  canManageStudents = false,
  canEditGrades = true,
}: {
  details: ClassDetails;
  assessments: AssessmentItem[];
  selectedAssessmentId: string;
  gradeRows: StudentForGradesRow[];
  backHref: string;
  profileHrefPrefix: string;
  baseHref: string;
  teacherId?: string;
  allStudents?: PickerItem[];
  canManageStudents?: boolean;
  canEditGrades?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [draftByAssessment, setDraftByAssessment] = useState<
    Record<string, Record<string, string>>
  >({});

  const currentDraft = draftByAssessment[selectedAssessmentId] ?? {};
  const valueForRow = (row: StudentForGradesRow) =>
    currentDraft[row.alunoId] ?? (row.nota == null ? "" : String(row.nota));
  const filledCount = gradeRows.filter((row) => valueForRow(row) !== "").length;
  const activeAssessment = assessments.find(
    (assessment) => assessment.id === selectedAssessmentId,
  );

  function handleAssessmentChange(value: string) {
    const params = new URLSearchParams();
    params.set("avaliacaoId", value);
    router.push(`${baseHref}?${params.toString()}`);
  }

  function handleSave() {
    if (!canEditGrades) return;

    startTransition(async () => {
      const grades = gradeRows
        .map((row) => ({
          alunoId: row.alunoId,
          notaValue: valueForRow(row),
        }))
        .filter((row) => row.notaValue.trim() !== "")
        .map((row) => ({ alunoId: row.alunoId, nota: Number(row.notaValue) }));

      await upsertTurmaGradesAccess({
        turmaId: details.id,
        avaliacaoId: selectedAssessmentId,
        grades,
      });

      notifyDataChanged(router);
    });
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] w-full flex-1 flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <Link href={backHref}>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <p className="text-sm font-medium text-slate-500">
              Detalhes da disciplina
            </p>
            <h1 className="text-2xl font-bold text-slate-900">
              {details.disciplinaName || "Disciplina sem nome"}
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">
              {details.tag}
            </p>
          </div>
        </div>

        <span
          className={[
            "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold",
            details.status === "ativa"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-700",
          ].join(" ")}
        >
          {details.status}
        </span>
      </div>

      <section className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <BookOpen className="h-4 w-4" />
            <span className="text-xs font-medium">Disciplina</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {details.disciplinaName || "-"}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <UserRound className="h-4 w-4" />
            <span className="text-xs font-medium">Professor</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {details.professorName || "-"}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <Calendar className="h-4 w-4" />
            <span className="text-xs font-medium">Período</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {formatDate(details.startDate)} até {formatDate(details.endDate)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <Users className="h-4 w-4" />
            <span className="text-xs font-medium">Alunos</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {details.students.length}
          </p>
        </div>
      </section>

      <section className="grid min-h-[520px] flex-1 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_440px] 2xl:grid-cols-[minmax(0,1fr)_480px]">
        <div className="flex min-h-[520px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Alunos cadastrados
              </h2>
              <p className="text-sm text-slate-600">
                Clique no perfil para consultar os dados do aluno.
              </p>
            </div>
            {canManageStudents && details.status === "ativa" ? (
              <ManageStudentsModal
                classId={details.id}
                teacherId={teacherId}
                currentStudents={details.students}
                allStudents={allStudents}
              />
            ) : null}
          </div>

          <div className="flex-1 overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="px-4 py-3">Aluno</TableHead>
                  <TableHead className="px-4 py-3">Email</TableHead>
                  <TableHead className="px-4 py-3 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details.students.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      Nenhum aluno vinculado a esta turma.
                    </TableCell>
                  </TableRow>
                ) : (
                  details.students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                            {initials(student.name)}
                          </div>
                          <span className="font-medium text-slate-900">
                            {student.name || "Aluno"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          {student.email || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Link href={`${profileHrefPrefix}/${student.id}`}>
                            <Button variant="outline" size="sm">
                              Ver Perfil
                            </Button>
                          </Link>
                          {canManageStudents && details.status === "ativa" ? (
                            <RemoveStudentButton
                              classId={details.id}
                              studentId={student.id}
                              teacherId={teacherId}
                            />
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex min-h-[520px] flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b p-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-slate-500" />
              <h2 className="font-semibold text-slate-900">
                Notas de atividades
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Selecione a avaliação e informe as notas dos alunos.
            </p>
          </div>

          <div className="flex flex-1 flex-col space-y-4 p-4">
            <div className="space-y-2">
              <Label>Avaliação</Label>
              <Select
                value={selectedAssessmentId || undefined}
                onValueChange={handleAssessmentChange}
                disabled={assessments.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a avaliação" />
                </SelectTrigger>
                <SelectContent>
                  {assessments.map((assessment) => (
                    <SelectItem key={assessment.id} value={assessment.id}>
                      {assessment.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto rounded-md border">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="px-3 py-2">Aluno</TableHead>
                    <TableHead className="w-28 px-3 py-2 text-center">
                      Nota
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!selectedAssessmentId ? (
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        className="px-3 py-8 text-center text-sm text-slate-500"
                      >
                        Nenhuma avaliação selecionada.
                      </TableCell>
                    </TableRow>
                  ) : gradeRows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        className="px-3 py-8 text-center text-sm text-slate-500"
                      >
                        Nenhum aluno para lançar nota.
                      </TableCell>
                    </TableRow>
                  ) : (
                    gradeRows.map((row) => (
                      <TableRow key={row.alunoId}>
                        <TableCell className="px-3 py-2 text-sm font-medium text-slate-900">
                          {row.alunoName}
                        </TableCell>
                        <TableCell className="px-3 py-2">
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            placeholder="0.0"
                            className="h-9 text-center"
                            value={valueForRow(row)}
                            disabled={!canEditGrades}
                            onChange={(event) =>
                              setDraftByAssessment((prev) => ({
                                ...prev,
                                [selectedAssessmentId]: {
                                  ...(prev[selectedAssessmentId] ?? {}),
                                  [row.alunoId]: event.target.value,
                                },
                              }))
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                {activeAssessment
                  ? `${filledCount} de ${gradeRows.length} notas preenchidas`
                  : "Escolha uma avaliação para lançar notas"}
              </p>
              <Button
                onClick={handleSave}
                disabled={
                  isPending ||
                  !selectedAssessmentId ||
                  gradeRows.length === 0 ||
                  details.status === "finalizada"
                  || !canEditGrades
                }
              >
                <Save className="h-4 w-4" />
                {isPending ? "Salvando..." : "Salvar Notas"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
