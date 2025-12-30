"use client";

import { Bell, Search } from "lucide-react";
import { DocumentItem } from "../../_lib/actions/documents";
import { updateStudentDocument } from "../../_lib/mockdata/docs.mock";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import DocumentCard from "./DocumentCard";

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
    <div className="bg-background flex min-h-screen flex-col">
      <header className="bg-card border-border flex h-16 items-center justify-between border-b px-6">
        <div className="max-w-md flex-1">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="text"
              className="border-input ring-offset-background file:text-foreground placeholder:text-muted-foreground bg-muted/50 focus-visible:ring-primary flex h-10 w-full rounded-md border-0 px-3 py-2 pl-10 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Buscar..."
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground relative inline-flex h-10 w-10 items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
            <Bell className="h-5 w-5 text-white" />
          </Button>
          <div className="border-border flex items-center gap-3 border-l pl-4">
            <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-full">
              <span className="text-primary-foreground text-sm font-semibold">
                M
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-foreground text-sm font-medium">Maria Silva</p>
              <p className="text-muted-foreground text-xs">Aluno</p>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="text-slate-600">{subtitle}</p>
      </div>

      <div className="gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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

      <div className="m-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {docs.map((doc) => (
          <DocumentCard
            key={doc.id}
            doc={doc}
            canEdit={canEdit}
            onMarkDelivered={async (delivered) => {
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
