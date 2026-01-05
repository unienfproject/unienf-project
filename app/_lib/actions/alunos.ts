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

export type MyProfile = {
  id: string;
  name: string;
  email: string;
  telefone: string | null;
  age: number | null;
  dateOfBirth: string | null;
  turmaAtual: {
    id: string;
    name: string;
    tag: string;
  } | null;
};

export async function getMyProfile(): Promise<MyProfile> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  if (profile.role !== "aluno") {
    throw new Error("Esta função é apenas para alunos.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select(
      `
      user_id,
      name,
      email,
      telefone,
      alunos:alunos!alunos_user_id_fkey(age, date_of_birth)
    `
    )
    .eq("user_id", profile.user_id)
    .single();

  if (profileError) throw new Error(profileError.message);
  if (!profileData) throw new Error("Perfil não encontrado.");

  const aluno = Array.isArray(profileData.alunos)
    ? profileData.alunos[0]
    : profileData.alunos;

  const { data: turmaData, error: turmaError } = await supabase
    .from("turma_alunos")
    .select(
      `
      turma_id,
      turmas:turmas!turma_alunos_turma_id_fkey(id, name, tag, status)
    `
    )
    .eq("aluno_id", profile.user_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  let turmaAtual = null;
  if (!turmaError && turmaData) {
    const turma = Array.isArray(turmaData.turmas)
      ? turmaData.turmas[0]
      : turmaData.turmas;
    if (turma && turma.status === "ativa") {
      turmaAtual = {
        id: turma.id,
        name: turma.name,
        tag: turma.tag,
      };
    }
  }

  return {
    id: profile.user_id,
    name: profileData.name ?? "",
    email: profileData.email ?? "",
    telefone: profileData.telefone,
    age: aluno?.age ?? null,
    dateOfBirth: aluno?.date_of_birth ?? null,
    turmaAtual,
  };
}

export type StudentPersonalData = {
  id: string;
  name: string;
  email: string;
  telefone: string | null;
  age: number | null;
  dateOfBirth: string | null;
  turmas: Array<{
    id: string;
    name: string;
    tag: string;
    disciplinaName: string | null;
  }>;
};

export async function getStudentPersonalData(
  studentId: string,
  teacherId: string,
): Promise<StudentPersonalData> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== teacherId) throw new Error("Acesso inválido.");

  const supabase = await createServerSupabaseClient();

  const { data: turmasProfessor, error: turmasError } = await supabase
    .from("turmas")
    .select("id")
    .eq("professor_id", teacherId);

  if (turmasError) throw new Error(turmasError.message);
  if (!turmasProfessor || turmasProfessor.length === 0) {
    throw new Error("Você não tem turmas cadastradas.");
  }

  const turmaIds = turmasProfessor.map((turma) => turma.id);

  const { data: turmaAluno, error: turmaAlunoError } = await supabase
    .from("turma_alunos")
    .select("turma_id")
    .eq("aluno_id", studentId)
    .in("turma_id", turmaIds)
    .limit(1)
    .single();

  if (turmaAlunoError || !turmaAluno) {
    throw new Error(
      "Você não tem permissão para visualizar dados deste aluno.",
    );
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select(
      `
      user_id,
      name,
      email,
      telefone,
      alunos:alunos!alunos_user_id_fkey(age, date_of_birth)
    `,
    )
    .eq("user_id", studentId)
    .single();

  if (profileError) throw new Error(profileError.message);
  if (!profileData) throw new Error("Aluno não encontrado.");

  const dadosAluno = Array.isArray(profileData.alunos)
    ? profileData.alunos[0]
    : profileData.alunos;

  const { data: turmasAluno, error: turmasAlunoError } = await supabase
    .from("turma_alunos")
    .select(
      `
      turma_id,
      turmas:turmas!turma_alunos_turma_id_fkey(
        id,
        name,
        tag,
        disciplinas:disciplinas!turmas_disciplina_id_fkey(name)
      )
    `,
    )
    .eq("aluno_id", studentId)
    .in("turma_id", turmaIds);

  if (turmasAlunoError) throw new Error(turmasAlunoError.message);

  type TurmaAlunoComTurmaRow = {
    turma_id: string;
    turmas:
      | {
          id: string;
          name: string;
          tag: string;
          disciplinas:
            | { name: string }
            | { name: string }[];
        }
      | {
          id: string;
          name: string;
          tag: string;
          disciplinas:
            | { name: string }
            | { name: string }[];
        }[];
  };

  const turmas = (turmasAluno ?? []).map((turmaAluno: TurmaAlunoComTurmaRow) => {
    const turma = Array.isArray(turmaAluno.turmas)
      ? turmaAluno.turmas[0]
      : turmaAluno.turmas;
    const disciplina = Array.isArray(turma?.disciplinas)
      ? turma.disciplinas[0]
      : turma?.disciplinas;

    return {
      id: turma?.id ?? "",
      name: turma?.name ?? "",
      tag: turma?.tag ?? "",
      disciplinaName: disciplina?.name ?? null,
    };
  });

  return {
    id: profileData.user_id,
    name: profileData.name ?? "",
    email: profileData.email ?? "",
    telefone: profileData.telefone,
    age: dadosAluno?.age ?? null,
    dateOfBirth: dadosAluno?.date_of_birth ?? null,
    turmas,
  };
}
