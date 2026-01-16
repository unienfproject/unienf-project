"use server";

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

type PickerItem = { id: string; label: string };

export type NoticeRow = {
  id: string;
  title: string;
  message: string;
  created_at: string; // ISO
  author_role: "professor" | "coordenação" | "administrativo";
  author_name: string;
  audience:
    | { type: "turma"; classId: string; classLabel: string }
    | { type: "alunos"; studentCount: number };
};

export async function listNoticesForTeacher(
  teacherId: string,
): Promise<NoticeRow[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== teacherId) throw new Error("Acesso inválido.");

  // Usar cliente admin para evitar recursão infinita nas políticas RLS
  // As permissões já foram validadas acima (é professor e teacherId corresponde ao user_id)
  const adminSupabase = getAdminSupabase();

  // Buscar avisos criados pelo professor
  // Nota: Usamos cliente admin para evitar recursão infinita nas políticas RLS
  const { data: avisos, error: avisosError } = await adminSupabase
    .from("avisos")
    .select(
      `
      id,
      title,
      message,
      created_at,
      scope_type,
      turma_id,
      author_id
    `,
    )
    .eq("author_id", teacherId)
    .order("created_at", { ascending: false });

  if (avisosError) {
    if (avisosError.code === "42P01") {
      return [];
    }
    throw new Error(avisosError.message);
  }

  type AvisoRow = {
    id: string;
    title: string;
    message: string;
    created_at: string;
    scope_type: "turma" | "alunos";
    turma_id: string | null;
    author_id: string;
  };

  // Usar dados do perfil atual (já validado que é o autor)
  const autorName = profile.name ?? profile.email ?? "Professor";
  const autorRole =
    (profile.role as "professor" | "coordenação" | "administrativo") ??
    "professor";

  const avisosFormatados: NoticeRow[] = [];

  for (const aviso of (avisos ?? []) as AvisoRow[]) {
    if (aviso.scope_type === "turma" && aviso.turma_id) {
      const { data: turma } = await adminSupabase
        .from("turmas")
        .select("id, tag")
        .eq("id", aviso.turma_id)
        .single();

      avisosFormatados.push({
        id: aviso.id,
        title: aviso.title,
        message: aviso.message,
        created_at: aviso.created_at,
        author_role: autorRole,
        author_name: autorName,
        audience: {
          type: "turma",
          classId: aviso.turma_id,
          classLabel: turma ? turma.tag : "Turma",
        },
      });
    } else if (aviso.scope_type === "alunos") {
      const { count } = await adminSupabase
        .from("aviso_alunos")
        .select("*", { count: "exact", head: true })
        .eq("aviso_id", aviso.id);

      avisosFormatados.push({
        id: aviso.id,
        title: aviso.title,
        message: aviso.message,
        created_at: aviso.created_at,
        author_role: autorRole,
        author_name: autorName,
        audience: {
          type: "alunos",
          studentCount: count ?? 0,
        },
      });
    }
  }

  return avisosFormatados;
}

export async function listTeacherClassesForPicker(
  teacherId: string,
): Promise<PickerItem[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== teacherId) throw new Error("Acesso inválido.");

  const supabase = await createServerSupabaseClient();

  const { data: turmas, error } = await supabase
    .from("turmas")
    .select("id, tag")
    .eq("professor_id", teacherId)
    .eq("status", "ativa")
    .order("tag");

  if (error) {
    if (error.code === "42P01") {
      return [];
    }
    throw new Error(error.message);
  }

  return (turmas ?? []).map((turma) => ({
    id: turma.id,
    label: turma.tag,
  }));
}

export async function listStudentsForPicker(): Promise<PickerItem[]> {
  const supabase = await createServerSupabaseClient();

  const { data: alunos, error } = await supabase
    .from("profiles")
    .select("user_id, name, email")
    .eq("role", "aluno")
    .order("name");

  if (error) {
    if (error.code === "42P01") {
      return [];
    }
    throw new Error(error.message);
  }

  return (alunos ?? []).map((aluno) => ({
    id: aluno.user_id,
    label: aluno.name ?? aluno.email ?? aluno.user_id,
  }));
}

export async function createNotice(input: {
  teacherId: string;
  title: string;
  message: string;
  target:
    | { type: "turma"; classId: string }
    | { type: "alunos"; studentIds: string[] };
}): Promise<{ avisoId: string }> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== input.teacherId) throw new Error("Acesso inválido.");

  const supabase = await createServerSupabaseClient();

  if (input.target.type === "turma") {
    const { data: turma, error: turmaError } = await supabase
      .from("turmas")
      .select("id, professor_id")
      .eq("id", input.target.classId)
      .single();

    if (turmaError) throw new Error(turmaError.message);
    if (!turma) throw new Error("Turma não encontrada.");
    if (turma.professor_id !== input.teacherId) {
      throw new Error(
        "Você não tem permissão para criar aviso para esta turma.",
      );
    }
  }

  const { data: aviso, error: avisoError } = await supabase
    .from("avisos")
    .insert({
      title: input.title.trim(),
      message: input.message.trim(),
      author_id: profile.user_id,
      scope_type: input.target.type,
      turma_id: input.target.type === "turma" ? input.target.classId : null,
      created_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (avisoError) throw new Error(avisoError.message);
  if (!aviso) throw new Error("Falha ao criar aviso.");

  if (input.target.type === "alunos") {
    if (input.target.studentIds.length > 0) {
      const avisoAlunos = input.target.studentIds.map((alunoId) => ({
        aviso_id: aviso.id,
        aluno_id: alunoId,
      }));

      const { error } = await supabase.from("aviso_alunos").insert(avisoAlunos);
      if (error) throw new Error(error.message);
    }
  }

  revalidatePath("/professores/avisos");
  return { avisoId: aviso.id };
}

export async function createAvisoAdmin(input: {
  title: string;
  message: string;
  target:
    | { type: "turma"; classId: string }
    | { type: "alunos"; studentIds: string[] };
}): Promise<{ avisoId: string }> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "administrativo") {
    throw new Error("Sem permissão para criar avisos.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: aviso, error: avisoError } = await supabase
    .from("avisos")
    .insert({
      title: input.title.trim(),
      message: input.message.trim(),
      author_id: profile.user_id,
      scope_type: input.target.type,
      turma_id: input.target.type === "turma" ? input.target.classId : null,
      created_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (avisoError) throw new Error(avisoError.message);
  if (!aviso) throw new Error("Falha ao criar aviso.");

  if (input.target.type === "alunos") {
    if (input.target.studentIds.length > 0) {
      const avisoAlunos = input.target.studentIds.map((alunoId) => ({
        aviso_id: aviso.id,
        aluno_id: alunoId,
      }));

      const { error } = await supabase.from("aviso_alunos").insert(avisoAlunos);
      if (error) throw new Error(error.message);
    }
  }

  revalidatePath("/admin/avisos");
  return { avisoId: aviso.id };
}
