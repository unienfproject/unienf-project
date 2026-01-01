"use client";

import { Button } from "@/app/_components/ui/button";
import {
  atribuirEtiquetaAoAluno,
  listEtiquetas,
  listEtiquetasDoAluno,
  removerEtiquetaDoAluno,
  type Etiqueta,
} from "@/app/_lib/actions/etiquetas";
import { Plus, Tag, X } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  studentId: string;
  canEdit?: boolean;
};

export default function EtiquetasView({ studentId, canEdit = false }: Props) {
  const [etiquetasDoAluno, setEtiquetasDoAluno] = useState<Etiqueta[]>([]);
  const [etiquetasDisponiveis, setEtiquetasDisponiveis] = useState<Etiqueta[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [alunoEtiquetas, todasEtiquetas] = await Promise.all([
          listEtiquetasDoAluno(studentId),
          listEtiquetas(),
        ]);

        setEtiquetasDoAluno(alunoEtiquetas);
        setEtiquetasDisponiveis(todasEtiquetas);
      } catch (error) {
        console.error("Erro ao carregar etiquetas:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [studentId]);

  async function handleAtribuir(etiquetaId: string) {
    try {
      await atribuirEtiquetaAoAluno({ studentId, etiquetaId });
      const atualizadas = await listEtiquetasDoAluno(studentId);
      setEtiquetasDoAluno(atualizadas);
      setShowAddDialog(false);
    } catch (error) {
      console.error("Erro ao atribuir etiqueta:", error);
      alert("Erro ao atribuir etiqueta. Tente novamente.");
    }
  }

  async function handleRemover(etiquetaId: string) {
    try {
      await removerEtiquetaDoAluno({ studentId, etiquetaId });
      const atualizadas = await listEtiquetasDoAluno(studentId);
      setEtiquetasDoAluno(atualizadas);
    } catch (error) {
      console.error("Erro ao remover etiqueta:", error);
      alert("Erro ao remover etiqueta. Tente novamente.");
    }
  }

  const etiquetasParaAdicionar = etiquetasDisponiveis.filter(
    (e) => !etiquetasDoAluno.some((ae) => ae.id === e.id),
  );

  const podeEditar = canEdit;

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-900">Etiquetas</h3>
        </div>
        <p className="mt-2 text-sm text-slate-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-900">Etiquetas</h3>
        </div>
        {podeEditar && (
          <Button
            type="button"
            onClick={() => setShowAddDialog(!showAddDialog)}
            className="h-8 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Plus className="mr-1 h-3 w-3" />
            Adicionar
          </Button>
        )}
      </div>

      {showAddDialog && podeEditar && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 text-sm font-medium text-slate-700">
            Selecionar etiqueta para adicionar:
          </p>
          {etiquetasParaAdicionar.length === 0 ? (
            <p className="text-sm text-slate-500">
              Todas as etiquetas disponíveis já foram atribuídas.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {etiquetasParaAdicionar.map((etiqueta) => (
                <button
                  key={etiqueta.id}
                  type="button"
                  onClick={() => handleAtribuir(etiqueta.id)}
                  className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  style={
                    etiqueta.color
                      ? {
                          borderColor: etiqueta.color,
                          backgroundColor: `${etiqueta.color}20`,
                          color: etiqueta.color,
                        }
                      : {}
                  }
                >
                  {etiqueta.name}
                  <Plus className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}
          <Button
            type="button"
            onClick={() => setShowAddDialog(false)}
            className="mt-3 h-8 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </Button>
        </div>
      )}

      <div className="mt-4">
        {etiquetasDoAluno.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhuma etiqueta atribuída a este aluno.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {etiquetasDoAluno.map((etiqueta) => (
              <div
                key={etiqueta.id}
                className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium"
                style={
                  etiqueta.color
                    ? {
                        borderColor: etiqueta.color,
                        backgroundColor: `${etiqueta.color}20`,
                        color: etiqueta.color,
                      }
                    : {
                        borderColor: "#cbd5e1",
                        backgroundColor: "#f1f5f9",
                        color: "#475569",
                      }
                }
              >
                <span>{etiqueta.name}</span>
                {podeEditar && (
                  <button
                    type="button"
                    onClick={() => handleRemover(etiqueta.id)}
                    className="ml-1 rounded-full p-0.5 hover:bg-black/10"
                    aria-label={`Remover etiqueta ${etiqueta.name}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {!podeEditar && etiquetasDoAluno.length > 0 && (
        <p className="mt-3 text-xs text-slate-500">
          Apenas visualização. Recepção e Admin podem atribuir/remover
          etiquetas.
        </p>
      )}
    </div>
  );
}
