"use server";

import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";

export type DocumentStatus = "pending" | "delivered" | "rejected";

export type DocumentItem = {
  id: string;
  documentTypeId: string;
  title: string;
  required: boolean;
  status: DocumentStatus;
  notes?: string | null;
  updatedAt: string; // ISO
};

export async function listMyDocuments(): Promise<DocumentItem[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  if (profile.role !== "aluno") {
    throw new Error("Esta função é apenas para alunos.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: documentos, error } = await supabase
    .from("documentos_aluno")
    .select(
      `
      id,
      documento_tipo_id,
      status,
      observacao,
      rejected_reason,
      updated_at,
      documento_tipos:documento_tipos!documentos_aluno_documento_tipo_id_fkey (
        id,
        name,
        required
      )
    `
    )
    .eq("aluno_id", profile.user_id)
    .order("updated_at", { ascending: false });

  if (error) {
    if (error.code === "42P01") {
      return [];
    }
    throw new Error(error.message);
  }

  if (!documentos || documentos.length === 0) {
    return [];
  }

  return documentos.map((doc: any) => {
    const tipo = Array.isArray(doc.documento_tipos)
      ? doc.documento_tipos[0]
      : doc.documento_tipos;

    const notes =
      doc.status === "rejected" && doc.rejected_reason
        ? doc.rejected_reason
        : doc.observacao || null;

    return {
      id: String(doc.id),
      documentTypeId: String(doc.documento_tipo_id),
      title: tipo?.name || "Documento",
      required: tipo?.required ?? false,
      status: doc.status as DocumentStatus,
      notes,
      updatedAt: doc.updated_at,
    };
  });
}
