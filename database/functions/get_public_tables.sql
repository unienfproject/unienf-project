-- Função SQL para listar todas as tabelas do schema public
-- Execute este script no Supabase SQL Editor
CREATE
OR REPLACE FUNCTION get_public_tables() RETURNS TABLE(table_name text) LANGUAGE sql SECURITY DEFINER AS $ $
SELECT
  tablename :: text as table_name
FROM
  pg_tables
WHERE
  schemaname = 'public'
  AND tablename NOT IN ('schema_migrations', '_realtime')
ORDER BY
  tablename;

$ $;

-- Comentário
COMMENT ON FUNCTION get_public_tables() IS 'Retorna lista de todas as tabelas do schema public';