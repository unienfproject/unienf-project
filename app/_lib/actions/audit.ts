"use server";

import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "role_change"
  | "payment"
  | "grade_change"
  | "document_change";

export type AuditEntity =
  | "user"
  | "profile"
  | "mensalidade"
  | "pagamento"
  | "nota"
  | "documento"
  | "turma"
  | "aluno"
  | "professor"
  | "observacao_pedagogica"
  | "etiqueta"
  | "curso";

export interface AuditLog {
  id: string;
  user_id: string;
  action: AuditAction;
  entity: AuditEntity;
  entity_id: string;
  old_value: Record<string, any> | null;
  new_value: Record<string, any> | null;
  description: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export async function logAudit(input: {
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  oldValue?: Record<string, any> | null;
  newValue?: Record<string, any> | null;
  description: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    const profile = await getUserProfile();
    if (!profile) {
      console.warn("[Audit] Tentativa de log sem perfil de usuário");
      return;
    }

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.from("audit_logs").insert({
      user_id: profile.user_id,
      action: input.action,
      entity: input.entity,
      entity_id: input.entityId,
      old_value: input.oldValue ?? null,
      new_value: input.newValue ?? null,
      description: input.description,
      ip_address: input.ipAddress ?? null,
      user_agent: input.userAgent ?? null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[Audit] Erro ao registrar log:", error.message);
    }
  } catch (err) {
    console.error("[Audit] Erro inesperado:", err);
  }
}

export async function listAuditLogs(params?: {
  entity?: AuditEntity;
  entityId?: string;
  userId?: string;
  action?: AuditAction;
  limit?: number;
  offset?: number;
}): Promise<AuditLog[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  if (profile.role !== "administrativo") {
    throw new Error("Apenas administrativo pode ver logs de auditoria.");
  }

  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false });

  if (params?.entity) {
    query = query.eq("entity", params.entity);
  }

  if (params?.entityId) {
    query = query.eq("entity_id", params.entityId);
  }

  if (params?.userId) {
    query = query.eq("user_id", params.userId);
  }

  if (params?.action) {
    query = query.eq("action", params.action);
  }

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  if (params?.offset) {
    query = query.range(
      params.offset,
      params.offset + (params.limit ?? 50) - 1,
    );
  }

  const { data, error } = await query;

  if (error) {
    if (error.code === "42P01") {
      return [];
    }
    throw new Error(error.message);
  }

  return (data ?? []).map((log: any) => ({
    id: log.id,
    user_id: log.user_id,
    action: log.action,
    entity: log.entity,
    entity_id: log.entity_id,
    old_value: log.old_value,
    new_value: log.new_value,
    description: log.description,
    ip_address: log.ip_address,
    user_agent: log.user_agent,
    created_at: log.created_at,
  }));
}
