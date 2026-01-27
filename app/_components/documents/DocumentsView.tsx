"use client";

import { useRouter } from "next/navigation";
import {
  DocumentItem,
  updateDocumentStatus,
} from "../../_lib/actions/documents";
import DocumentCard from "./DocumentCard";

type Props = {
  title: string;
  subtitle: string;
  canEdit: boolean;
  docs: DocumentItem[];
};

export default function DocumentsView({
  title,
  subtitle,
  canEdit,
  docs,
}: Props) {
  const router = useRouter();
  const total = docs.filter((d) => d.required).length;
  const delivered = docs.filter(
    (d) => d.required && d.status === "delivered",
  ).length;
  const pct = total > 0 ? Math.round((delivered / total) * 100) : 0;

  async function handleMarkDelivered(documentId: string, delivered: boolean) {
    try {
      await updateDocumentStatus({
        documentId,
        status: delivered ? "delivered" : "pending",
      });
      router.refresh();
    } catch (error) {
      console.error("Erro ao atualizar status do documento:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar status do documento.",
      );
    }
  }

  async function handleMarkRejected(
    documentId: string,
    rejected: boolean,
    notes?: string,
  ) {
    try {
      await updateDocumentStatus({
        documentId,
        status: rejected ? "rejected" : "pending",
        rejectedReason: rejected ? notes || null : null,
      });
      router.refresh();
    } catch (error) {
      console.error("Erro ao atualizar status do documento:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar status do documento.",
      );
    }
  }

  async function handleSaveNotes(documentId: string, notes: string) {
    try {
      const currentDoc = docs.find((d) => d.id === documentId);
      if (!currentDoc) return;

      await updateDocumentStatus({
        documentId,
        status: currentDoc.status,
        observation: notes || null,
      });
      router.refresh();
    } catch (error) {
      console.error("Erro ao salvar observação:", error);
      alert(
        error instanceof Error ? error.message : "Erro ao salvar observação.",
      );
    }
  }

  return (
    <div className="bg-background flex gap-2 min-h-screen flex-col">
      <main className="p-6">
      <div className="flex flex-col  p-4">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="text-slate-600">{subtitle}</p>
      </div>

      <div className="rounded-2xl border border-slate-200  bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Progresso da documentação
            </h3>
            <p className="text-sm text-slate-600">
              {delivered} de {total} documentos entregues
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-sky-600">{pct}%</span>
          </div>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-3 bg-sky-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="m-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {docs.map((doc) => (
          <DocumentCard
            key={doc.id}
            doc={doc}
            canEdit={canEdit}
            onMarkDelivered={async (delivered) => {
              await handleMarkDelivered(doc.id, delivered);
            }}
            onMarkRejected={async (rejected, notes) => {
              await handleMarkRejected(doc.id, rejected, notes);
            }}
            onSaveNotes={async (notes) => {
              await handleSaveNotes(doc.id, notes);
            }}
          />
        ))}
      </div>
      </main>
    </div>
  );
}
