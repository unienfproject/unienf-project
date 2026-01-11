"use server";

import { logAudit } from "@/app/_lib/actions/audit";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

type Role =
  | "recepção"
  | "coordenação"
  | "administrativo"
  | "professor"
  | "aluno";

function normalizeCpf(cpf: string) {
  return cpf.replace(/\D/g, "");
}

function isValidYYYYMMDD(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function isValidEmail(email: string) {
  return email.includes("@");
}

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createAdminClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

export async function createInternalUser(input: {
  name: string;
  cpf: string;
  telefone: string;
  email: string;
  password: string;
  role: Role;
  observation?: string | null;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) throw new Error("Sessão inválida.");

  const { data: callerProfile, error: callerErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", authData.user.id)
    .single();

  if (callerErr) throw new Error(callerErr.message);
  if (!callerProfile || callerProfile.role !== "administrativo") {
    throw new Error("Sem permissão para cadastrar usuários.");
  }

  const name = input.name.trim();
  const cpf = normalizeCpf(input.cpf);
  const telefone = input.telefone.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  const role = input.role;

  if (!name) throw new Error("Nome é obrigatório.");
  if (cpf.length !== 11) throw new Error("CPF inválido.");
  if (!telefone) throw new Error("Telefone é obrigatório.");
  if (!isValidEmail(email)) throw new Error("E-mail inválido.");
  if (password.length < 6) throw new Error("Senha muito curta.");

  const admin = getAdminSupabase();

  const { data: created, error: createErr } = await admin.auth.admin.createUser(
    {
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        telefone,
      },
      app_metadata: {
        role,
      },
    },
  );

  if (createErr) throw new Error(createErr.message);
  if (!created.user) throw new Error("Falha ao criar usuário.");

  const userId = created.user.id;

  // Usa o cliente admin para fazer o update, que bypassa RLS
  // O trigger handle_new_auth_user já criou o registro na tabela profiles
  const { error: profileErr } = await admin
    .from("profiles")
    .update({
      name,
      telefone,
      email,
      role,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (profileErr) throw new Error(profileErr.message);

  return { userId };
}

export async function listInternalUsers() {
  const supabase = await createServerSupabaseClient();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) throw new Error("Sessão inválida.");

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", authData.user.id)
    .single();

  if (!callerProfile || callerProfile.role !== "administrativo") {
    throw new Error("Sem permissão para listar usuários.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, name, email, telefone, role, created_at")
    .in("role", ["recepção", "coordenação", "administrativo", "professor"])
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((u) => ({
    id: u.user_id as string,
    name: (u.name ?? "") as string,
    email: (u.email ?? "") as string,
    telefone: (u.telefone ?? "") as string,
    role: (u.role ?? "") as string,
  }));
}

export async function updateUserRole(input: { userId: string; newRole: Role }) {
  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) throw new Error("Sessão inválida.");

  const { data: callerProfile, error: callerErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", authData.user.id)
    .single();

  if (callerErr) throw new Error(callerErr.message);
  if (!callerProfile || callerProfile.role !== "administrativo") {
    throw new Error(
      "Sem permissão para alterar roles. Apenas administrativo pode alterar roles.",
    );
  }

  const userId = String(input.userId ?? "").trim();
  const newRole = input.newRole;

  if (!userId) throw new Error("userId é obrigatório.");
  if (!newRole) throw new Error("newRole é obrigatório.");

  const { data: targetUser, error: targetErr } = await supabase
    .from("profiles")
    .select("user_id, role")
    .eq("user_id", userId)
    .single();

  if (targetErr) throw new Error(targetErr.message);
  if (!targetUser) throw new Error("Usuário não encontrado.");

  if (userId === authData.user.id) {
    throw new Error("Você não pode alterar sua própria role.");
  }

  const admin = getAdminSupabase();
  const { error: authUpdateErr } = await admin.auth.admin.updateUserById(
    userId,
    {
      app_metadata: {
        role: newRole,
      },
    },
  );

  if (authUpdateErr)
    throw new Error(`Erro ao atualizar role no Auth: ${authUpdateErr.message}`);

  const { error: profileUpdateErr } = await supabase
    .from("profiles")
    .update({
      role: newRole,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (profileUpdateErr) throw new Error(profileUpdateErr.message);

  await logAudit({
    action: "role_change",
    entity: "user",
    entityId: userId,
    oldValue: { role: targetUser.role },
    newValue: { role: newRole },
    description: `Role alterada de "${targetUser.role}" para "${newRole}"`,
  });

  return { success: true, userId, oldRole: targetUser.role, newRole };
}
