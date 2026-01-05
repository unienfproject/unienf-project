"use client";

import { useTransition } from "react";
import { Button } from "@/app/_components/ui/button";
import { removeStudentFromClass } from "@/app/_lib/actions/classes";
import { useRouter } from "next/navigation";

export default function RemoveStudentButton({
  classId,
  studentId,
  teacherId,
}: {
  classId: string;
  studentId: string;
  teacherId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleRemove() {
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

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      className="text-xs"
      onClick={handleRemove}
      disabled={isPending}
    >
      Remover
    </Button>
  );
}

