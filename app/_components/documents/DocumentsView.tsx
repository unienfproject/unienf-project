"use client";

import { useRouter } from "next/navigation";
import {
  DocumentItem,
  updateDocumentStatus,
} from "../../_lib/actions/documents";
import { notifyDataChanged } from "@/app/_lib/client/dataRefresh";
import DocumentCard from "./DocumentCard";
import Link from "next/link";

type Props = {
  canEdit: boolean;
  docs: DocumentItem[];
  title?: string;
  subtitle?: string;
};

export default function DocumentsView({ canEdit, docs, title, subtitle }: Props) {
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
      notifyDataChanged(router);
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
      notifyDataChanged(router);
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
      notifyDataChanged(router);
    } catch (error) {
      console.error("Erro ao salvar observação:", error);
      alert(
        error instanceof Error ? error.message : "Erro ao salvar observação.",
      );
    }
  }

  return (
    <div className="bg-background flex min-h-screen flex-col gap-2">
      <main className="flex flex-1 flex-col">
        {(title || subtitle) && (
          <div className="mb-6">
            {title && (
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            )}
            {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
        <div className="flex flex-col items-center justify-center text-center text-2xl font-bold">
          <h2 className="">
            EM CASO DE DÚVIDAS, ENTRE EM CONTATO COM A RECEPÇÃO:
          </h2>
          <p>
            <strong className="text-sky-600 transition-colors hover:text-green-400">
              {" "}
              <Link href="https://wa.me/5511987654321" target="_blank">
                VIA WHATSAPP: (22) 2621-1627{" "}
              </Link>
            </strong>
          </p>
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
