create table if not exists public.turma_precos (
  id uuid primary key default gen_random_uuid(),
  turma_id uuid not null unique references public.turmas(id) on delete cascade,
  duracao_meses int4 not null check (duracao_meses between 1 and 60),
  valor_mensalidade numeric(12,2) not null check (valor_mensalidade > 0),
  dia_vencimento int4 not null check (dia_vencimento between 1 and 28),
  inicio_competencia date null,
  ativo boolean not null default true,
  created_by uuid null references public.profiles(user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_turma_precos_turma_id on public.turma_precos (turma_id);
create index if not exists idx_turma_precos_ativo on public.turma_precos (ativo);

alter table public.mensalidades
  add column if not exists turma_id uuid null references public.turmas(id) on delete set null;

create index if not exists idx_mensalidades_turma_id on public.mensalidades (turma_id);

do $$
declare
  constraint_name text;
begin
  select c.conname
    into constraint_name
  from pg_constraint c
  join pg_class t on t.oid = c.conrelid
  join pg_namespace n on n.oid = t.relnamespace
  where n.nspname = 'public'
    and t.relname = 'mensalidades'
    and c.contype = 'u'
    and (
      select array_agg(att.attname order by u.ord)
      from unnest(c.conkey) with ordinality as u(attnum, ord)
      join pg_attribute att on att.attrelid = c.conrelid and att.attnum = u.attnum
    ) = array['aluno_id','competence_year','competence_month'];

  if constraint_name is not null then
    execute format('alter table public.mensalidades drop constraint %I', constraint_name);
  end if;
end $$;

create unique index if not exists uq_mensalidades_aluno_turma_competencia
  on public.mensalidades (aluno_id, turma_id, competence_year, competence_month);
