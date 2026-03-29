"use client";

import NoticeDetailsDialog, {
  type NoticeDetailsData,
} from "@/app/_components/avisos/NoticeDetailsDialog";
import { Button } from "@/app/_components/ui/button";
import type { NoticeRow } from "@/app/_lib/actions/recepcao";
import { useState } from "react";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR");
  } catch {
    return iso;
  }
}

export default function RecepcaoAvisosView({
  notices,
}: {
  notices: NoticeRow[];
}) {
  const [selectedNotice, setSelectedNotice] = useState<NoticeDetailsData | null>(
    null,
  );

  return (
    <>
      <NoticeDetailsDialog
        open={selectedNotice !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedNotice(null);
        }}
        notice={selectedNotice}
      />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b p-4">
          <h2 className="font-semibold text-slate-900">Feed de avisos</h2>
          <p className="text-sm text-slate-600">
            Professor, coordenação e administrativo podem publicar avisos.
          </p>
        </div>

        <div className="divide-y">
          {notices.map((n) => (
            <div key={n.id} className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-slate-900">
                    {n.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {n.author_name} • {n.author_role} • {formatDate(n.created_at)}
                  </p>
                  <p className="mt-3 text-sm whitespace-pre-line text-slate-700">
                    {n.message}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setSelectedNotice({
                      title: n.title,
                      message: n.message,
                      authorName: n.author_name,
                      authorRole: n.author_role,
                      createdAt: n.created_at,
                    })
                  }
                >
                  Ver detalhes
                </Button>
              </div>
            </div>
          ))}

          {!notices.length ? (
            <div className="p-6 text-center text-slate-500">
              Nenhum aviso encontrado.
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
