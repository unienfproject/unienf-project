"use server";

import { logAudit } from "@/app/_lib/actions/audit";
import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { revalidatePath } from "next/cache";

export type Etiqueta = {
  id: string;
  name: string;
  color?: string | null;
  created_at: string;
};

export async function listEtiquetas(): Promise<Etiqueta[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("etiquetas")
    .select("id, name, color, created_at")
    .order("name", { ascending: true });

  if (error) {
    if (error.code === "42P01") {
      return [];
    }
    throw new Error(error.message);
  }

  return (data ?? []).map((e) => ({
    id: e.id,
    name: e.name,
    color: e.color,
    created_at: e.created_at,
  }));
}

export async function listEtiquetasDoAluno(
  studentId: string,
): Promise<Etiqueta[]> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("aluno_etiquetas")
    .select(
      `
      etiqueta_id,
      etiquetas:etiquetas!aluno_etiquetas_etiqueta_id_fkey(id, name, color, created_at)
    `,
    )
    .eq("aluno_id", studentId);

  if (error) {
    if (error.code === "42P01") {
      return [];
    }
    throw new Error(error.message);
  }

  const etiquetas: Etiqueta[] = [];

  for (const ae of data ?? []) {
    const etiqueta = Array.isArray(ae.etiquetas)
      ? ae.etiquetas[0]
      : ae.etiquetas;
    if (etiqueta) {
      etiquetas.push({
        id: etiqueta.id,
        name: etiqueta.name,
        color: etiqueta.color,
        created_at: etiqueta.created_at,
      });
    }
  }

  return etiquetas;
}

export async function atribuirEtiquetaAoAluno(input: {
  studentId: string;
  etiquetaId: string;
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (
    profile.role !== "recepção" &&
    profile.role !== "administrativo" &&
    profile.role !== "coordenação"
  ) {
    throw new Error("Sem permissão para atribuir etiquetas.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: etiqueta, error: etiquetaError } = await supabase
    .from("etiquetas")
    .select("id, name")
    .eq("id", input.etiquetaId)
    .single();

  if (etiquetaError) throw new Error("Etiqueta não encontrada.");
  if (!etiqueta) throw new Error("Etiqueta não encontrada.");

  const { data: existing, error: checkError } = await supabase
    .from("aluno_etiquetas")
    .select("id")
    .eq("aluno_id", input.studentId)
    .eq("etiqueta_id", input.etiquetaId)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    throw new Error(checkError.message);
  }

  if (existing) {
    return;
  }

  const { error: insertError } = await supabase.from("aluno_etiquetas").insert({
    aluno_id: input.studentId,
    etiqueta_id: input.etiquetaId,
    created_at: new Date().toISOString(),
  });

  if (insertError) {
    if (insertError.code === "42P01") {
      throw new Error(
        "Tabela aluno_etiquetas não existe. Crie a tabela no Supabase primeiro.",
      );
    }
    throw new Error(insertError.message);
  }

  revalidatePath(`/recepcao/alunos`);
  revalidatePath(`/admin/alunos`);
  revalidatePath(`/recepcao/alunos/${input.studentId}`);
  revalidatePath(`/admin/alunos/${input.studentId}`);
}

export async function removerEtiquetaDoAluno(input: {
  studentId: string;
  etiquetaId: string;
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");
  if (
    profile.role !== "recepção" &&
    profile.role !== "administrativo" &&
    profile.role !== "coordenação"
  ) {
    throw new Error("Sem permissão para remover etiquetas.");
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("aluno_etiquetas")
    .delete()
    .eq("aluno_id", input.studentId)
    .eq("etiqueta_id", input.etiquetaId);

  if (error) {
    if (error.code === "42P01") {
      throw new Error(
        "Tabela aluno_etiquetas não existe. Crie a tabela no Supabase primeiro.",
      );
    }
    throw new Error(error.message);
  }

  revalidatePath(`/recepcao/alunos`);
  revalidatePath(`/admin/alunos`);
  revalidatePath(`/recepcao/alunos/${input.studentId}`);
  revalidatePath(`/admin/alunos/${input.studentId}`);
}

export async function createEtiqueta(input: { name: string; color?: string }) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  if (profile.role !== "coordenação" && profile.role !== "administrativo") {
    throw new Error("Sem permissão para criar etiquetas.");
  }

  const name = input.name.trim();
  if (!name) {
    throw new Error("Nome da etiqueta é obrigatório.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: existing, error: checkError } = await supabase
    .from("etiquetas")
    .select("id")
    .eq("name", name)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    throw new Error(checkError.message);
  }

  if (existing) {
    throw new Error("Já existe uma etiqueta com este nome.");
  }

  const { data: newEtiqueta, error: insertError } = await supabase
    .from("etiquetas")
    .insert({
      name,
      color: input.color?.trim() || null,
      created_by: profile.user_id,
      created_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (insertError) throw new Error(insertError.message);

  if (newEtiqueta) {
    await logAudit({
      action: "create",
      entity: "etiqueta",
      entityId: newEtiqueta.id,
      newValue: { name, color: input.color },
      description: `Etiqueta "${name}" criada por ${profile.name ?? profile.email}`,
    });
  }

  revalidatePath("/admin");
  return { id: newEtiqueta.id };
}

export async function updateEtiqueta(input: {
  etiquetaId: string;
  name?: string;
  color?: string | null;
}) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  if (profile.role !== "coordenação" && profile.role !== "administrativo") {
    throw new Error("Sem permissão para editar etiquetas.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: currentEtiqueta, error: fetchError } = await supabase
    .from("etiquetas")
    .select("id, name, color")
    .eq("id", input.etiquetaId)
    .single();

  if (fetchError) throw new Error(fetchError.message);
  if (!currentEtiqueta) throw new Error("Etiqueta não encontrada.");

  const oldValue = {
    name: currentEtiqueta.name,
    color: currentEtiqueta.color,
  };

  const updateData: {
    name?: string;
    color?: string | null;
  } = {};

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) {
      throw new Error("Nome da etiqueta não pode ser vazio.");
    }

    const { data: existing, error: checkError } = await supabase
      .from("etiquetas")
      .select("id")
      .eq("name", name)
      .neq("id", input.etiquetaId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      throw new Error(checkError.message);
    }

    if (existing) {
      throw new Error("Já existe uma etiqueta com este nome.");
    }

    updateData.name = name;
  }

  if (input.color !== undefined) {
    updateData.color = input.color ? input.color.trim() : null;
  }

  if (Object.keys(updateData).length === 0) {
    return;
  }

  const { error: updateError } = await supabase
    .from("etiquetas")
    .update(updateData)
    .eq("id", input.etiquetaId);

  if (updateError) throw new Error(updateError.message);

  await logAudit({
    action: "update",
    entity: "etiqueta",
    entityId: input.etiquetaId,
    oldValue,
    newValue: {
      name: updateData.name ?? currentEtiqueta.name,
      color: updateData.color ?? currentEtiqueta.color,
    },
    description: `Etiqueta "${currentEtiqueta.name}" atualizada por ${profile.name ?? profile.email}`,
  });

  revalidatePath("/admin");
}

export async function deleteEtiqueta(etiquetaId: string) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  if (profile.role !== "coordenação" && profile.role !== "administrativo") {
    throw new Error("Sem permissão para excluir etiquetas.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: etiqueta, error: fetchError } = await supabase
    .from("etiquetas")
    .select("id, name")
    .eq("id", etiquetaId)
    .single();

  if (fetchError) throw new Error(fetchError.message);
  if (!etiqueta) throw new Error("Etiqueta não encontrada.");

  const { error: deleteError } = await supabase
    .from("etiquetas")
    .delete()
    .eq("id", etiquetaId);

  if (deleteError) throw new Error(deleteError.message);

  await logAudit({
    action: "delete",
    entity: "etiqueta",
    entityId: etiquetaId,
    oldValue: { name: etiqueta.name },
    description: `Etiqueta "${etiqueta.name}" excluída por ${profile.name ?? profile.email}`,
  });

  revalidatePath("/admin");
}
