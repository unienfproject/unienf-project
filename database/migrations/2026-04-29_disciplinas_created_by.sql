alter table public.disciplinas
  add column if not exists created_by uuid null references public.profiles(user_id) on delete set null;

create index if not exists idx_disciplinas_created_by
  on public.disciplinas (created_by);
