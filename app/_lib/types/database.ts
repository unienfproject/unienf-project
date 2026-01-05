/**
 * Tipos TypeScript baseados no schema do banco de dados Supabase
 *
 * Este arquivo contém os tipos que refletem exatamente a estrutura
 * das tabelas no banco de dados.
 */

// ============================================================================
// PROFILES
// ============================================================================

export type ProfileRole =
  | "aluno"
  | "professor"
  | "coordenação"
  | "recepção"
  | "administrativo";

export type Profile = {
  user_id: string; // uuid
  name: string | null; // text
  telefone: string | null; // text
  email: string | null; // text
  avatar_url: string | null; // text
  role: ProfileRole | null; // text (aluno|professor|coordenação|recepção|administrativo)
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
};

// ============================================================================
// ALUNOS
// ============================================================================

export type Aluno = {
  user_id: string; // uuid (FK → profiles.user_id)
  age: number | null; // int4
  date_of_birth: string | null; // date (YYYY-MM-DD)
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
};

// ============================================================================
// RESPONSÁVEIS
// ============================================================================

export type Responsavel = {
  id: string; // uuid
  name: string; // text
  telefone: string | null; // text
  email: string | null; // text
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
};

export type AlunoResponsavel = {
  aluno_id: string; // uuid (FK → profiles.user_id)
  responsavel_id: string; // uuid (FK → responsaveis.id)
  relationship: string | null; // text
  is_primary: boolean; // bool
  created_at: string; // timestamptz
};

// ============================================================================
// CURSOS E DISCIPLINAS
// ============================================================================

export type Curso = {
  id: string; // uuid
  name: string; // text
  description: string | null; // text
  duration_months: number | null; // int4
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
};

export type Disciplina = {
  id: string; // uuid
  curso_id: string; // uuid (FK → cursos.id)
  name: string; // text
  module: number | null; // int4
  workload_hours: number | null; // int4
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
};

// ============================================================================
// TURMAS
// ============================================================================

export type TurmaStatus = "ativa" | "finalizada";

export type Turma = {
  id: string; // uuid
  name: string; // text
  tag: string; // text
  start_date: string; // date (YYYY-MM-DD)
  end_date: string; // date (YYYY-MM-DD)
  status: TurmaStatus; // text (ativa|finalizada)
  professor_id: string; // uuid (FK → profiles.user_id)
  disciplina_id: string; // uuid (FK → disciplinas.id)
  created_by: string; // uuid (FK → profiles.user_id)
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
};

export type TurmaAluno = {
  turma_id: string; // uuid (FK → turmas.id)
  aluno_id: string; // uuid (FK → profiles.user_id)
  created_at: string; // timestamptz
};

// ============================================================================
// AVALIAÇÕES E NOTAS
// ============================================================================

export type AvaliacaoType = "A1" | "A2" | "A3" | "REC";

export type Avaliacao = {
  id: string; // uuid
  turma_id: string; // uuid (FK → turmas.id)
  type: AvaliacaoType; // text (A1|A2|A3|REC)
  title: string; // text
  date: string | null; // date (YYYY-MM-DD)
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
};

export type Nota = {
  id: string; // uuid
  avaliacao_id: string; // uuid (FK → avaliacoes.id)
  aluno_id: string; // uuid (FK → profiles.user_id)
  value: number | null; // numeric
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
};

export type TurmaAlunoResultado = {
  turma_id: string; // uuid (FK → turmas.id)
  aluno_id: string; // uuid (FK → profiles.user_id)
  media: number | null; // numeric
  rec: number | null; // numeric
  final: number | null; // numeric
  status: "aprovado" | "reprovado"; // text
  updated_at: string; // timestamptz
};

// ============================================================================
// FINANCEIRO
// ============================================================================

export type MensalidadeStatus = "pendente" | "pago";

export type Mensalidade = {
  id: string; // uuid
  aluno_id: string; // uuid (FK → profiles.user_id)
  competence_year: number; // int4
  competence_month: number; // int4 (1-12)
  status: MensalidadeStatus; // text (pendente|pago)
  valor_mensalidade: number; // numeric
  valor_pago: number | null; // numeric
  data_vencimento: string | null; // date (YYYY-MM-DD)
  data_pagamento: string | null; // date (YYYY-MM-DD)
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
};

export type FormaPagamento = "dinheiro" | "pix" | "debito" | "credito";

export type Pagamento = {
  id: string; // uuid
  mensalidade_id: string; // uuid (FK → mensalidades.id)
  valor_pago: number; // numeric
  forma_pagamento: FormaPagamento | null; // text (dinheiro|pix|debito|credito)
  data_pagamento: string; // date (YYYY-MM-DD)
  observacao: string | null; // text
  created_by: string; // uuid (FK → profiles.user_id)
  created_at: string; // timestamptz
};

export type ReceiptCounter = {
  year: number; // int4
  last_number: number; // int4
  updated_at: string; // timestamptz
};

export type Recibo = {
  id: string; // uuid
  pagamento_id: string; // uuid (FK → pagamentos.id)
  receipt_number: string; // text (formato: UNF-2026-000123)
  issued_by: string; // uuid (FK → profiles.user_id)
  issued_at: string; // timestamptz
  notes: string | null; // text
};

// ============================================================================
// DOCUMENTOS
// ============================================================================

export type DocumentoTipo = {
  id: string; // uuid
  name: string; // text
  required: boolean; // bool
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
};

export type DocumentoStatus = "pending" | "delivered" | "rejected";

export type DocumentoAluno = {
  id: string; // uuid
  aluno_id: string; // uuid (FK → profiles.user_id)
  documento_tipo_id: string; // uuid (FK → documento_tipos.id)
  status: DocumentoStatus; // text (pending|delivered|rejected)
  observacao: string | null; // text
  rejected_reason: string | null; // text
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
};

// ============================================================================
// AVISOS
// ============================================================================

export type AvisoScopeType = "turma" | "alunos";

export type Aviso = {
  id: string; // uuid
  title: string; // text
  message: string; // text
  author_id: string; // uuid (FK → profiles.user_id)
  created_at: string; // timestamptz
  scope_type: AvisoScopeType; // text (turma|alunos)
  turma_id: string | null; // uuid (FK → turmas.id, nullable)
};

export type AvisoAluno = {
  aviso_id: string; // uuid (FK → avisos.id)
  aluno_id: string; // uuid (FK → profiles.user_id)
};

// ============================================================================
// ETIQUETAS
// ============================================================================

export type Etiqueta = {
  id: string; // uuid
  name: string; // text
  color: string | null; // text
  created_by: string; // uuid (FK → profiles.user_id)
  created_at: string; // timestamptz
};

export type AlunoEtiqueta = {
  aluno_id: string; // uuid (FK → profiles.user_id)
  etiqueta_id: string; // uuid (FK → etiquetas.id)
  created_at: string; // timestamptz
};

// ============================================================================
// OBSERVAÇÕES PEDAGÓGICAS
// ============================================================================

export type ObservacaoPedagogica = {
  id: string; // uuid
  aluno_id: string | null; // uuid (FK → profiles.user_id, nullable)
  turma_id: string | null; // uuid (FK → turmas.id, nullable)
  content: string; // text
  author_id: string; // uuid (FK → profiles.user_id)
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
};

// ============================================================================
// AUDITORIA
// ============================================================================

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "login"
  | "logout"
  | "payment"
  | "document_change";

export type AuditEntity =
  | "profile"
  | "aluno"
  | "professor"
  | "turma"
  | "nota"
  | "mensalidade"
  | "pagamento"
  | "documento"
  | "aviso"
  | "observacao_pedagogica"
  | "etiqueta";

export type AuditLog = {
  id: string; // uuid
  user_id: string | null; // uuid (FK → profiles.user_id, nullable)
  action: AuditAction; // text
  entity: AuditEntity; // text
  entity_id: string; // uuid
  old_value: unknown | null; // jsonb
  new_value: unknown | null; // jsonb
  description: string; // text
  ip_address: string | null; // text
  user_agent: string | null; // text
  created_at: string; // timestamptz
};

// ============================================================================
// VIEWS
// ============================================================================

export type VwAlunosLive = {
  user_id: string; // uuid
  age: number | null; // int4
  date_of_birth: string | null; // date
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
  age_live: number | null; // int4 (calculado)
  is_minor: boolean | null; // bool (calculado)
};
