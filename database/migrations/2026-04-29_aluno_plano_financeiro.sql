alter table public.alunos
  add column if not exists valor_total_curso numeric(12,2) null check (valor_total_curso is null or valor_total_curso > 0),
  add column if not exists quantidade_parcelas int4 null check (quantidade_parcelas is null or quantidade_parcelas between 1 and 120);

create index if not exists idx_mensalidades_aluno_competencia
  on public.mensalidades (aluno_id, competence_year, competence_month);
