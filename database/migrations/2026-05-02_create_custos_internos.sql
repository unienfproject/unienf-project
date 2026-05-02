create table if not exists public.custos_internos (
  id uuid primary key default gen_random_uuid(),
  competence_year int4 not null check (competence_year between 2000 and 2100),
  competence_month int4 not null check (competence_month between 1 and 12),
  category text not null check (char_length(trim(category)) between 1 and 120),
  description text not null check (char_length(trim(description)) between 1 and 240),
  amount numeric(12,2) not null check (amount > 0),
  incurred_at date not null,
  created_by uuid null references public.profiles(user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_custos_internos_competencia
  on public.custos_internos (competence_year, competence_month, incurred_at desc);

create index if not exists idx_custos_internos_category
  on public.custos_internos (category);

alter table public.custos_internos enable row level security;

drop policy if exists "Administrativo pode ver custos internos" on public.custos_internos;
create policy "Administrativo pode ver custos internos"
  on public.custos_internos
  for select
  using (
    exists (
      select 1
      from public.profiles
      where profiles.user_id = auth.uid()
        and profiles.role = 'administrativo'
    )
  );

drop policy if exists "Administrativo pode lancar custos internos" on public.custos_internos;
create policy "Administrativo pode lancar custos internos"
  on public.custos_internos
  for insert
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.user_id = auth.uid()
        and profiles.role = 'administrativo'
    )
  );

comment on table public.custos_internos is
  'Custos internos lancados pelo financeiro administrativo.';
