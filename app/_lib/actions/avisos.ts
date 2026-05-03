"use server";

import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";

type PickerItem = { id: string; label: string };

export async function listTurmasForAvisoPicker(): Promise<PickerItem[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("turmas")
    .select("id, tag")
    .eq("status", "ativa")
    .order("tag");

  if (error) throw new Error(error.message);

  return (data ?? []).map((t) => ({
    id: t.id,
    label: `${t.tag}`,
  }));
}

export async function listAlunosForAvisoPicker(): Promise<PickerItem[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, name, email")
    .eq("role", "aluno")
    .order("name");

  if (error) throw new Error(error.message);

  return (data ?? []).map((p) => ({
    id: p.user_id,
    label: p.name ?? p.email ?? p.user_id,
  }));
}

export type AvisoStatus = "enviado" | "falhou" | "rascunho";

export type AvisoListRow = {
  id: string;
  titulo: string;
  mensagem: string;
  status: AvisoStatus;
  createdAt: string;
  createdByName: string | null;
  targetLabel: string | null;
  deliveredCount: number;
  totalTargets: number;
};

export type AvisoForStudent = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  authorName: string | null;
  authorRole: string | null;
  scopeType: "turma" | "alunos";
  turmaName: string | null;
};

async function requireAllowedRoles() {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const role = profile.role ?? "";
  const allowed = ["administrativo", "coordenação", "recepção", "professor"];
  if (!allowed.includes(role)) throw new Error("Sem permissão.");

  return profile;
}

async function fetchAvisosForStudentId(
  studentId: string,
): Promise<AvisoForStudent[]> {
  const supabase = await createServerSupabaseClient();

  const { data: avisoAlunos, error: avisoAlunosError } = await supabase
    .from("aviso_alunos")
    .select("aviso_id")
    .eq("aluno_id", studentId);

  if (avisoAlunosError) {
    if (avisoAlunosError.code === "42P01") return [];
    throw new Error(avisoAlunosError.message);
  }

  const avisoIds =
    avisoAlunos && avisoAlunos.length > 0
      ? avisoAlunos.map((aa) => aa.aviso_id)
      : [];

  const { data: turmaAlunos, error: turmaAlunosError } = await supabase
    .from("turma_alunos")
    .select("turma_id")
    .eq("aluno_id", studentId);

  let turmaIds: string[] = [];
  if (!turmaAlunosError && turmaAlunos) {
    turmaIds = turmaAlunos.map((ta) => ta.turma_id);
  }

  const avisosFormatados: AvisoForStudent[] = [];

  if (avisoIds.length > 0) {
    const { data: avisosDiretos, error: avisosDiretosError } = await supabase
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
      .in("id", avisoIds)
      .order("created_at", { ascending: false });

    if (!avisosDiretosError && avisosDiretos) {
      for (const aviso of avisosDiretos) {
        const autor = Array.isArray(aviso.profiles)
          ? aviso.profiles[0]
          : aviso.profiles;

        avisosFormatados.push({
          id: String(aviso.id),
          title: String(aviso.title ?? ""),
          message: String(aviso.message ?? ""),
          createdAt: String(aviso.created_at ?? ""),
          authorName: autor?.name ? String(autor.name) : null,
          authorRole: autor?.role ? String(autor.role) : null,
          scopeType: (aviso.scope_type as "turma" | "alunos") ?? "alunos",
          turmaName: null,
        });
      }
    }
  }

  if (turmaIds.length > 0) {
    const { data: avisosTurmas, error: avisosTurmasError } = await supabase
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
      .in("turma_id", turmaIds)
      .order("created_at", { ascending: false });

    if (!avisosTurmasError && avisosTurmas) {
      for (const aviso of avisosTurmas) {
        if (avisosFormatados.some((a) => a.id === String(aviso.id))) {
          continue;
        }

        const autor = Array.isArray(aviso.profiles)
          ? aviso.profiles[0]
          : aviso.profiles;

        let turmaName: string | null = null;
        if (aviso.turma_id) {
          const { data: turma } = await supabase
            .from("turmas")
            .select("tag")
            .eq("id", aviso.turma_id)
            .single();
          if (turma) {
            turmaName = turma.tag;
          }
        }

        avisosFormatados.push({
          id: String(aviso.id),
          title: String(aviso.title ?? ""),
          message: String(aviso.message ?? ""),
          createdAt: String(aviso.created_at ?? ""),
          authorName: autor?.name ? String(autor.name) : null,
          authorRole: autor?.role ? String(autor.role) : null,
          scopeType: "turma",
          turmaName,
        });
      }
    }
  }

  avisosFormatados.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return avisosFormatados;
}

export async function listAvisosForStudent(
  studentId: string,
): Promise<AvisoForStudent[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const allowedRoles = ["recepção", "administrativo", "coordenação"];
  if (!allowedRoles.includes(profile.role ?? "")) {
    throw new Error("Sem permissão para listar avisos do aluno.");
  }

  return fetchAvisosForStudentId(studentId);
}

export async function listMyAvisosForAluno(): Promise<AvisoForStudent[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "aluno") {
    throw new Error("Sem permissão para listar os próprios avisos.");
  }

  return fetchAvisosForStudentId(profile.user_id);
}

export async function listAvisos(): Promise<AvisoListRow[]> {
  await requireAllowedRoles();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
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
      profiles:profiles!avisos_author_id_fkey ( name )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("[listAvisos] erro:", error.message);
    return [];
  }

  type AvisoRow = {
    id: unknown;
    title: unknown;
    message: unknown;
    created_at: unknown;
    scope_type: unknown;
    turma_id: unknown;
    author_id: unknown;
    profiles: { name: unknown } | { name: unknown }[] | null;
  };

  const rows = (data ?? []) as AvisoRow[];

  const targetCountMap = new Map<string, number>();
  const turmaIds = Array.from(
    new Set(
      rows
        .filter((row) => row.scope_type === "turma" && row.turma_id)
        .map((row) => String(row.turma_id)),
    ),
  );
  const turmaLabelMap = new Map<string, string>();

  if (turmaIds.length > 0) {
    const { data: turmas } = await supabase
      .from("turmas")
      .select("id, tag")
      .in("id", turmaIds);

    for (const turma of turmas ?? []) {
      turmaLabelMap.set(String(turma.id), String(turma.tag ?? turma.id));
    }
  }

  for (const aviso of rows) {
    const id = String(aviso.id);
    if (aviso.scope_type === "turma" && aviso.turma_id) {
      const { count } = await supabase
        .from("turma_alunos")
        .select("*", { count: "exact", head: true })
        .eq("turma_id", aviso.turma_id);
      targetCountMap.set(id, count ?? 0);
    } else if (aviso.scope_type === "alunos") {
      const { count } = await supabase
        .from("aviso_alunos")
        .select("*", { count: "exact", head: true })
        .eq("aviso_id", id);
      targetCountMap.set(id, count ?? 0);
    } else {
      targetCountMap.set(id, 0);
    }
  }

  return rows.map((r) => {
    const profile = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
    const id = String(r.id);
    const totalTargets = targetCountMap.get(id) ?? 0;

    let targetLabel: string | null = null;
    if (r.scope_type === "turma" && r.turma_id) {
      const turmaId = String(r.turma_id);
      targetLabel = `Turma: ${turmaLabelMap.get(turmaId) ?? turmaId}`;
    } else if (r.scope_type === "alunos") {
      targetLabel =
        totalTargets === 1
          ? "1 aluno selecionado"
          : `${totalTargets} alunos selecionados`;
    }

    return {
      id,
      titulo: String(r.title ?? ""),
      mensagem: String(r.message ?? ""),
      status: "enviado" as AvisoStatus,
      createdAt: String(r.created_at ?? ""),
      createdByName: profile?.name ? String(profile.name) : null,
      targetLabel,
      deliveredCount: totalTargets,
      totalTargets,
    };
  });
}
