"use server";

import { getUserProfile } from "@/app/_lib/actions/profile";
import { saveDbErrorLog } from "@/app/_lib/server/dbErrorLogger";
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
  created_at: string;
  author_role: "professor" | "coordenação" | "administrativo";
  author_name: string;
  audience:
    | { type: "turma"; classId: string; classLabel: string }
    | { type: "alunos"; studentCount: number };
};

type RawAviso = {
  id: string;
  title: string;
  message: string;
  created_at: string;
  scope_type: "turma" | "alunos";
  turma_id: string | null;
  author_id: string;
  author?: { name?: string | null; role?: string | null } | null;
};

async function getTeacherContext(teacherId: string) {
  const adminSupabase = getAdminSupabase();

  const { data: turmas, error: turmasError } = await adminSupabase
    .from("turmas")
    .select("id, tag")
    .eq("professor_id", teacherId)
    .eq("status", "ativa")
    .order("tag");

  if (turmasError) throw new Error(turmasError.message);

  const classes = (turmas ?? []).map((turma) => ({
    id: turma.id,
    label: turma.tag,
  }));
  const classIds = classes.map((turma) => turma.id);

  const classLabelMap = new Map(classes.map((turma) => [turma.id, turma.label]));
  const studentIds = new Set<string>();

  if (classIds.length > 0) {
    const { data: turmaAlunos, error: turmaAlunosError } = await adminSupabase
      .from("turma_alunos")
      .select("aluno_id")
      .in("turma_id", classIds);

    if (turmaAlunosError) throw new Error(turmaAlunosError.message);

    for (const row of turmaAlunos ?? []) {
      if (row.aluno_id) {
        studentIds.add(String(row.aluno_id));
      }
    }
  }

  return {
    adminSupabase,
    classes,
    classIds,
    classLabelMap,
    studentIds: Array.from(studentIds),
  };
}

async function mapAvisosToNoticeRows(
  adminSupabase: ReturnType<typeof getAdminSupabase>,
  avisos: RawAviso[],
  classLabelMap?: Map<string, string>,
): Promise<NoticeRow[]> {
  const noticeRows: NoticeRow[] = [];

  for (const aviso of avisos) {
    const authorName = aviso.author?.name ?? "Não informado";
    const authorRole =
      (aviso.author?.role as NoticeRow["author_role"] | undefined) ?? "administrativo";

    if (aviso.scope_type === "turma" && aviso.turma_id) {
      let classLabel = classLabelMap?.get(aviso.turma_id) ?? null;

      if (!classLabel) {
        const { data: turma } = await adminSupabase
          .from("turmas")
          .select("tag")
          .eq("id", aviso.turma_id)
          .maybeSingle();
        classLabel = turma?.tag ?? "Turma";
      }

      noticeRows.push({
        id: aviso.id,
        title: aviso.title,
        message: aviso.message,
        created_at: aviso.created_at,
        author_role: authorRole,
        author_name: authorName,
        audience: {
          type: "turma",
          classId: aviso.turma_id,
          classLabel: classLabel ?? "Turma",
        },
      });

      continue;
    }

    const { count } = await adminSupabase
      .from("aviso_alunos")
      .select("*", { count: "exact", head: true })
      .eq("aviso_id", aviso.id);

    noticeRows.push({
      id: aviso.id,
      title: aviso.title,
      message: aviso.message,
      created_at: aviso.created_at,
      author_role: authorRole,
      author_name: authorName,
      audience: {
        type: "alunos",
        studentCount: count ?? 0,
      },
    });
  }

  return noticeRows;
}

export async function listNoticesForTeacher(
  teacherId: string,
): Promise<NoticeRow[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== teacherId) throw new Error("Acesso inválido.");

  const { adminSupabase, classIds, classLabelMap, studentIds } =
    await getTeacherContext(teacherId);

  const relevantNoticeIds = new Set<string>();
  const rawNoticeMap = new Map<string, RawAviso>();

  const { data: ownAvisos, error: ownAvisosError } = await adminSupabase
    .from("avisos")
    .select(
      `
      id,
      title,
      message,
      created_at,
      scope_type,
      turma_id,
      author_id,
      profiles:profiles!avisos_author_id_fkey(name, role)
    `,
    )
    .eq("author_id", teacherId)
    .order("created_at", { ascending: false });

  if (ownAvisosError) {
    if (ownAvisosError.code === "42P01") return [];
    throw new Error(ownAvisosError.message);
  }

  for (const aviso of ownAvisos ?? []) {
    const row: RawAviso = {
      id: String(aviso.id),
      title: String(aviso.title ?? ""),
      message: String(aviso.message ?? ""),
      created_at: String(aviso.created_at ?? ""),
      scope_type: aviso.scope_type as "turma" | "alunos",
      turma_id: aviso.turma_id ? String(aviso.turma_id) : null,
      author_id: String(aviso.author_id ?? ""),
      author: Array.isArray(aviso.profiles) ? aviso.profiles[0] : aviso.profiles,
    };
    rawNoticeMap.set(row.id, row);
    relevantNoticeIds.add(row.id);
  }

  if (classIds.length > 0) {
    const { data: classAvisos, error: classAvisosError } = await adminSupabase
      .from("avisos")
      .select(
        `
        id,
        title,
        message,
        created_at,
        scope_type,
        turma_id,
        author_id,
        profiles:profiles!avisos_author_id_fkey(name, role)
      `,
      )
      .eq("scope_type", "turma")
      .in("turma_id", classIds)
      .order("created_at", { ascending: false });

    if (classAvisosError && classAvisosError.code !== "42P01") {
      throw new Error(classAvisosError.message);
    }

    for (const aviso of classAvisos ?? []) {
      const row: RawAviso = {
        id: String(aviso.id),
        title: String(aviso.title ?? ""),
        message: String(aviso.message ?? ""),
        created_at: String(aviso.created_at ?? ""),
        scope_type: aviso.scope_type as "turma" | "alunos",
        turma_id: aviso.turma_id ? String(aviso.turma_id) : null,
        author_id: String(aviso.author_id ?? ""),
        author: Array.isArray(aviso.profiles) ? aviso.profiles[0] : aviso.profiles,
      };
      rawNoticeMap.set(row.id, row);
      relevantNoticeIds.add(row.id);
    }
  }

  if (studentIds.length > 0) {
    const { data: directTargets, error: directTargetsError } = await adminSupabase
      .from("aviso_alunos")
      .select("aviso_id")
      .in("aluno_id", studentIds);

    if (directTargetsError && directTargetsError.code !== "42P01") {
      throw new Error(directTargetsError.message);
    }

    const directNoticeIds = Array.from(
      new Set((directTargets ?? []).map((row) => String(row.aviso_id))),
    );

    if (directNoticeIds.length > 0) {
      const { data: directAvisos, error: directAvisosError } = await adminSupabase
        .from("avisos")
        .select(
          `
          id,
          title,
          message,
          created_at,
          scope_type,
          turma_id,
          author_id,
          profiles:profiles!avisos_author_id_fkey(name, role)
        `,
        )
        .in("id", directNoticeIds)
        .order("created_at", { ascending: false });

      if (directAvisosError && directAvisosError.code !== "42P01") {
        throw new Error(directAvisosError.message);
      }

      for (const aviso of directAvisos ?? []) {
        const row: RawAviso = {
          id: String(aviso.id),
          title: String(aviso.title ?? ""),
          message: String(aviso.message ?? ""),
          created_at: String(aviso.created_at ?? ""),
          scope_type: aviso.scope_type as "turma" | "alunos",
          turma_id: aviso.turma_id ? String(aviso.turma_id) : null,
          author_id: String(aviso.author_id ?? ""),
          author: Array.isArray(aviso.profiles) ? aviso.profiles[0] : aviso.profiles,
        };
        rawNoticeMap.set(row.id, row);
        relevantNoticeIds.add(row.id);
      }
    }
  }

  const orderedAvisos = Array.from(relevantNoticeIds)
    .map((id) => rawNoticeMap.get(id))
    .filter((row): row is RawAviso => Boolean(row))
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  return mapAvisosToNoticeRows(adminSupabase, orderedAvisos, classLabelMap);
}

export async function listTeacherClassesForPicker(
  teacherId: string,
): Promise<PickerItem[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== teacherId) throw new Error("Acesso inválido.");

  const { classes } = await getTeacherContext(teacherId);
  return classes;
}

export async function listStudentsForPicker(
  teacherId?: string,
): Promise<PickerItem[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const supabase = await createServerSupabaseClient();

  if (teacherId) {
    if (profile.role !== "professor") throw new Error("Sem permissão.");
    if (profile.user_id !== teacherId) throw new Error("Acesso inválido.");

    const { studentIds } = await getTeacherContext(teacherId);
    if (studentIds.length === 0) return [];

    const { data: alunos, error } = await supabase
      .from("profiles")
      .select("user_id, name, email")
      .eq("role", "aluno")
      .in("user_id", studentIds)
      .order("name");

    if (error) {
      if (error.code === "42P01") return [];
      throw new Error(error.message);
    }

    return (alunos ?? []).map((aluno) => ({
      id: aluno.user_id,
      label: aluno.name ?? aluno.email ?? aluno.user_id,
    }));
  }

  const { data: alunos, error } = await supabase
    .from("profiles")
    .select("user_id, name, email")
    .eq("role", "aluno")
    .order("name");

  if (error) {
    if (error.code === "42P01") return [];
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
  const { classIds, studentIds } = await getTeacherContext(input.teacherId);

  if (input.target.type === "turma") {
    if (!classIds.includes(input.target.classId)) {
      throw new Error(
        "Você não tem permissão para criar aviso para esta turma.",
      );
    }
  }

  if (input.target.type === "alunos") {
    const allowedStudentIds = new Set(studentIds);
    const invalidStudentIds = input.target.studentIds.filter(
      (studentId) => !allowedStudentIds.has(studentId),
    );

    if (invalidStudentIds.length > 0) {
      throw new Error(
        "Você não tem permissão para enviar aviso para um ou mais alunos selecionados.",
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

  if (avisoError) {
    await saveDbErrorLog({
      action: "teacher/createNotice",
      stage: "insert.avisos",
      actorId: profile.user_id,
      payload: {
        scope_type: input.target.type,
        turma_id: input.target.type === "turma" ? input.target.classId : null,
      },
      error: avisoError,
    });
    throw new Error(avisoError.message);
  }
  if (!aviso) throw new Error("Falha ao criar aviso.");

  if (input.target.type === "alunos" && input.target.studentIds.length > 0) {
    const avisoAlunos = input.target.studentIds.map((alunoId) => ({
      aviso_id: aviso.id,
      aluno_id: alunoId,
    }));

    const { error } = await supabase.from("aviso_alunos").insert(avisoAlunos);
    if (error) {
      await saveDbErrorLog({
        action: "teacher/createNotice",
        stage: "insert.aviso_alunos",
        actorId: profile.user_id,
        payload: {
          aviso_id: aviso.id,
          student_count: input.target.studentIds.length,
        },
        error,
      });
      throw new Error(error.message);
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

  if (avisoError) {
    await saveDbErrorLog({
      action: "admin/createAvisoAdmin",
      stage: "insert.avisos",
      actorId: profile.user_id,
      payload: {
        scope_type: input.target.type,
        turma_id: input.target.type === "turma" ? input.target.classId : null,
      },
      error: avisoError,
    });
    throw new Error(avisoError.message);
  }
  if (!aviso) throw new Error("Falha ao criar aviso.");

  if (input.target.type === "alunos" && input.target.studentIds.length > 0) {
    const avisoAlunos = input.target.studentIds.map((alunoId) => ({
      aviso_id: aviso.id,
      aluno_id: alunoId,
    }));

    const { error } = await supabase.from("aviso_alunos").insert(avisoAlunos);
    if (error) {
      await saveDbErrorLog({
        action: "admin/createAvisoAdmin",
        stage: "insert.aviso_alunos",
        actorId: profile.user_id,
        payload: {
          aviso_id: aviso.id,
          student_count: input.target.studentIds.length,
        },
        error,
      });
      throw new Error(error.message);
    }
  }

  revalidatePath("/admin/avisos");
  return { avisoId: aviso.id };
}
