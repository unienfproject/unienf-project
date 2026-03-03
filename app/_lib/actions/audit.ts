"use server";

import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import type { AuditActionDB } from "@/app/_lib/types/database";

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

export type RecentAuditActivity = {
  id: string;
  tableName: string;
  action: AuditActionDB | AuditAction;
  recordId: string | null;
  actorId: string | null;
  actorName: string;
  actedAt: string;
  title: string;
  description: string;
};

function tableLabel(tableName: string) {
  const map: Record<string, string> = {
    profiles: "perfis",
    alunos: "alunos",
    professores: "professores",
    cursos: "cursos",
    disciplinas: "disciplinas",
    turmas: "turmas",
    turma_alunos: "vínculos de turma",
    notas: "notas",
    avaliacoes: "avaliações",
    mensalidades: "mensalidades",
    pagamentos: "pagamentos",
    documento_tipos: "tipos de documento",
    documentos_aluno: "documentos do aluno",
    avisos: "avisos",
    audit_logs: "auditoria",
  };
  return map[tableName] ?? tableName.replaceAll("_", " ");
}

function actionLabel(action: string) {
  if (action === "INSERT" || action === "create") return "Cadastro";
  if (action === "UPDATE" || action === "update") return "Atualização";
  if (action === "DELETE" || action === "delete") return "Remoção";
  if (action === "role_change") return "Alteração de função";
  if (action === "payment") return "Pagamento";
  if (action === "grade_change") return "Lançamento de nota";
  if (action === "document_change") return "Atualização de documento";
  return "Ação";
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

export async function listRecentAuditActivities(
  limit = 8,
): Promise<RecentAuditActivity[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "administrativo") {
    throw new Error("Apenas administrativo pode ver logs de auditoria.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: modernRows, error: modernError } = await supabase
    .from("audit_logs")
    .select("id, table_name, action, record_id, actor_id, acted_at")
    .order("acted_at", { ascending: false })
    .limit(limit);

  if (!modernError) {
    const rows = modernRows ?? [];
    const actorIds = Array.from(
      new Set(
        rows
          .map((r: { actor_id: string | null }) => r.actor_id)
          .filter((id): id is string => Boolean(id)),
      ),
    );

    const actorNameById = new Map<string, string>();
    if (actorIds.length > 0) {
      const { data: actors } = await supabase
        .from("profiles")
        .select("user_id, name, email")
        .in("user_id", actorIds);

      for (const actor of actors ?? []) {
        actorNameById.set(
          String(actor.user_id),
          String(actor.name ?? actor.email ?? "Sistema"),
        );
      }
    }

    return rows.map((row: any) => {
      const action = String(row.action) as AuditActionDB;
      const tableName = String(row.table_name ?? "");
      const actorId = row.actor_id ? String(row.actor_id) : null;
      const actorName = actorId
        ? (actorNameById.get(actorId) ?? "Usuário")
        : "Sistema";

      return {
        id: String(row.id),
        tableName,
        action,
        recordId: row.record_id ? String(row.record_id) : null,
        actorId,
        actorName,
        actedAt: String(row.acted_at),
        title: `${actionLabel(action)} em ${tableLabel(tableName)}`,
        description: `${actorName}${row.record_id ? ` • registro ${String(row.record_id)}` : ""}`,
      };
    });
  }

  const { data: legacyRows, error: legacyError } = await supabase
    .from("audit_logs")
    .select("id, action, entity, entity_id, user_id, created_at, description")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (legacyError) {
    if (legacyError.code === "42P01") return [];
    throw new Error(legacyError.message);
  }

  const rows = legacyRows ?? [];
  const actorIds = Array.from(
    new Set(
      rows
        .map((r: { user_id: string | null }) => r.user_id)
        .filter((id): id is string => Boolean(id)),
    ),
  );

  const actorNameById = new Map<string, string>();
  if (actorIds.length > 0) {
    const { data: actors } = await supabase
      .from("profiles")
      .select("user_id, name, email")
      .in("user_id", actorIds);
    for (const actor of actors ?? []) {
      actorNameById.set(
        String(actor.user_id),
        String(actor.name ?? actor.email ?? "Sistema"),
      );
    }
  }

  return rows.map((row: any) => {
    const action = String(row.action) as AuditAction;
    const tableName = String(row.entity ?? "");
    const actorId = row.user_id ? String(row.user_id) : null;
    const actorName = actorId ? (actorNameById.get(actorId) ?? "Usuário") : "Sistema";

    return {
      id: String(row.id),
      tableName,
      action,
      recordId: row.entity_id ? String(row.entity_id) : null,
      actorId,
      actorName,
      actedAt: String(row.created_at),
      title: `${actionLabel(action)} em ${tableLabel(tableName)}`,
      description: String(row.description ?? `${actorName} realizou uma ação no sistema.`),
    };
  });
}

export async function changeMyPassword(input: {
  currentPassword: string;
  newPassword: string;
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const supabase = await createServerSupabaseClient();

  const currentPassword = input.currentPassword ?? "";
  const newPassword = input.newPassword ?? "";

  if (newPassword.length < 6) throw new Error("A nova senha deve ter pelo menos 6 caracteres.");

  // Reautenticar exige e-mail
  const { data: me, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw new Error(userErr.message);

  const email = me.user?.email;
  if (!email) throw new Error("E-mail da sessão não encontrado.");

  const { error: signInErr } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });

  if (signInErr) throw new Error("Senha atual incorreta.");

  const { error: updateErr } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateErr) throw new Error(updateErr.message);
}
