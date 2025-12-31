"use client";

import { useState, useEffect } from "react";
import {
  listObservacoesPedagogicasDoAluno,
  type ObservacaoPedagogica,
} from "@/app/_lib/actions/observacoes-pedagogicas";
import { BookOpen, User, Calendar } from "lucide-react";

type Props = {
  studentId: string;
};

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    coordenação: "Coordenação",
    administrativo: "Administrativo",
    professor: "Professor",
    recepção: "Recepção",
  };
  return labels[role] || role;
}

export default function ObservacoesPedagogicasView({
  studentId,
}: Props) {
  const [observacoes, setObservacoes] = useState<ObservacaoPedagogica[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadObservacoes() {
      setLoading(true);
      try {
        const data = await listObservacoesPedagogicasDoAluno(studentId);
        setObservacoes(data);
      } catch (error) {
        console.error("Erro ao carregar observações pedagógicas:", error);
      } finally {
        setLoading(false);
      }
    }
    loadObservacoes();
  }, [studentId]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-900">
            Observações Pedagógicas
          </h3>
        </div>
        <p className="mt-2 text-sm text-slate-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-slate-600" />
        <h3 className="text-lg font-semibold text-slate-900">
          Observações Pedagógicas
        </h3>
      </div>

      <p className="mt-2 text-sm text-slate-600">
        Visualização somente leitura. Apenas coordenação e administrativo podem
        criar/editar observações.
      </p>

      <div className="mt-4 space-y-4">
        {observacoes.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-sm text-slate-500">
              Nenhuma observação pedagógica registrada para este aluno.
            </p>
          </div>
        ) : (
          observacoes.map((obs) => (
            <div
              key={obs.id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-900">
                    {obs.autor_name}
                  </span>
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
                    {getRoleLabel(obs.autor_role)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(obs.created_at)}</span>
                  {obs.updated_at !== obs.created_at && (
                    <span className="ml-2 text-slate-400">
                      (editado em {formatDate(obs.updated_at)})
                    </span>
                  )}
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm text-slate-700">
                {obs.conteudo}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

