"use client";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { createDisciplina } from "@/app/_lib/actions/disciplinas";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function DisciplinaForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [conteudo, setConteudo] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !conteudo.trim()) {
      toast.error("Preencha nome e conteudo da disciplina.");
      return;
    }

    startTransition(async () => {
      try {
        await createDisciplina({
          name: name.trim(),
          conteudo: conteudo.trim(),
        });

        toast.success("Disciplina criada com sucesso.");
        setName("");
        setConteudo("");
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erro ao criar disciplina.",
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="space-y-2">
        <label htmlFor="disciplina-name" className="text-sm font-medium">
          Nome
        </label>
        <Input
          id="disciplina-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex.: Primeiros Socorros"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="disciplina-conteudo" className="text-sm font-medium">
          Conteudo
        </label>
        <Textarea
          id="disciplina-conteudo"
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          placeholder="Descreva o conteudo principal da disciplina"
          rows={6}
          required
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : "Criar disciplina"}
      </Button>
    </form>
  );
}
