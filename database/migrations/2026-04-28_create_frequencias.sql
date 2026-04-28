-- Controle de frequência por turma/aluno.
-- Permite lançamento diário de presença e lançamento consolidado de faltas do período.

create table if not exists public.frequencias (
  id uuid primary key default gen_random_uuid(),
  turma_id uuid not null references public.turmas(id) on delete cascade,
  aluno_id uuid not null references public.profiles(user_id) on delete cascade,
  tipo text not null check (tipo in ('diaria', 'periodo')),
  data date null,
  total_aulas integer not null default 1 check (total_aulas > 0),
  faltas integer not null default 0 check (faltas >= 0),
  presente boolean null,
  released_by uuid null references public.profiles(user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint frequencias_diaria_data_check check (
    (tipo = 'diaria' and data is not null)
    or (tipo = 'periodo' and data is null)
  ),
  constraint frequencias_faltas_total_check check (faltas <= total_aulas)
);

create unique index if not exists uq_frequencias_diaria
  on public.frequencias (turma_id, aluno_id, data)
  where tipo = 'diaria';

create unique index if not exists uq_frequencias_periodo
  on public.frequencias (turma_id, aluno_id)
  where tipo = 'periodo';

create index if not exists idx_frequencias_aluno
  on public.frequencias (aluno_id);

create index if not exists idx_frequencias_turma
  on public.frequencias (turma_id);
