"use server";

import { logAudit } from "@/app/_lib/actions/audit";
import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ObservacaoPedagogica = {
  id: string;
  aluno_id: string;
  autor_id: string;
  autor_name: string;
  autor_role: string;
  conteudo: string;
  created_at: string;
  updated_at: string;
};

export async function listObservacoesPedagogicasDoAluno(
  studentId: string,
): Promise<ObservacaoPedagogica[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("observacoes_pedagogicas")
    .select(
      `
      id,
      aluno_id,
      author_id,
      content,
      created_at,
      updated_at,
      autor:profiles!observacoes_pedagogicas_author_id_fkey(name, role)
    `,
    )
    .eq("aluno_id", studentId)
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === "42P01") {
      return [];
    }
    throw new Error(error.message);
  }

  type ObservacaoRow = {
    id: string;
    aluno_id: string;
    author_id: string;
    content: string;
    created_at: string;
    updated_at: string;
    autor:
      | { name: string | null; role: string | null }
      | { name: string | null; role: string | null }[];
  };

  return (data ?? []).map((obs: ObservacaoRow) => {
    const autorObservacao = Array.isArray(obs.autor) ? obs.autor[0] : obs.autor;
    return {
      id: obs.id,
      aluno_id: obs.aluno_id,
      autor_id: obs.author_id,
      autor_name: autorObservacao?.name ?? "Desconhecido",
      autor_role: autorObservacao?.role ?? "desconhecido",
      conteudo: obs.content,
      created_at: obs.created_at,
      updated_at: obs.updated_at,
    };
  });
}

export async function canEditObservacoesPedagogicas(): Promise<boolean> {
  const profile = await getUserProfile();
  if (!profile) return false;

  return profile.role === "coordenação" || profile.role === "administrativo";
}

export async function listObservacoesForTeacher(
  teacherId: string,
): Promise<ObservacaoPedagogica[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (profile.role !== "professor") throw new Error("Sem permissão.");
  if (profile.user_id !== teacherId) throw new Error("Acesso inválido.");

  const supabase = await createServerSupabaseClient();

  const { data: turmasProfessor, error: turmasError } = await supabase
    .from("turmas")
    .select("id")
    .eq("professor_id", teacherId);

  if (turmasError) {
    if (turmasError.code === "42P01") {
      return [];
    }
    throw new Error(turmasError.message);
  }

  if (!turmasProfessor || turmasProfessor.length === 0) {
    return [];
  }

  const turmaIds = turmasProfessor.map((turma) => turma.id);

  const { data: turmaAlunos, error: alunosError } = await supabase
    .from("turma_alunos")
    .select("aluno_id")
    .in("turma_id", turmaIds);

  if (alunosError) {
    if (alunosError.code === "42P01") {
      return [];
    }
    throw new Error(alunosError.message);
  }

  if (!turmaAlunos || turmaAlunos.length === 0) {
    return [];
  }

  const alunoIds = [
    ...new Set(turmaAlunos.map((turmaAluno) => turmaAluno.aluno_id)),
  ];

  const { data: observacoes, error } = await supabase
    .from("observacoes_pedagogicas")
    .select(
      `
      id,
      aluno_id,
      author_id,
      content,
      created_at,
      updated_at,
      autor:profiles!observacoes_pedagogicas_author_id_fkey(name, role)
    `,
    )
    .in("aluno_id", alunoIds)
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === "42P01") {
      return [];
    }
    throw new Error(error.message);
  }

  type ObservacaoRow = {
    id: string;
    aluno_id: string;
    author_id: string;
    content: string;
    created_at: string;
    updated_at: string;
    autor:
      | { name: string | null; role: string | null }
      | { name: string | null; role: string | null }[];
  };

  return (observacoes ?? []).map((obs: ObservacaoRow) => {
    const autorObservacao = Array.isArray(obs.autor) ? obs.autor[0] : obs.autor;
    return {
      id: obs.id,
      aluno_id: obs.aluno_id,
      autor_id: obs.author_id,
      autor_name: autorObservacao?.name ?? "Desconhecido",
      autor_role: autorObservacao?.role ?? "desconhecido",
      conteudo: obs.content,
      created_at: obs.created_at,
      updated_at: obs.updated_at,
    };
  });
}

export async function createObservacaoPedagogica(input: {
  alunoId?: string;
  turmaId?: string;
  content: string;
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  if (profile.role !== "coordenação" && profile.role !== "administrativo") {
    throw new Error("Sem permissão para criar observações pedagógicas.");
  }

  if (!input.alunoId && !input.turmaId) {
    throw new Error("É necessário informar aluno ou turma.");
  }

  const content = input.content.trim();
  if (!content) {
    throw new Error("Conteúdo da observação é obrigatório.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: newObservacao, error: insertError } = await supabase
    .from("observacoes_pedagogicas")
    .insert({
      aluno_id: input.alunoId || null,
      turma_id: input.turmaId || null,
      content,
      author_id: profile.user_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (insertError) throw new Error(insertError.message);

  if (newObservacao) {
    await logAudit({
      action: "create",
      entity: "observacao_pedagogica",
      entityId: newObservacao.id,
      newValue: {
        aluno_id: input.alunoId,
        turma_id: input.turmaId,
        content,
      },
      description: `Observação pedagógica criada por ${profile.name ?? profile.email}`,
    });
  }

  revalidatePath("/admin/alunos");
  revalidatePath("/admin");
}

export async function updateObservacaoPedagogica(input: {
  observacaoId: string;
  content: string;
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  if (profile.role !== "coordenação" && profile.role !== "administrativo") {
    throw new Error("Sem permissão para editar observações pedagógicas.");
  }

  const content = input.content.trim();
  if (!content) {
    throw new Error("Conteúdo da observação é obrigatório.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: currentObs, error: fetchError } = await supabase
    .from("observacoes_pedagogicas")
    .select("id, content")
    .eq("id", input.observacaoId)
    .single();

  if (fetchError) throw new Error(fetchError.message);
  if (!currentObs) throw new Error("Observação não encontrada.");

  const oldValue = {
    content: currentObs.content,
  };

  const { error: updateError } = await supabase
    .from("observacoes_pedagogicas")
    .update({
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.observacaoId);

  if (updateError) throw new Error(updateError.message);

  await logAudit({
    action: "update",
    entity: "observacao_pedagogica",
    entityId: input.observacaoId,
    oldValue,
    newValue: { content },
    description: `Observação pedagógica atualizada por ${profile.name ?? profile.email}`,
  });

  revalidatePath("/admin/alunos");
  revalidatePath("/admin");
}

export async function deleteObservacaoPedagogica(observacaoId: string) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  if (profile.role !== "coordenação" && profile.role !== "administrativo") {
    throw new Error("Sem permissão para excluir observações pedagógicas.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: observacao, error: fetchError } = await supabase
    .from("observacoes_pedagogicas")
    .select("id, content, aluno_id, turma_id")
    .eq("id", observacaoId)
    .single();

  if (fetchError) throw new Error(fetchError.message);
  if (!observacao) throw new Error("Observação não encontrada.");

  const { error: deleteError } = await supabase
    .from("observacoes_pedagogicas")
    .delete()
    .eq("id", observacaoId);

  if (deleteError) throw new Error(deleteError.message);

  await logAudit({
    action: "delete",
    entity: "observacao_pedagogica",
    entityId: observacaoId,
    oldValue: {
      content: observacao.content,
      aluno_id: observacao.aluno_id,
      turma_id: observacao.turma_id,
    },
    description: `Observação pedagógica excluída por ${profile.name ?? profile.email}`,
  });

  revalidatePath("/admin/alunos");
  revalidatePath("/admin");
}
