/**
 * Tipos alinhados ao schema Postgres/Supabase (export do painel ou introspecção).
 * Colunas `numeric` podem chegar como string dependendo do client — aqui usamos number.
 *
 * O dump SQL de referência (só contexto) pode viver em `database/schema/` se precisares.
 */

export type UUID = string;
export type Timestamp = string;
export type DateString = string;

// --- Domínios alinhados a CHECK constraints ---

export type ProfileRole =
  | "aluno"
  | "professor"
  | "coordenação"
  | "recepção"
  | "administrativo";

export type AuditActionDB = "INSERT" | "UPDATE" | "DELETE";

export type AvaliacaoTipo = "A1" | "A2" | "A3" | "REC";

export type AvisoScopeType = "turma" | "alunos";

export type DocumentoStatus = "pending" | "delivered" | "rejected";

export type MensalidadeStatus =
  | "pendente"
  | "pago"
  | "atrasado"
  | "cancelado";

export type FormaPagamentoDB = "dinheiro" | "pix" | "debito" | "credito";

export type TurmaStatus = "ativa" | "finalizada";

export type TurmaAlunoStatus =
  | "ativo"
  | "trancado"
  | "transferido"
  | "concluido";

export type TurmaAlunoResultadoStatus = "incompleto" | "aprovado" | "reprovado";

// --- Tabelas ---

export type AlunoEtiqueta = {
  id: UUID;
  aluno_id: UUID;
  etiqueta_id: UUID;
  created_at: Timestamp;
};

export type AlunoResponsavel = {
  id: UUID;
  aluno_id: UUID;
  responsavel_id: UUID;
  is_primary: boolean;
  financial_responsible: boolean;
  created_at: Timestamp;
};

export type Aluno = {
  user_id: UUID;
  full_name: string | null;
  date_of_birth: DateString | null;
  age: number | null;
  cpf: string | null;
  rg: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type AuditLog = {
  id: number;
  table_name: string;
  action: AuditActionDB;
  record_id: string | null;
  actor_id: UUID | null;
  acted_at: Timestamp;
  old_data: unknown | null;
  new_data: unknown | null;
};

export type Avaliacao = {
  id: UUID;
  turma_id: UUID;
  type: AvaliacaoTipo;
  title: string | null;
  nota_max: number;
  data_avaliacao: DateString | null;
  created_by: UUID | null;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type AvisoAluno = {
  id: UUID;
  aviso_id: UUID;
  aluno_id: UUID;
  created_at: Timestamp;
};

export type Aviso = {
  id: UUID;
  title: string;
  message: string;
  author_id: UUID;
  scope_type: AvisoScopeType;
  turma_id: UUID | null;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type Curso = {
  id: UUID;
  name: string;
  duration_months: number;
  modules_count: number | null;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type Disciplina = {
  id: UUID;
  curso_id: UUID | null;
  name: string;
  slug: string;
  workload_hours: number | null;
  created_at: Timestamp;
  updated_at: Timestamp;
  conteudo: string | null;
};

export type DocumentoTipo = {
  id: UUID;
  name: string;
  required: boolean;
  active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
};

/** Linha de `documentos_aluno` */
export type DocumentosAluno = {
  id: UUID;
  aluno_id: UUID;
  document_type_id: UUID;
  status: DocumentoStatus;
  reviewed_by: UUID | null;
  reviewed_at: Timestamp | null;
  observation: string | null;
  rejected_reason: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type Etiqueta = {
  id: UUID;
  name: string;
  color: string | null;
  created_by: UUID | null;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type Mensalidade = {
  id: UUID;
  aluno_id: UUID;
  competence_year: number;
  competence_month: number;
  due_date: DateString | null;
  status: MensalidadeStatus;
  predicted_value: number;
  created_at: Timestamp;
  updated_at: Timestamp;
  turma_id: UUID | null;
};

export type Nota = {
  id: UUID;
  avaliacao_id: UUID;
  aluno_id: UUID;
  nota: number;
  observation: string | null;
  released_by: UUID | null;
  released_at: Timestamp;
  updated_at: Timestamp;
};

export type ObservacaoPedagogica = {
  id: UUID;
  aluno_id: UUID | null;
  turma_id: UUID | null;
  author_id: UUID;
  content: string;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type Pagamento = {
  id: UUID;
  mensalidade_id: UUID;
  amount_paid: number;
  payment_method: FormaPagamentoDB;
  paid_at: Timestamp;
  received_by: UUID | null;
  observation: string | null;
  created_at: Timestamp;
};

export type Profile = {
  user_id: UUID;
  name: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  role: ProfileRole;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ReceiptCounter = {
  year: number;
  last_number: number;
};

export type Recibo = {
  id: UUID;
  pagamento_id: UUID;
  receipt_number: string;
  issued_by: UUID | null;
  issued_at: Timestamp;
  notes: string | null;
};

export type Responsavel = {
  id: UUID;
  name: string;
  cpf: string | null;
  telefone: string | null;
  email: string | null;
  kinship: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type TurmaAlunoResultado = {
  id: UUID;
  turma_id: UUID;
  aluno_id: UUID;
  a1: number | null;
  a2: number | null;
  a3: number | null;
  x: number | null;
  rec: number | null;
  final: number | null;
  status: TurmaAlunoResultadoStatus;
  updated_at: Timestamp;
};

export type TurmaAluno = {
  id: UUID;
  turma_id: UUID;
  aluno_id: UUID;
  status: TurmaAlunoStatus;
  joined_at: Timestamp;
};

export type TurmaPreco = {
  id: UUID;
  turma_id: UUID;
  duracao_meses: number;
  valor_mensalidade: number;
  dia_vencimento: number;
  inicio_competencia: DateString | null;
  ativo: boolean;
  created_by: UUID | null;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type Turma = {
  id: UUID;
  disciplina_id: UUID;
  professor_id: UUID;
  tag: string;
  period: string;
  media_minima: number;
  start_date: DateString | null;
  end_date: DateString | null;
  status: TurmaStatus;
  created_by: UUID | null;
  created_at: Timestamp;
  updated_at: Timestamp;
};
