"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";

export type NoticeDetailsData = {
  title: string;
  message: string;
  authorName: string | null;
  authorRole?: string | null;
  createdAt: string;
};

function formatDateTimeBR(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NoticeDetailsDialog({
  open,
  onOpenChange,
  notice,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notice: NoticeDetailsData | null;
}) {
  const sender = notice?.authorName || "Não informado";
  const senderMeta = notice?.authorRole ? `${sender} • ${notice.authorRole}` : sender;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Detalhes do aviso</DialogTitle>
          <DialogDescription>
            Mockdata de visualização do aviso selecionado.
          </DialogDescription>
        </DialogHeader>

        {notice ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Enviado por
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {senderMeta}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {formatDateTimeBR(notice.createdAt)}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Título
              </p>
              <p className="text-base font-semibold text-slate-900">
                {notice.title}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Conteúdo
              </p>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm whitespace-pre-line text-slate-700">
                {notice.message}
              </div>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
