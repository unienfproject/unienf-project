-- Garante que cada aluno tenha apenas uma nota por avaliacao.
-- Se houver duplicatas antigas, mantem a mais recente antes de criar a regra.

with ranked as (
  select
    id,
    row_number() over (
      partition by avaliacao_id, aluno_id
      order by updated_at desc nulls last, released_at desc nulls last, id desc
    ) as rn
  from public.notas
)
delete from public.notas n
using ranked r
where n.id = r.id
  and r.rn > 1;

create unique index if not exists uq_notas_avaliacao_aluno
  on public.notas (avaliacao_id, aluno_id);
