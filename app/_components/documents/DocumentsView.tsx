"use client";

import DocumentCard from "./DocumentCard";
import { DocumentItem } from "../../_lib/actions/documents";
import { updateStudentDocument } from "../../_lib/mockdata/docs.mock";

type Props = {
  title: string;
  subtitle: string;
  canEdit: boolean;
  studentId: string;
  docs: DocumentItem[];
};

export default function DocumentsView({
  title,
  subtitle,
  canEdit,
  studentId,
  docs,
}: Props) {
  const total = docs.filter((d) => d.required).length;
  const delivered = docs.filter(
    (d) => d.required && d.status === "delivered",
  ).length;
  const pct = total > 0 ? Math.round((delivered / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="text-slate-600">{subtitle}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {docs.map((doc) => (
          <DocumentCard
            key={doc.id}
            doc={doc}
            canEdit={canEdit}
            onMarkDelivered={async (delivered) => {
              // Aqui você vai trocar pelo Server Action que atualiza no Supabase
              await updateStudentDocument(studentId, doc.id, {
                status: delivered ? "delivered" : "pending",
              });
            }}
            onSaveNotes={async (notes) => {
              await updateStudentDocument(studentId, doc.id, { notes });
            }}
          />
        ))}
      </div>
    </div>
  );
}
