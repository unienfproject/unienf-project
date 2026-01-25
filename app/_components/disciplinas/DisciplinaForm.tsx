"use client";

import { useState } from "react";
import { createDisciplina } from "@/app/_lib/actions/disciplinas";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { FieldLabel } from "../ui/field";

export default function DisciplinaForm() {
  const [name, setName] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await createDisciplina({ name, conteudo });
      setName("");
      setConteudo("");
      alert("Disciplina criada com sucesso");
    } catch {
      alert("Erro ao criar disciplina");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <FieldLabel className="block text-sm font-medium">Nome da disciplina</FieldLabel>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 rounded-md border px-3 py-2"
          required
        />
      </div>

      <div>
        <FieldLabel className="block text-sm font-medium">
          Conteúdo da Disciplina
        </FieldLabel>
        <Textarea
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          rows={6}
          className="w-full mt-1 rounded-md border px-3 py-2"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="cursor-pointer rounded-md bg-primary px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Salvando..." : "Criar disciplina"}
      </Button>
    </form>
  );
}
