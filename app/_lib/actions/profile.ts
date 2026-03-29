"use server";

import { createServerSupabaseClient } from "../supabase/server";
import type { Profile as ProfileFull, ProfileRole } from "../types/database";

export type Profile = Omit<ProfileFull, "created_at" | "updated_at">;

export type { ProfileRole };

export type StudentRow = {
  id: string;
  name: string;
  email: string;
};

function normalizeRole(role: string) {
  return role
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export async function canAccessDocuments(role: string) {
  const normalizedRole = normalizeRole(role);
  return ["aluno", "recepcao", "coordenacao", "administrativo"].includes(
    normalizedRole,
  );
}

export async function canEditDocuments(role: string) {
  const normalizedRole = normalizeRole(role);
  return ["recepcao", "coordenacao", "administrativo"].includes(
    normalizedRole,
  );
}

export async function canAccessFinance(role: string) {
  const normalizedRole = normalizeRole(role);
  return ["aluno", "recepcao", "administrativo"].includes(normalizedRole);
}

export async function canEditFinance(role: string) {
  const normalizedRole = normalizeRole(role);
  return ["recepcao", "administrativo"].includes(normalizedRole);
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
      return {
        ...profileData,
        user_id: user.id,
      } as Profile;
    }

    console.warn("Profile data é null ou undefined");
    return null;
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
    return null;
  }
}
