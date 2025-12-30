import { listPublicTables } from "@/app/_lib/actions/admin/listTables";

export default async function SchemaPage() {
  let tables: string[] = [];
  let error: string | null = null;

  try {
    tables = await listPublicTables();
  } catch (err) {
    error = err instanceof Error ? err.message : "Erro desconhecido";
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Schema do Banco de Dados
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Lista de todas as tabelas do schema public
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">Erro</p>
          <p className="mt-1 text-sm text-red-600">{error}</p>
          <p className="mt-2 text-xs text-red-500">
            Dica: Execute o arquivo{" "}
            <code className="rounded bg-red-100 px-1">
              database/functions/get_public_tables.sql
            </code>{" "}
            no Supabase SQL Editor para habilitar listagem dinâmica.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm font-medium text-slate-700">
              {tables.length} tabela{tables.length !== 1 ? "s" : ""} encontrada
              {tables.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="p-4">
            {tables.length > 0 ? (
              <ul className="space-y-2">
                {tables.map((table) => (
                  <li
                    key={table}
                    className="rounded border border-slate-100 px-3 py-2 font-mono text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {table}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">
                Nenhuma tabela encontrada.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
