"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";

type Role = "recepção" | "coordenação" | "administrativo" | "professor";

function normalizeCpf(cpf: string) {
  return cpf.replace(/\D/g, "");
}

function isValidYYYYMMDD(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function isValidEmail(email: string) {
  return email.includes("@");
}

// TODO SUPABASE: coloque SUPABASE_SERVICE_ROLE_KEY no .env (NUNCA no client)
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
  // Só permite se quem está chamando for administrativo
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
      email_confirm: true, // admin cria já confirmado
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

  // TODO SUPABASE
  // Adicionar colunas em profile para CPF e Observações.
  const { error: profileErr } = await supabase.from("profiles").upsert(
    {
      user_id: userId,
      name,
      telefone,
      email,
      role,
      // cpf: cpf, // TODO: adicionar coluna
      // observation: input.observation ?? null, // TODO: adicionar coluna
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

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

  // TODO SUPABASE
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
