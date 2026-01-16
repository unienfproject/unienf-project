"use server";

import { logAudit } from "@/app/_lib/actions/audit";
import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import type { DocumentoStatus } from "@/app/_lib/types/database";
import { revalidatePath } from "next/cache";

export type DocumentItem = {
  id: string;
  documentTypeId: string;
  documentTypeName: string;
  required: boolean;
  status: DocumentoStatus;
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

  // 1) Tipos de documento (catálogo)
  const { data: tipos, error: tiposErr } = await supabase
    .from("documento_tipos")
    .select("id, name, required")
    .order("name");

  if (tiposErr) {
    if (tiposErr.code === "42P01") return [];
    throw new Error(tiposErr.message);
  }

  // Se não existir nenhum tipo cadastrado, não há o que mostrar
  if (!tipos || tipos.length === 0) return [];

  // 2) Documentos do aluno (instâncias)
  const { data: docsAluno, error: docsErr } = await supabase
    .from("documentos_aluno")
    .select(
      `
      id,
      document_type_id,
      status,
      observation,
      rejected_reason,
      updated_at
    `,
    )
    .eq("aluno_id", profile.user_id);

  if (docsErr) {
    if (docsErr.code === "42P01") {
      // não existe tabela -> devolve tudo como pendente
      return tipos.map((t) => ({
        id: `missing:${String(t.id)}`,
        documentTypeId: String(t.id),
        documentTypeName: String(t.name ?? "Documento"),
        required: Boolean(t.required),
        status: "pending" as DocumentoStatus,
        notes: null,
        updatedAt: new Date().toISOString(),
      }));
    }
    throw new Error(docsErr.message);
  }

  type DocAlunoRow = {
    id: unknown;
    document_type_id: unknown;
    status: unknown;
    observation: unknown;
    rejected_reason: unknown;
    updated_at: unknown;
  };

  const mapByType = new Map<string, DocAlunoRow>();
  (docsAluno ?? []).forEach((d: DocAlunoRow) => {
    const typeId = String(d.document_type_id ?? "");
    if (typeId) mapByType.set(typeId, d);
  });

  // 3) Merge: para cada tipo, retorna doc existente ou “pendente”
  return tipos.map((t) => {
    const typeId = String(t.id);
    const existing = mapByType.get(typeId);

    const status =
      (existing?.status as DocumentoStatus) ?? ("pending" as DocumentoStatus);

    const notes =
      status === "rejected" && existing?.rejected_reason
        ? String(existing.rejected_reason)
        : existing?.observation
          ? String(existing.observation)
          : null;

    return {
      // Para aluno (canEdit=false), pode ser “missing:*” sem problema
      id: existing?.id ? String(existing.id) : `missing:${typeId}`,
      documentTypeId: typeId,
      documentTypeName: String((t as any).name ?? "Documento"),
      required: Boolean((t as any).required),
      status,
      notes,
      updatedAt: existing?.updated_at
        ? String(existing.updated_at)
        : new Date().toISOString(),
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
      document_type_id,
      status,
      observation,
      rejected_reason,
      updated_at,
      documento_tipos:documento_tipos!documentos_aluno_document_type_id_fkey (
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

  type DocumentoRow = {
    id: unknown;
    document_type_id: unknown;
    status: unknown;
    observation: unknown;
    rejected_reason: unknown;
    updated_at: unknown;
    documento_tipos:
      | { id: unknown; name: unknown; required: unknown }
      | { id: unknown; name: unknown; required: unknown }[]
      | null;
  };

  return documentos.map((doc: DocumentoRow) => {
    const tipo = Array.isArray(doc.documento_tipos)
      ? doc.documento_tipos[0]
      : doc.documento_tipos;

    const notes =
      doc.status === "rejected" && doc.rejected_reason
        ? String(doc.rejected_reason)
        : doc.observation
          ? String(doc.observation)
          : null;

    return {
      id: String(doc.id),
      documentTypeId: String(doc.document_type_id),
      documentTypeName: tipo?.name ? String(tipo.name) : "Documento",
      required: tipo?.required ? Boolean(tipo.required) : false,
      status: doc.status as DocumentoStatus,
      notes,
      updatedAt: String(doc.updated_at),
    };
  });
}

export async function updateDocumentStatus(input: {
  documentId: string;
  status: DocumentoStatus;
  observation?: string | null;
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
    .select("id, aluno_id, status, observation, rejected_reason")
    .eq("id", input.documentId)
    .single();

  if (fetchError) throw new Error(fetchError.message);
  if (!currentDoc) throw new Error("Documento não encontrado.");

  const oldValue = {
    status: currentDoc.status,
    observation: currentDoc.observation,
    rejected_reason: currentDoc.rejected_reason,
  };

  const updateData: {
    status: DocumentoStatus;
    observation?: string | null;
    rejected_reason?: string | null;
    updated_at: string;
  } = {
    status: input.status,
    updated_at: new Date().toISOString(),
  };

  if (input.status === "rejected") {
    if (input.rejectedReason) {
      updateData.rejected_reason = input.rejectedReason.trim();
      updateData.observation = null;
    } else {
      updateData.rejected_reason = currentDoc.rejected_reason;
    }
  } else {
    updateData.rejected_reason = null;
    if (input.observation !== undefined) {
      updateData.observation = input.observation
        ? input.observation.trim()
        : null;
    } else {
      updateData.observation = currentDoc.observation;
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

export type PendingDocumentRow = {
  documentId: string;
  alunoId: string; // profiles.user_id (FK em documentos_aluno.aluno_id)
  alunoName: string;
  documentTypeName: string;
  updatedAt: string;
};

export async function listPendingDocumentsForDashboard(): Promise<
  PendingDocumentRow[]
> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  // Ajuste aqui para as roles que podem ver este dashboard
  const allowedRoles = ["recepção", "coordenação", "administrativo"];
  const role = profile.role ?? "";
  if (!allowedRoles.includes(role)) throw new Error("Sem permissão.");

  const supabase = await createServerSupabaseClient();

  /**
   * BUSCA NO SUPABASE (conforme seu schema):
   * - documentos_aluno (aluno_id -> profiles.user_id)
   * - documento_tipos (para pegar name do documento)
   * - profiles (para pegar name do aluno)
   *
   * Aqui consideramos "pendente de check" todo documento cujo status != 'delivered'
   * (já que você quer UX baseada em check, não em status visível).
   */
  const { data, error } = await supabase
    .from("documentos_aluno")
    .select(
      `
      id,
      aluno_id,
      status,
      updated_at,
      documento_tipos:documento_tipos!documentos_aluno_document_type_id_fkey (
        name
      ),
      profiles:profiles!documentos_aluno_aluno_id_fkey (
        name
      )
    `,
    )
    .neq("status", "delivered")
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);

  return (data ?? []).map((r) => {
    const docTipo = Array.isArray(r.documento_tipos)
      ? r.documento_tipos[0]
      : r.documento_tipos;

    const prof = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;

    return {
      documentId: String(r.id),
      alunoId: String(r.aluno_id),
      alunoName: prof?.name ?? "Aluno",
      documentTypeName: docTipo?.name ?? "Documento",
      updatedAt: String(r.updated_at),
    };
  });
}

export async function markStudentDocumentAsDelivered(input: {
  alunoId: string;
  docKey: string;
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const allowed = ["administrativo", "recepção", "coordenação"];
  if (!allowed.includes(profile.role ?? "")) throw new Error("Sem permissão.");

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("aluno_documentos").upsert(
    {
      aluno_id: input.alunoId,
      doc_key: input.docKey,
      status: "entregue",
      delivered_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "aluno_id,doc_key" },
  );

  if (error) throw new Error(error.message);

  revalidatePath(`/aluno/documentos`);
  revalidatePath(`/admin/alunos/${input.alunoId}/documentos`);
}

export async function markDocumentAsDelivered(input: { documentId: string }) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const allowed = ["administrativo", "recepção", "coordenação"];
  if (!allowed.includes(profile.role ?? "")) throw new Error("Sem permissão.");

  const documentId = (input.documentId ?? "").trim();
  if (!documentId) throw new Error("documentId inválido.");

  const supabase = await createServerSupabaseClient();

  /**
   * UPDATE NO SUPABASE:
   * - marca como delivered (check)
   * - atualiza updated_at
   * - (opcional) limpa rejected_reason, etc. se você quiser padronizar
   */
  const { error } = await supabase
    .from("documentos_aluno")
    .update({
      status: "delivered" as DocumentoStatus,
      updated_at: new Date().toISOString(),
      rejected_reason: null,
    })
    .eq("id", documentId);

  if (error) throw new Error(error.message);

  // Revalida as páginas que dependem dessa lista
  revalidatePath("/admin");
  revalidatePath("/recepcao");
  revalidatePath("/recepcao/documentos");
}
