"use client";

import { useState } from "react";
import type { DocumentItem } from "../../_lib/actions/documents";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

type Props = {
  doc: DocumentItem;
  canEdit: boolean;
  onMarkDelivered: (delivered: boolean) => Promise<void>;
  onMarkRejected: (rejected: boolean, notes?: string) => Promise<void>;
  onSaveNotes: (notes: string) => Promise<void>;
};

export default function DocumentCard({
  doc,
  canEdit,
  onMarkDelivered,
  onMarkRejected,
  onSaveNotes,
}: Props) {
  const [notes, setNotes] = useState(doc.notes ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const statusConfig = {
    delivered: {
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      label: "Entregue",
    },
    pending: {
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      label: "Pendente",
    },
    rejected: {
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      label: "Rejeitado",
    },
  };

  const status = doc.status || "pending";
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  async function handleSaveNotes() {
    setIsSaving(true);
    try {
      await onSaveNotes(notes);
    } catch (error) {
      console.error("Erro ao salvar observação:", error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleReject() {
    setIsSaving(true);
    try {
      await onMarkRejected(true, rejectReason);
      setShowRejectForm(false);
      setRejectReason("");
    } catch (error) {
      console.error("Erro ao rejeitar documento:", error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className={`rounded-lg border p-4 ${config.borderColor} ${config.bgColor}`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${config.color}`} />
          <div>
            <h3 className="font-semibold text-slate-900">
              {doc.documentTypeName}
            </h3>
            <span className={`text-xs font-medium ${config.color}`}>
              {config.label}
            </span>
          </div>
        </div>
        {doc.required && (
          <span className="text-xs font-medium text-red-600">Obrigatório</span>
        )}
      </div>

      {doc.status === "rejected" && doc.notes && (
        <div className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-800">
          {doc.notes}
        </div>
      )}

      {canEdit && (
        <div className="mt-4 space-y-3">
          <div>
            <Label className="text-sm">Observações</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione observações sobre este documento..."
              className="mt-1"
              rows={2}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleSaveNotes}
              disabled={isSaving}
              className="mt-2"
            >
              Salvar Observação
            </Button>
          </div>

          <div className="flex gap-2">
            {status !== "delivered" && (
              <Button
                size="sm"
                variant="default"
                onClick={() => onMarkDelivered(true)}
                disabled={isSaving}
                className="flex-1"
              >
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Marcar como Entregue
              </Button>
            )}

            {status === "delivered" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMarkDelivered(false)}
                disabled={isSaving}
                className="flex-1"
              >
                Desmarcar Entregue
              </Button>
            )}

            {!showRejectForm && status !== "rejected" && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setShowRejectForm(true)}
                disabled={isSaving}
                className="flex-1"
              >
                <XCircle className="mr-1 h-4 w-4" />
                Rejeitar
              </Button>
            )}

            {status === "rejected" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMarkRejected(false)}
                disabled={isSaving}
                className="flex-1"
              >
                Desmarcar Rejeitado
              </Button>
            )}
          </div>

          {showRejectForm && (
            <div className="rounded border border-red-200 bg-red-50 p-3">
              <Label className="text-sm text-red-800">Motivo da Rejeição</Label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Digite o motivo da rejeição..."
                className="mt-1"
                rows={2}
              />
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isSaving || !rejectReason.trim()}
                  className="flex-1"
                >
                  Confirmar Rejeição
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectReason("");
                  }}
                  disabled={isSaving}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {!canEdit && doc.notes && (
        <div className="mt-3 rounded border border-slate-200 bg-slate-50 p-2 text-sm text-slate-700">
          <strong>Observação:</strong> {doc.notes}
        </div>
      )}
    </div>
  );
}
