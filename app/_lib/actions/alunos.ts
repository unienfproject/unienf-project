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

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export async function createAluno(input: {
  name: string;
  cpf: string;
  telefone: string;
  email: string;
  password: string;
  dateOfBirth: string;
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "administrativo") {
    throw new Error("Sem permissão para cadastrar alunos.");
  }

  const supabase = await createServerSupabaseClient();

  const name = input.name.trim();
  const cpf = normalizeCpf(input.cpf);
  const telefone = input.telefone.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  const dateOfBirth = input.dateOfBirth;

  if (!name) throw new Error("Nome é obrigatório.");
  if (cpf.length !== 11) throw new Error("CPF inválido.");
  if (!telefone) throw new Error("Telefone é obrigatório.");
  if (!isValidEmail(email)) throw new Error("E-mail inválido.");
  if (password.length < 6) throw new Error("Senha muito curta.");
  if (!dateOfBirth) throw new Error("Data de nascimento é obrigatória.");

  const age = calculateAge(dateOfBirth);

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
        role: "aluno",
      },
    },
  );

  if (createErr) throw new Error(createErr.message);
  if (!created.user) throw new Error("Falha ao criar usuário.");

  const userId = created.user.id;

  const { data: aluno, error: alunoError } = await supabase
    .from("alunos")
    .insert({
      user_id: userId,
      age,
      date_of_birth: dateOfBirth,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select("user_id")
    .single();

  if (alunoError) throw new Error(alunoError.message);

  await logAudit({
    action: "create",
    entity: "user",
    entityId: userId,
    newValue: { name, email, role: "aluno", dateOfBirth },
    description: `Aluno ${name} matriculado`,
  });

  revalidatePath("/admin/alunos");
  return { userId };
}

export type AlunoRow = {
  id: string;
  name: string;
  email: string;
  telefone: string | null;
  cpf?: string | null;
  age?: number | null;
  dateOfBirth?: string | null;
  createdAt: string;
};

export async function listAlunos(): Promise<AlunoRow[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "administrativo") {
    throw new Error("Sem permissão para listar alunos.");
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
      user_id,
      name,
      email,
      telefone,
      created_at,
      alunos:alunos!alunos_user_id_fkey(age, date_of_birth)
    `,
    )
    .eq("role", "aluno")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((p) => {
    const aluno = Array.isArray(p.alunos) ? p.alunos[0] : p.alunos;

    return {
      id: p.user_id,
      name: p.name ?? "",
      email: p.email ?? "",
      telefone: p.telefone,
      age: aluno?.age ?? null,
      dateOfBirth: aluno?.date_of_birth ?? null,
      createdAt: p.created_at,
    };
  });
}
