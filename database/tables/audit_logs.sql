-- Tabela de auditoria para rastrear alterações no sistema
-- Esta tabela deve ser criada no Supabase para habilitar o sistema de auditoria
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE
  SET
    NULL,
    action text NOT NULL CHECK (
      action IN (
        'create',
        'update',
        'delete',
        'role_change',
        'payment',
        'grade_change',
        'document_change'
      )
    ),
    entity text NOT NULL CHECK (
      entity IN (
        'user',
        'profile',
        'mensalidade',
        'pagamento',
        'nota',
        'documento',
        'turma',
        'aluno'
      )
    ),
    entity_id uuid NOT NULL,
    old_value jsonb,
    new_value jsonb,
    description text NOT NULL,
    ip_address text,
    user_agent text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_id ON public.audit_logs(entity_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- RLS (Row Level Security) - apenas administrativo pode ver logs
ALTER TABLE
  public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Política: apenas usuários com role administrativo podem ver logs
CREATE POLICY "Apenas administrativo pode ver audit logs" ON public.audit_logs FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        public.profiles
      WHERE
        profiles.user_id = auth.uid()
        AND profiles.role = 'administrativo'
    )
  );

-- Política: sistema pode inserir logs (via service role)
-- Nota: Inserções via Server Actions usam service role, então não precisamos de política de INSERT
COMMENT ON TABLE public.audit_logs IS 'Registra todas as ações importantes do sistema para auditoria';

COMMENT ON COLUMN public.audit_logs.action IS 'Tipo de ação realizada';

COMMENT ON COLUMN public.audit_logs.entity IS 'Tipo de entidade afetada';

COMMENT ON COLUMN public.audit_logs.entity_id IS 'ID da entidade afetada';

COMMENT ON COLUMN public.audit_logs.old_value IS 'Valores antigos (JSON)';

COMMENT ON COLUMN public.audit_logs.new_value IS 'Valores novos (JSON)';

COMMENT ON COLUMN public.audit_logs.description IS 'Descrição legível da ação';