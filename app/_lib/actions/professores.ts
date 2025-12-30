"use server";

import { logAudit } from "@/app/_lib/actions/audit";
import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createAdminClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

function normalizeCpf(cpf: string) {
  return cpf.replace(/\D/g, "");
}

function isValidEmail(email: string) {
  return email.includes("@");
}

export async function createProfessor(input: {
  name: string;
  cpf: string;
  telefone: string;
  email: string;
  password: string;
}): Promise<{ userId: string }> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "administrativo") {
    throw new Error("Sem permissão para cadastrar professores.");
  }

  const supabase = await createServerSupabaseClient();

  const name = input.name.trim();
  const cpf = normalizeCpf(input.cpf);
  const telefone = input.telefone.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;

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
        role: "professor",
      },
    },
  );

  if (createErr) throw new Error(createErr.message);
  if (!created.user) throw new Error("Falha ao criar usuário.");

  const userId = created.user.id;

  await logAudit({
    action: "create",
    entity: "user",
    entityId: userId,
    newValue: { name, email, role: "professor" },
    description: `Professor ${name} criado`,
  });

  revalidatePath("/admin/professores");
  return { userId };
}

export type ProfessorRow = {
  id: string;
  name: string;
  email: string;
  telefone: string | null;
  createdAt: string;
};

export async function listProfessores(): Promise<ProfessorRow[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "administrativo") {
    throw new Error("Sem permissão para listar professores.");
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, name, email, telefone, created_at")
    .eq("role", "professor")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((p) => ({
    id: p.user_id,
    name: p.name ?? "",
    email: p.email ?? "",
    telefone: p.telefone,
    createdAt: p.created_at,
  }));
}
