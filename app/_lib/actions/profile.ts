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


// export async function listProfilePaginated({ role: "aluno" | "professor", page, pageSize })
// {
//   const profile = await getUserProfile();
//   if (!profile) throw new Error ("Sessão inválida.");

//   const supabase = await createServerSupabaseClient();

//   const grom = (params.page - 1) * params.pageSize;
//   const to = from + params.pageSize - 1;

//   const { data, error, count } = await supabase
//   .from("profiles")
//   .select (
//     `
//     user_id,
//     name,
//     email,
//     telefone
//     `, { count: "exact" },
//   )
// .eq("role", "aluno")
// .order("created_at", { ascending: false })
// .range(from, to);

// if (error) throw new Error(error.message);

// return {
//   alunos: data ?? [],
//   total: count ?? 0,
// }
// ;
// }