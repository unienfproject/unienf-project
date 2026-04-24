-- Compatibilidade entre schemas antigos e novos da tabela `avaliacoes`.
--
-- Problema observado:
-- - triggers/funções antigas ainda inserem em `avaliacoes.tipo`
-- - a aplicação atual lê/grava `avaliacoes.type`
--
-- Esta migração adiciona a coluna legada `tipo` quando ela não existe
-- e mantém `tipo` e `type` sincronizadas em INSERT/UPDATE.

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'avaliacoes'
  ) then
    if not exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'avaliacoes'
        and column_name = 'tipo'
    ) then
      alter table public.avaliacoes
        add column tipo text;
    end if;

    if exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'avaliacoes'
        and column_name = 'type'
    ) then
      update public.avaliacoes
      set tipo = coalesce(tipo, type)
      where tipo is distinct from coalesce(tipo, type);
    end if;

    if not exists (
      select 1
      from pg_constraint c
      join pg_class t on t.oid = c.conrelid
      join pg_namespace n on n.oid = t.relnamespace
      where n.nspname = 'public'
        and t.relname = 'avaliacoes'
        and c.conname = 'uq_avaliacoes_turma_tipo'
    ) then
      alter table public.avaliacoes
        add constraint uq_avaliacoes_turma_tipo unique (turma_id, tipo);
    end if;
  end if;
end
$$;

create or replace function public.sync_avaliacoes_tipo_compat()
returns trigger
language plpgsql
as $$
begin
  if new.type is null and new.tipo is not null then
    new.type := new.tipo;
  end if;

  if new.tipo is null and new.type is not null then
    new.tipo := new.type;
  end if;

  if new.type is distinct from new.tipo then
    if new.type is not null then
      new.tipo := new.type;
    else
      new.type := new.tipo;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_sync_avaliacoes_tipo_compat on public.avaliacoes;

create trigger trg_sync_avaliacoes_tipo_compat
before insert or update on public.avaliacoes
for each row
execute function public.sync_avaliacoes_tipo_compat();
