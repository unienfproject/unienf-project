"use server";

import { logAudit } from "@/app/_lib/actions/audit";
import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { revalidatePath } from "next/cache";

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
    `,
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

export async function listStudentDocuments(
  studentId: string,
): Promise<DocumentItem[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const allowedRoles = ["recepção", "administrativo", "coordenação"];
  const role = profile.role ?? "";
  if (!allowedRoles.includes(role)) {
    throw new Error("Sem permissão para listar documentos de alunos.");
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
    `,
    )
    .eq("aluno_id", studentId)
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

export async function updateDocumentStatus(input: {
  documentId: string;
  status: DocumentStatus;
  observacao?: string | null;
  rejectedReason?: string | null;
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const allowedRoles = ["recepção", "administrativo", "coordenação"];
  const role = profile.role ?? "";
  if (!allowedRoles.includes(role)) {
    throw new Error("Sem permissão para editar documentos.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: currentDoc, error: fetchError } = await supabase
    .from("documentos_aluno")
    .select("id, aluno_id, status, observacao, rejected_reason")
    .eq("id", input.documentId)
    .single();

  if (fetchError) throw new Error(fetchError.message);
  if (!currentDoc) throw new Error("Documento não encontrado.");

  const oldValue = {
    status: currentDoc.status,
    observacao: currentDoc.observacao,
    rejected_reason: currentDoc.rejected_reason,
  };

  const updateData: {
    status: DocumentStatus;
    observacao?: string | null;
    rejected_reason?: string | null;
    updated_at: string;
  } = {
    status: input.status,
    updated_at: new Date().toISOString(),
  };

  if (input.status === "rejected") {
    if (input.rejectedReason) {
      updateData.rejected_reason = input.rejectedReason.trim();
      updateData.observacao = null;
    } else {
      updateData.rejected_reason = currentDoc.rejected_reason;
    }
  } else {
    updateData.rejected_reason = null;
    if (input.observacao !== undefined) {
      updateData.observacao = input.observacao ? input.observacao.trim() : null;
    } else {
      updateData.observacao = currentDoc.observacao;
    }
  }

  const { error: updateError } = await supabase
    .from("documentos_aluno")
    .update(updateData)
    .eq("id", input.documentId);

  if (updateError) throw new Error(updateError.message);

  await logAudit({
    action: "update",
    entity: "documento",
    entityId: input.documentId,
    oldValue,
    newValue: updateData,
    description: `Status do documento alterado para ${input.status} por ${profile.name ?? profile.email}`,
  });

  revalidatePath("/admin/alunos");
  revalidatePath("/recepcao/documentos");
  revalidatePath("/recepcao/alunos");
}
