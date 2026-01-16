"use server";

import { getUserProfile } from "@/app/_lib/actions/profile";
import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { revalidatePath } from "next/cache";

export type MyAccountProfile = {
  userId: string;
  role: string;
  name: string | null;
  email: string | null;
  telefone: string | null;
  avatarUrl: string | null;
  createdAt: string | null;
};

export async function getMyAccountProfile(): Promise<MyAccountProfile> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, role, name, email, phone, avatar_url, created_at")
    .eq("user_id", profile.user_id)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Perfil não encontrado.");

  return {
    userId: String(data.user_id),
    role: String(data.role ?? ""),
    name: data.name ?? null,
    email: data.email ?? null,
    telefone: data.phone ?? null,
    avatarUrl: data.avatar_url ?? null,
    createdAt: data.created_at ?? null,
  };
}

export async function updateMyAccountProfile(input: {
  name?: string | null;
  telefone?: string | null;
  avatarUrl?: string | null;
}): Promise<void> {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Sessão inválida.");

  const supabase = await createServerSupabaseClient();

  const updateData: {
    name?: string | null;
    phone?: string | null;
    avatar_url?: string | null;
    updated_at: string;
  } = { updated_at: new Date().toISOString() };

  if (input.name !== undefined) updateData.name = input.name ? input.name.trim() : null;
  if (input.telefone !== undefined) updateData.phone = input.telefone ? input.telefone.trim() : null;
  if (input.avatarUrl !== undefined) updateData.avatar_url = input.avatarUrl;

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("user_id", profile.user_id);

  if (error) throw new Error(error.message);

  revalidatePath("/perfil");
}
