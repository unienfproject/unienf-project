"use client";

import { CheckCircle2 } from "lucide-react";
import StatusBadge from "@/app/_components/StatusBadge";
import { DocumentItem } from "@/app/_lib/actions/documents";

type Props = {
  doc: DocumentItem;

  canEdit: boolean;
  onMarkDelivered?: (delivered: boolean) => Promise<void>;
  onSaveNotes?: (notes: string) => Promise<void>;
};

export default function DocumentCard({
  doc,
  canEdit,
  onMarkDelivered,
  onSaveNotes,
}: Props) {
  const delivered = doc.status === "delivered";

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
      </div>

      {canEdit ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onMarkDelivered?.(!delivered)}
              className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              {delivered ? "Marcar como pendente" : "Marcar como entregue"}
            </button>
          </div>

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
