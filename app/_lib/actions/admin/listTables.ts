"use server";

import { createServerSupabaseClient } from "@/app/_lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createAdminClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

export async function listPublicTables() {
  const supabase = await createServerSupabaseClient();
  const { data: authData, error: authErr } = await supabase.auth.getUser();

  if (authErr || !authData?.user) {
    throw new Error("Não autenticado.");
  }

  const userId = authData.user.id;

  const { data: profile, error: profErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (profErr) throw new Error("Falha ao ler profile.");
  if (profile?.role !== "administrativo") {
    throw new Error("Sem permissão. Apenas administrativo pode ver o schema.");
  }

  const admin = getAdminSupabase();

  try {
    const { data, error } = await admin.rpc("get_public_tables");

    if (error) {
      console.warn(
        "Função RPC get_public_tables não encontrada. Execute o arquivo database/get_public_tables.sql no Supabase.",
      );
      throw error;
    }

    if (data && Array.isArray(data)) {
      const tableNames = data
        .map((t: string | { table_name: string }) =>
          typeof t === "string" ? t : t.table_name,
        )
        .filter((n): n is string => typeof n === "string" && n.length > 0);
      return tableNames.sort();
    }
  } catch {
    console.warn(
      "Usando lista manual de tabelas. Para listagem dinâmica, execute database/functions/get_public_tables.sql no Supabase.",
    );
  }

  const knownTables = [
    "profiles",
    "cursos",
    "disciplinas",
    "turmas",
    "turma_alunos",
    "avaliacoes",
    "notas",
    "turma_aluno_resultados",
    "mensalidades",
    "turma_precos",
    "pagamentos",
    "recibos",
    "receipt_counters",
    "documento_tipos",
    "documentos_aluno",
    "avisos",
    "aviso_alunos",
    "etiquetas",
    "aluno_etiquetas",
    "observacoes_pedagogicas",
    "alunos",
    "responsaveis",
    "aluno_responsaveis",
    "audit_logs",
  ];

  return knownTables.sort();
}
