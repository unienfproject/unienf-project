"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import StatusBadge from "@/app/_components/StatusBadge";
import { DocumentItem } from "@/app/_lib/actions/documents";

type Props = {
  doc: DocumentItem;

  canEdit: boolean;
  onMarkDelivered?: (delivered: boolean) => Promise<void>;
  onMarkRejected?: (rejected: boolean, notes?: string) => Promise<void>;
  onSaveNotes?: (notes: string) => Promise<void>;
};

export default function DocumentCard({
  doc,
  canEdit,
  onMarkDelivered,
  onMarkRejected,
  onSaveNotes,
}: Props) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");

  const delivered = doc.status === "delivered";
  const rejected = doc.status === "rejected";
  const pending = doc.status === "pending";

  async function handleReject() {
    if (isRejecting) {
      if (!rejectNotes.trim()) {
        alert("É obrigatório informar o motivo da rejeição.");
        return;
      }
      await onMarkRejected?.(true, rejectNotes.trim());
      setIsRejecting(false);
      setRejectNotes("");
    } else {
      setIsRejecting(true);
    }
  }

  async function handleCancelReject() {
    setIsRejecting(false);
    setRejectNotes("");
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <h3 className="font-semibold text-slate-900">{doc.title}</h3>
          <p className="text-sm text-slate-600">
            {doc.required ? "Obrigatório" : "Opcional"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {delivered ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <StatusBadge label="Entregue" variant="green" />
            </div>
          ) : rejected ? (
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <StatusBadge label="Rejeitado" variant="red" />
            </div>
          ) : (
            <StatusBadge label="Pendente" variant="yellow" />
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
        <p className="mb-1 text-xs text-slate-500">Observações</p>
        <p className="text-sm text-slate-700">
          {doc.notes ? doc.notes : "Sem observações no momento."}
        </p>
        {rejected && doc.notes && (
          <p className="mt-2 text-xs font-medium text-red-600">
            Motivo da rejeição: {doc.notes}
          </p>
        )}
      </div>

      {canEdit ? (
        <div className="flex flex-col gap-2">
          {isRejecting ? (
            <div className="flex flex-col gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
              <label className="text-sm font-medium text-red-900">
                Motivo da rejeição (obrigatório):
              </label>
              <textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                placeholder="Informe o motivo da rejeição do documento..."
                className="min-h-[80px] w-full rounded-md border border-red-300 bg-white p-3 text-sm"
                required
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={!rejectNotes.trim()}
                  className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  Confirmar rejeição
                </button>
                <button
                  type="button"
                  onClick={handleCancelReject}
                  className="rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {!rejected && (
                <button
                  type="button"
                  onClick={() => onMarkDelivered?.(!delivered)}
                  className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-slate-50"
                >
                  {delivered ? "Marcar como pendente" : "Marcar como entregue"}
                </button>
              )}
              {!delivered && (
                <button
                  type="button"
                  onClick={handleReject}
                  className="rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  {rejected ? "Remover rejeição" : "Marcar como rejeitado"}
                </button>
              )}
              {rejected && onMarkRejected && (
                <button
                  type="button"
                  onClick={() => onMarkRejected(false)}
                  className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-slate-50"
                >
                  Remover rejeição
                </button>
              )}
            </div>
          )}

          <form
            className="flex flex-col gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const fd = new FormData(form);
              const notes = String(fd.get("notes") ?? "").trim();
              await onSaveNotes?.(notes);
              form.reset();
            }}
          >
            <textarea
              name="notes"
              placeholder="Adicionar/atualizar observação para o aluno..."
              className="min-h-[80px] w-full rounded-md border p-3 text-sm"
              defaultValue={doc.notes ?? ""}
            />
            <button
              type="submit"
              className="self-start rounded-md bg-sky-500 px-3 py-2 text-sm font-medium text-white hover:bg-sky-600"
            >
              Salvar observação
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
