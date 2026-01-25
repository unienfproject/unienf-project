"use server";

import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

export async function createDisciplina(data: {
  name: string;
  conteudo: string;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  // Usar Service Role para ignorar RLS (permissões de banco)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );

  const { error } = await supabaseAdmin.from("disciplinas").insert({
    name: data.name.trim(),
    conteudo: data.conteudo.trim(),
  });

  if (error) {
    console.error("Erro ao criar disciplina:", error);
    throw new Error(`Erro ao criar disciplina: ${error.message}`);
  }

  revalidatePath("/professores/disciplinas");
}
