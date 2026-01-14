/**
 * Tipos TypeScript baseados no schema do banco de dados Supabase
 *
 * Este arquivo contém os tipos que refletem exatamente a estrutura
 * das tabelas no banco de dados.
 *
 * Obs: colunas numeric no Postgres podem vir como string dependendo do client/config.
 * Aqui mantive como number porque é o que vocês vinham usando no projeto.
 */

export type UUID = string;
export type Timestamp = string; // timestamptz
export type DateString = string; // date (YYYY-MM-DD)

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
  user_id: UUID; // uuid (PK, FK -> auth.users.id)
  name: string | null; // text
  telefone: string | null; // text
  email: string | null; // text
  avatar_url: string | null; // text
  role: ProfileRole; // text NOT NULL (default 'aluno')
  created_at: Timestamp; // timestamptz
  updated_at: Timestamp; // timestamptz
};

// ============================================================================
// ALUNOS
// ============================================================================

export type Aluno = {
  user_id: UUID; // uuid (PK, FK -> profiles.user_id)
  full_name: string | null; // text
  date_of_birth: DateString | null; // date
  age: number | null; // int4
  cpf: string | null; // text
  rg: string | null; // text
  created_at: Timestamp; // timestamptz
  updated_at: Timestamp; // timestamptz
};

// ============================================================================
// RESPONSÁVEIS
// ============================================================================

export type Responsavel = {
  id: UUID; // uuid
  name: string; // text NOT NULL
  cpf: string | null; // text
  telefone: string | null; // text
  email: string | null; // text
  parentesco: string | null; // text
  created_at: Timestamp; // timestamptz
  updated_at: Timestamp; // timestamptz
};

export type AlunoResponsavel = {
  id: UUID; // uuid
  aluno_id: UUID; // uuid (FK -> alunos.user_id)
  responsavel_id: UUID; // uuid (FK -> responsaveis.id)
  is_primary: boolean; // bool NOT NULL default false
  financial_responsible: boolean; // bool NOT NULL default true
  created_at: Timestamp; // timestamptz
};

// ============================================================================
// CURSOS E DISCIPLINAS
// ============================================================================

export type Curso = {
  id: UUID; // uuid
  name: string; // text NOT NULL
  duration_months: number; // int4 NOT NULL
  modules_count: number | null; // int4 nullable
  created_at: Timestamp; // timestamptz
  updated_at: Timestamp; // timestamptz
};

export type Disciplina = {
  id: UUID; // uuid
  curso_id: UUID | null; // uuid nullable (FK -> cursos.id)
  name: string; // text NOT NULL
  slug: string; // text NOT NULL UNIQUE
  workload_hours: number | null; // int4 nullable
  created_at: Timestamp; // timestamptz
  updated_at: Timestamp; // timestamptz
};

// ============================================================================
// TURMAS
// ============================================================================

export type TurmaStatus = "ativa" | "finalizada";

export type Turma = {
  id: UUID; // uuid
  disciplina_id: UUID; // uuid (FK -> disciplinas.id)
  professor_id: UUID; // uuid (FK -> profiles.user_id)
  tag: string; // text NOT NULL UNIQUE (ex: Primeiros_Socorros_2026.2)
  period: string; // text NOT NULL
  media_minima: number; // numeric NOT NULL default 7.0
  start_date: DateString | null; // date nullable
  end_date: DateString | null; // date nullable
  status: TurmaStatus; // text NOT NULL default 'ativa'
  created_by: UUID | null; // uuid nullable (FK -> profiles.user_id)
  created_at: Timestamp; // timestamptz
  updated_at: Timestamp; // timestamptz
};

export type TurmaAlunoStatus =
  | "ativo"
  | "trancado"
  | "transferido"
  | "concluido";

export type TurmaAluno = {
  id: UUID; // uuid
  turma_id: UUID; // uuid (FK -> turmas.id)
  aluno_id: UUID; // uuid (FK -> profiles.user_id)
  status: TurmaAlunoStatus; // text NOT NULL default 'ativo'
  joined_at: Timestamp; // timestamptz
};

// ============================================================================
// AVALIAÇÕES E NOTAS
// ============================================================================

export type AvaliacaoTipo = "A1" | "A2" | "A3" | "REC";

export type Avaliacao = {
  id: UUID; // uuid
  turma_id: UUID; // uuid (FK -> turmas.id)
  tipo: AvaliacaoTipo; // text NOT NULL
  title: string | null; // text
  nota_max: number; // numeric NOT NULL default 10
  data_avaliacao: DateString | null; // date nullable
  created_by: UUID | null; // uuid nullable (FK -> profiles.user_id)
  created_at: Timestamp; // timestamptz
  updated_at: Timestamp; // timestamptz
};

export type Nota = {
  id: UUID; // uuid
  avaliacao_id: UUID; // uuid (FK -> avaliacoes.id)
  aluno_id: UUID; // uuid (FK -> profiles.user_id)
  nota: number; // numeric NOT NULL
  observacao: string | null; // text
  lancado_por: UUID | null; // uuid nullable (FK -> profiles.user_id)
  lancado_em: Timestamp; // timestamptz NOT NULL default now()
  updated_at: Timestamp; // timestamptz
};

export type ResultadoStatus = "incompleto" | "aprovado" | "reprovado";

export type TurmaAlunoResultado = {
  id: UUID; // uuid
  turma_id: UUID; // uuid (FK -> turmas.id)
  aluno_id: UUID; // uuid (FK -> profiles.user_id)
  a1: number | null; // numeric
  a2: number | null; // numeric
  a3: number | null; // numeric
  x: number | null; // numeric
  rec: number | null; // numeric
  final: number | null; // numeric
  status: ResultadoStatus; // text NOT NULL default 'incompleto'
  updated_at: Timestamp; // timestamptz
};

// ============================================================================
// FINANCEIRO
// ============================================================================

export type MensalidadeStatus = "pendente" | "pago" | "atrasado" | "cancelado";

export type Mensalidade = {
  id: UUID; // uuid
  aluno_id: UUID; // uuid (FK -> profiles.user_id)
  competence_year: number; // int4
  competence_month: number; // int4 (1-12)
  due_date: DateString | null; // date nullable
  status: MensalidadeStatus; // text NOT NULL default 'pendente'
  valor_previsto: number; // numeric NOT NULL
  created_at: Timestamp; // timestamptz
  updated_at: Timestamp; // timestamptz
};

export type FormaPagamento = "dinheiro" | "pix" | "debito" | "credito";

export type Pagamento = {
  id: UUID; // uuid
  mensalidade_id: UUID; // uuid (FK -> mensalidades.id)
  valor_pago: number; // numeric NOT NULL
  forma_pagamento: FormaPagamento; // text NOT NULL
  pago_em: Timestamp; // timestamptz NOT NULL default now()
  recebido_por: UUID | null; // uuid nullable (FK -> profiles.user_id)
  observacao: string | null; // text
  created_at: Timestamp; // timestamptz
};

export type ReceiptCounter = {
  year: number; // int4 (PK)
  last_number: number; // int4 NOT NULL default 0
};

export type Recibo = {
  id: UUID; // uuid
  pagamento_id: UUID; // uuid NOT NULL UNIQUE (FK -> pagamentos.id)
  receipt_number: string; // text NOT NULL UNIQUE (ex: UNF-2026-000123)
  issued_by: UUID | null; // uuid nullable (FK -> profiles.user_id)
  issued_at: Timestamp; // timestamptz NOT NULL default now()
  notes: string | null; // text
};

// ============================================================================
// DOCUMENTOS
// ============================================================================

export type DocumentoTipo = {
  id: UUID; // uuid
  name: string; // text NOT NULL
  required: boolean; // bool NOT NULL default true
  active: boolean; // bool NOT NULL default true
  created_at: Timestamp; // timestamptz
  updated_at: Timestamp; // timestamptz
};

export type DocumentoStatus = "pending" | "delivered" | "rejected";

export type DocumentoAluno = {
  id: UUID; // uuid
  aluno_id: UUID; // uuid (FK -> profiles.user_id)
  documento_tipo_id: UUID; // uuid (FK -> documento_tipos.id)
  status: DocumentoStatus; // text NOT NULL default 'pending'
  reviewed_by: UUID | null; // uuid nullable (FK -> profiles.user_id)
  reviewed_at: Timestamp | null; // timestamptz nullable
  observation: string | null; // text nullable
  rejected_reason: string | null; // text nullable
  created_at: Timestamp; // timestamptz
  updated_at: Timestamp; // timestamptz
};

// ============================================================================
// AVISOS
// ============================================================================

export type AvisoScopeType = "turma" | "alunos";

export type Aviso = {
  id: UUID; // uuid
  title: string; // text NOT NULL
  message: string; // text NOT NULL
  author_id: UUID; // uuid NOT NULL (FK -> profiles.user_id)
  scope_type: AvisoScopeType; // text NOT NULL
  turma_id: UUID | null; // uuid nullable (FK -> turmas.id)
  created_at: Timestamp; // timestamptz
  updated_at: Timestamp; // timestamptz
};

export type AvisoAluno = {
  id: UUID; // uuid
  aviso_id: UUID; // uuid (FK -> avisos.id)
  aluno_id: UUID; // uuid (FK -> profiles.user_id)
  created_at: Timestamp; // timestamptz
};

// ============================================================================
// ETIQUETAS
// ============================================================================

export type Etiqueta = {
  id: UUID; // uuid
  name: string; // text NOT NULL UNIQUE
  color: string | null; // text
  created_by: UUID | null; // uuid nullable (FK -> profiles.user_id)
  created_at: Timestamp; // timestamptz
  updated_at: Timestamp; // timestamptz
};

export type AlunoEtiqueta = {
  id: UUID; // uuid
  aluno_id: UUID; // uuid (FK -> profiles.user_id)
  etiqueta_id: UUID; // uuid (FK -> etiquetas.id)
  created_at: Timestamp; // timestamptz
};

// ============================================================================
// OBSERVAÇÕES PEDAGÓGICAS
// ============================================================================

export type ObservacaoPedagogica = {
  id: UUID; // uuid
  aluno_id: UUID | null; // uuid nullable (FK -> profiles.user_id)
  turma_id: UUID | null; // uuid nullable (FK -> turmas.id)
  author_id: UUID; // uuid NOT NULL (FK -> profiles.user_id)
  content: string; // text NOT NULL
  created_at: Timestamp; // timestamptz
  updated_at: Timestamp; // timestamptz
};

// ============================================================================
// AUDITORIA (nova estrutura real do banco)
// ============================================================================

export type AuditActionDB = "INSERT" | "UPDATE" | "DELETE";

export type AuditLog = {
  id: number; // bigint identity
  table_name: string; // text NOT NULL
  action: AuditActionDB; // text NOT NULL
  record_id: string | null; // text
  actor_id: UUID | null; // uuid
  acted_at: Timestamp; // timestamptz NOT NULL default now()
  old_data: unknown | null; // jsonb
  new_data: unknown | null; // jsonb
};

// ============================================================================
// VIEWS
// ============================================================================

export type VwAlunosLive = {
  user_id: UUID; // uuid
  full_name: string | null; // text
  date_of_birth: DateString | null; // date
  age: number | null; // int4
  cpf: string | null; // text
  rg: string | null; // text
  created_at: Timestamp; // timestamptz
  updated_at: Timestamp; // timestamptz
  age_live: number | null; // int4 (calculado)
  is_minor: boolean | null; // bool (calculado)
};
