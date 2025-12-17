"use server";

import { createServerSupabaseClient } from "../supabase/server";

export type Profile = {
  user_id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: string | null;
};

export async function canAccessDocuments(role: string) {
  return (
    role === "aluno" ||
    role === "recepcao" ||
    role === "coordenacao" ||
    role === "administrativo"
  );
}

export async function canEditDocuments(role: string) {
  return (
    role === "recepcao" || role === "coordenacao" || role === "administrativo"
  );
}

export async function canAccessFinance(role: string) {
  return role === "aluno" || role === "recepcao" || role === "administrativo";
}

export async function canEditFinance(role: string) {
  return role === "recepcao" || role === "administrativo";
}

export async function isAdmin(role: string) {
  return role === "administrativo";
}

export async function getUserProfile(): Promise<Profile | null> {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Erro ao buscar usuário:", userError);
      return null;
    }

    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("name, email, avatar_url, role")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Erro ao buscar perfil:", error);
      console.error("Código do erro:", error.code);
      console.error("Mensagem:", error.message);
      console.error("Detalhes:", error.details);
      return null;
    }

    if (profileData) {
      return profileData as Profile;
    }

    console.warn("Profile data é null ou undefined");
    return null;
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
    return null;
  }
}
