"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Textarea } from "@/app/_components/ui/textarea";
import {
  createDisciplina,
  updateProfessorDisciplinaEmenta,
  type ProfessorDisciplinaRow,
} from "@/app/_lib/actions/disciplinas";
import { notifyDataChanged } from "@/app/_lib/client/dataRefresh";
import { BookOpen, Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type Props = {
  disciplinas: ProfessorDisciplinaRow[];
};

export default function ProfessorDisciplinasView({ disciplinas }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<ProfessorDisciplinaRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newConteudo, setNewConteudo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [pending, startTransition] = useTransition();

  function openEdit(disciplina: ProfessorDisciplinaRow) {
    setEditing(disciplina);
    setConteudo(disciplina.conteudo ?? "");
  }

  function handleSave() {
    if (!editing) return;
    if (!conteudo.trim()) {
      toast.error("Informe a ementa da disciplina.");
      return;
    }

    startTransition(async () => {
      try {
        await updateProfessorDisciplinaEmenta({
          disciplinaId: editing.id,
          conteudo: conteudo.trim(),
        });
        toast.success("Ementa atualizada.");
        setEditing(null);
        notifyDataChanged(router);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erro ao atualizar ementa.",
        );
      }
    });
  }

  function handleCreate() {
    if (!newName.trim() || !newConteudo.trim()) {
      toast.error("Preencha nome e ementa da disciplina.");
      return;
    }

    startTransition(async () => {
      try {
        await createDisciplina({
          name: newName.trim(),
          conteudo: newConteudo.trim(),
        });
        toast.success("Disciplina criada.");
        setNewName("");
        setNewConteudo("");
        setCreating(false);
        notifyDataChanged(router);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erro ao criar disciplina.",
        );
      }
    });
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Disciplinas</h1>
          <p className="text-slate-600">
            Consulte as disciplinas vinculadas às suas turmas e edite a ementa.
          </p>
        </div>

        <Button type="button" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          Nova disciplina
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b p-4">
          <h2 className="font-semibold text-slate-900">Minhas disciplinas</h2>
          <p className="text-sm text-slate-600">
            {disciplinas.length} disciplina
            {disciplinas.length !== 1 ? "s" : ""} encontrada
            {disciplinas.length !== 1 ? "s" : ""}.
          </p>
        </div>

        <div className="divide-y divide-slate-200">
          {disciplinas.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              Nenhuma disciplina vinculada ao seu perfil.
            </div>
          ) : (
            disciplinas.map((disciplina) => (
              <div
                key={disciplina.id}
                className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[1fr_auto] lg:items-start"
              >
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50">
                    <BookOpen className="h-5 w-5 text-sky-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900">
                        {disciplina.name}
                      </h3>
                      {disciplina.createdByMe ? (
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                          Criada por você
                        </span>
                      ) : null}
                      {disciplina.turmaCount > 0 ? (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                          Em suas turmas
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-sm text-slate-600">
                      {disciplina.conteudo || "Ementa não informada."}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openEdit(disciplina)}
                  className="w-fit"
                >
                  <Pencil className="h-4 w-4" />
                  Editar ementa
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Editar ementa{editing ? ` - ${editing.name}` : ""}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              value={conteudo}
              onChange={(event) => setConteudo(event.target.value)}
              rows={10}
              placeholder="Descreva a ementa da disciplina"
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(null)}
                disabled={pending}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={handleSave} disabled={pending}>
                {pending ? "Salvando..." : "Salvar ementa"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={creating}
        onOpenChange={(open) => {
          setCreating(open);
          if (!open) {
            setNewName("");
            setNewConteudo("");
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova disciplina</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="new-disciplina-name"
                className="text-sm font-medium text-slate-700"
              >
                Nome
              </label>
              <input
                id="new-disciplina-name"
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm"
                placeholder="Ex.: Primeiros Socorros"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="new-disciplina-conteudo"
                className="text-sm font-medium text-slate-700"
              >
                Ementa
              </label>
              <Textarea
                id="new-disciplina-conteudo"
                value={newConteudo}
                onChange={(event) => setNewConteudo(event.target.value)}
                rows={10}
                placeholder="Descreva a ementa da disciplina"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreating(false)}
                disabled={pending}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={handleCreate} disabled={pending}>
                {pending ? "Salvando..." : "Criar disciplina"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
