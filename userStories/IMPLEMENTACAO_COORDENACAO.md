# Implementação das User Stories de Coordenação

Este documento descreve o status atual das implementações para atender às User Stories de coordenação e o que ainda precisa ser implementado.

## 📊 Status Geral

| User Story                                                     | Status              | Conectado ao Banco? |
| -------------------------------------------------------------- | ------------------- | ------------------- |
| US-COORD-01 — Gerenciar dados pessoais de alunos e professores | ⚠️ Parcial          | ⚠️ Parcial          |
| US-COORD-02 — Gerenciar documentação do aluno                  | ⚠️ Parcial          | ❌ Não              |
| US-COORD-03 — Gerenciar notas                                  | ⚠️ Parcial          | ✅ Sim              |
| US-COORD-04 — Gerenciar observações pedagógicas                | ⚠️ Parcial          | ⚠️ Parcial          |
| US-COORD-05 — Gerenciar etiquetas                              | ⚠️ Parcial          | ✅ Sim              |
| US-COORD-06 — Restrição: não visualizar financeiro             | ❌ Não implementado | N/A                 |

---

## 📋 Análise Detalhada por User Story

### US-COORD-01 — Gerenciar dados pessoais de alunos e professores

**Status:** ⚠️ Parcial - Visualização existe, edição limitada

**O que já existe:**

- ✅ Coordenação tem acesso a `/admin/alunos` e `/admin/professores` (compartilha menu com admin)
- ✅ Função `listAlunos()` em `app/_lib/actions/alunos.ts` (mas verifica apenas `administrativo`)
- ✅ Função `listProfessores()` em `app/_lib/actions/professores.ts` (mas verifica apenas `administrativo`)
- ✅ Função `updateStudentProfile()` em `app/_lib/actions/recepcao.ts` (mas verifica apenas `recepção`)
- ✅ Sistema de auditoria já implementado para alterações de dados

**O que falta:**

- ❌ Funções `listAlunos()` e `listProfessores()` não permitem coordenação (apenas `administrativo`)
- ❌ Função `updateStudentProfile()` não permite coordenação (apenas `recepção`)
- ❌ Não há função para editar dados pessoais de professores
- ❌ Não há interface para coordenação editar dados de alunos/professores nas páginas `/admin/alunos` e `/admin/professores`
- ❌ Não há validação para garantir que coordenação possa editar dados

**Estrutura do banco necessária:**

- ✅ `profiles` - Dados básicos (name, email, telefone)
- ✅ `alunos` - Dados específicos do aluno (age, date_of_birth)
- ✅ Auditoria já implementada via `audit_logs`

**Dados que coordenação PODE editar:**

- ✅ Nome, email, telefone (profiles)
- ✅ Idade, data de nascimento (alunos) - apenas para alunos

**Próximos passos:**

1. Atualizar `listAlunos()` em `app/_lib/actions/alunos.ts` para permitir `coordenação`:

   ```typescript
   if (profile.role !== "administrativo" && profile.role !== "coordenação") {
     throw new Error("Sem permissão para listar alunos.");
   }
   ```

2. Atualizar `listProfessores()` em `app/_lib/actions/professores.ts` para permitir `coordenação`

3. Criar/atualizar função `updateStudentProfile()` para permitir coordenação:
   - Atualizar `app/_lib/actions/recepcao.ts` ou criar em `app/_lib/actions/alunos.ts`
   - Adicionar permissão para `coordenação`
   - Manter auditoria

4. Criar função `updateProfessorProfile()` em `app/_lib/actions/professores.ts`:
   - Permitir `coordenação` e `administrativo`
   - Editar: name, email, telefone
   - Registrar auditoria

5. Atualizar componentes de edição nas páginas `/admin/alunos` e `/admin/professores`:
   - Adicionar formulários de edição inline ou modais
   - Conectar às funções atualizadas

---

### US-COORD-02 — Gerenciar documentação do aluno

**Status:** ⚠️ Parcial - Validação de permissão existe, mas funções não implementadas

**O que já existe:**

- ✅ Função `canEditDocuments()` em `app/_lib/actions/profile.ts` permite `coordenação` e `administrativo`
- ✅ Componente `DocumentsView` em `app/_components/documents/DocumentsView.tsx`
- ✅ Componente `DocumentCard` com suporte a edição
- ✅ Tipo `DocumentStatus` inclui "pending", "delivered", "rejected"
- ✅ Estrutura do banco já existe: `documentos_aluno` e `documento_tipos`

**O que falta:**

- ❌ Não há página `/admin/documentos` ou rota para coordenação gerenciar documentos
- ❌ Função `updateDocumentStatus()` ou similar não existe (componente usa mockdata)
- ❌ Não há função para listar documentos de um aluno específico para coordenação
- ❌ Não há função para atualizar status e observações de documentos
- ❌ Componente `DocumentsView` usa `updateStudentDocument` de mockdata (`app/_lib/mockdata/docs.mock.ts`)

**Estrutura do banco necessária:**

- ✅ `documentos_aluno` - Documentos dos alunos
  - `id`, `aluno_id`, `documento_tipo_id`, `status`, `observacao`, `rejected_reason`
- ✅ `documento_tipos` - Tipos de documentos

**Próximos passos:**

1. Criar funções em `app/_lib/actions/documents.ts`:
   - `listStudentDocuments(studentId: string)` - Listar documentos de um aluno
   - `updateDocumentStatus(input: { documentId: string; status: DocumentStatus; observacao?: string; rejectedReason?: string })` - Atualizar status/observações
   - Validar permissão: `coordenação` ou `administrativo` ou `recepção`

2. Criar página `/admin/documentos/page.tsx` ou adicionar seção de documentos em `/admin/alunos/[id]`:
   - Listar alunos com busca
   - Selecionar aluno e mostrar documentos
   - Permitir editar status (pending, delivered, rejected)
   - Permitir adicionar observações e motivo de rejeição

3. Atualizar `DocumentsView` para usar funções reais ao invés de mockdata

4. Integrar auditoria em `updateDocumentStatus()`:
   - Registrar alterações de status e observações
   - Usar `logAudit()` com `entity: "documento"`

---

### US-COORD-03 — Gerenciar notas

**Status:** ⚠️ Parcial - Funcionalidade existe mas coordenação não tem permissão completa

**O que já existe:**

- ✅ Funções de notas em `app/_lib/actions/notas.ts`:
  - `listNotasByAvaliacao()` - Listar notas
  - `upsertNota()` - Criar/editar notas
  - `deleteNota()` - Deletar notas (apenas `administrativo`)
- ✅ Sistema de auditoria implementado
- ✅ Validação de notas (0 a 10)
- ✅ Estrutura do banco completa: `turmas`, `avaliacoes`, `notas`, `turma_alunos`

**O que falta:**

- ❌ Função `requireNoteEditPermission()` em `notas.ts` permite apenas `professor` e `administrativo`, não inclui `coordenação`
- ❌ Função `deleteNota()` permite apenas `administrativo`, não inclui `coordenação`
- ❌ Coordenação precisa poder editar notas de qualquer turma (não apenas suas turmas)
- ❌ Não há página específica para coordenação gerenciar notas (mas pode usar `/admin` se tiver acesso)

**Estrutura do banco utilizada:**

- ✅ `turmas` - Turmas
- ✅ `avaliacoes` - Avaliações (A1, A2, A3, REC) por turma
- ✅ `notas` - Notas dos alunos
- ✅ `turma_alunos` - Vínculo alunos-turmas
- ✅ Regras de cálculo: média(A1, A2, A3) e REC

**Regras de negócio:**

- ✅ Nota deve estar entre 0 e 10
- ✅ Coordenação pode editar notas de qualquer turma (sem restrição de `professor_id`)
- ✅ Alterações devem ser auditadas
- ✅ Cálculo de resultado: Se REC > média(A1, A2, A3), então resultado = REC, senão = média

**Próximos passos:**

1. Atualizar `requireNoteEditPermission()` em `app/_lib/actions/notas.ts`:

   ```typescript
   const allowedRoles = ["professor", "administrativo", "coordenação"];
   ```

2. Atualizar `upsertNota()` para permitir coordenação editar qualquer turma:
   - Se role for `coordenação` ou `administrativo`, não validar `professor_id`
   - Se role for `professor`, manter validação atual

3. Atualizar `deleteNota()` para permitir coordenação:

   ```typescript
   if (profile.role !== "administrativo" && profile.role !== "coordenação") {
     throw new Error(
       "Apenas administrativo ou coordenação podem deletar notas.",
     );
   }
   ```

4. (Opcional) Criar página `/admin/notas` para coordenação gerenciar notas:
   - Listar turmas
   - Selecionar turma e avaliação
   - Editar notas de todos os alunos
   - Visualizar histórico de alterações

---

### US-COORD-04 — Gerenciar observações pedagógicas

**Status:** ⚠️ Parcial - Validação existe, mas funções CRUD não implementadas

**O que já existe:**

- ✅ Função `canEditObservacoesPedagogicas()` em `app/_lib/actions/observacoes-pedagogicas.ts` retorna `true` para `coordenação`
- ✅ Função `listObservacoesPedagogicasDoAluno()` - Listar observações de um aluno
- ✅ Função `listObservacoesForTeacher()` - Listar observações para professor
- ✅ Componente `ObservacoesPedagogicasView` em `app/_components/aluno/ObservacoesPedagogicasView.tsx`
- ✅ Estrutura do banco: `observacoes_pedagogicas`

**O que falta:**

- ❌ Não há função `createObservacaoPedagogica()` para criar observações
- ❌ Não há função `updateObservacaoPedagogica()` para editar observações
- ❌ Não há função `deleteObservacaoPedagogica()` para excluir observações
- ❌ Componente `ObservacoesPedagogicasView` é somente leitura (não permite criar/editar)
- ❌ Não há interface para coordenação criar/editar observações
- ❌ Observações podem ser vinculadas a aluno E/OU turma (campo `turma_id` existe mas não está sendo usado)

**Estrutura do banco necessária:**

- ✅ `observacoes_pedagogicas`:
  - `id`, `aluno_id` (nullable), `turma_id` (nullable), `content`, `author_id`, `created_at`, `updated_at`
  - Observação: Pode ser vinculada a aluno, turma, ou ambos

**Próximos passos:**

1. Criar funções em `app/_lib/actions/observacoes-pedagogicas.ts`:
   - `createObservacaoPedagogica(input: { alunoId?: string; turmaId?: string; content: string })`
     - Validar que pelo menos um de `alunoId` ou `turmaId` seja fornecido
     - Permitir apenas `coordenação` ou `administrativo`
     - Registrar `author_id` do usuário logado
     - Registrar auditoria
   - `updateObservacaoPedagogica(input: { observacaoId: string; content: string })`
     - Validar permissão (coordenação/admin)
     - Validar que observação existe
     - Atualizar `content` e `updated_at`
     - Registrar auditoria
   - `deleteObservacaoPedagogica(observacaoId: string)`
     - Validar permissão (coordenação/admin)
     - Deletar observação
     - Registrar auditoria

2. Criar/atualizar componente para criar/editar observações:
   - Adicionar formulário em `ObservacoesPedagogicasView` ou criar componente separado
   - Permitir vincular a aluno e/ou turma
   - Mostrar botões de editar/excluir apenas para coordenação/admin

3. Criar página ou seção em `/admin/alunos/[id]` para gerenciar observações:
   - Listar observações do aluno
   - Criar nova observação
   - Editar observações existentes
   - Excluir observações (com confirmação)

4. Integrar auditoria:
   - Usar `logAudit()` com `entity: "observacao_pedagogica"` (ou criar novo tipo se necessário)

---

### US-COORD-05 — Gerenciar etiquetas

**Status:** ⚠️ Parcial - Listagem e atribuição existem, mas criação/edição/desativação não

**O que já existe:**

- ✅ Função `listEtiquetas()` em `app/_lib/actions/etiquetas.ts` - Lista todas as etiquetas
- ✅ Função `listEtiquetasDoAluno()` - Lista etiquetas de um aluno
- ✅ Função `atribuirEtiquetaAoAluno()` - Atribui etiqueta a aluno (permite `recepção` e `administrativo`)
- ✅ Função `removerEtiquetaDoAluno()` - Remove etiqueta de aluno (permite `recepção` e `administrativo`)
- ✅ Estrutura do banco: `etiquetas` e `aluno_etiquetas`

**O que falta:**

- ❌ Não há função `createEtiqueta()` para criar novas etiquetas
- ❌ Não há função `updateEtiqueta()` para renomear/alterar cor
- ❌ Não há função `deleteEtiqueta()` ou `desativarEtiqueta()` para desativar etiquetas
- ❌ Funções `atribuirEtiquetaAoAluno()` e `removerEtiquetaDoAluno()` não permitem `coordenação`
- ❌ Não há campo `active` ou `disabled` na tabela `etiquetas` para desativar (pode ser necessário adicionar)
- ❌ Não há interface para coordenação criar/editar/desativar etiquetas
- ❌ Não há interface para coordenação atribuir/remover etiquetas de alunos

**Estrutura do banco utilizada:**

- ✅ `etiquetas`:
  - `id`, `name`, `color`, `created_by`, `created_at`
  - ⚠️ **Nota**: Pode ser necessário adicionar campo `active` ou `disabled` (boolean) se quiser desativar ao invés de deletar

- ✅ `aluno_etiquetas`:
  - `aluno_id`, `etiqueta_id`, `created_at`

**Próximos passos:**

1. Decidir estratégia de desativação:
   - Opção A: Adicionar campo `active` (boolean) na tabela `etiquetas`
   - Opção B: Deletar etiqueta (mas pode quebrar referências históricas)
   - **Recomendação**: Adicionar campo `active` (soft delete)

2. Se necessário, criar migration para adicionar campo `active`:

   ```sql
   ALTER TABLE etiquetas ADD COLUMN active BOOLEAN DEFAULT TRUE;
   ```

3. Criar funções em `app/_lib/actions/etiquetas.ts`:
   - `createEtiqueta(input: { name: string; color?: string })`
     - Validar permissão: `coordenação` ou `administrativo`
     - Validar que nome é único
     - Registrar `created_by`
     - Registrar auditoria
   - `updateEtiqueta(input: { etiquetaId: string; name?: string; color?: string })`
     - Validar permissão: `coordenação` ou `administrativo`
     - Atualizar nome e/ou cor
     - Registrar auditoria
   - `deleteEtiqueta(etiquetaId: string)` ou `desativarEtiqueta(etiquetaId: string)`
     - Validar permissão: `coordenação` ou `administrativo`
     - Se soft delete: atualizar `active = false`
     - Se hard delete: deletar da tabela (e cascata em `aluno_etiquetas`?)
     - Registrar auditoria

4. Atualizar `atribuirEtiquetaAoAluno()` e `removerEtiquetaDoAluno()`:
   - Adicionar `coordenação` às permissões permitidas

   ```typescript
   if (
     profile.role !== "recepção" &&
     profile.role !== "administrativo" &&
     profile.role !== "coordenação"
   ) {
     throw new Error("Sem permissão para atribuir etiquetas.");
   }
   ```

5. Atualizar `listEtiquetas()` para filtrar etiquetas ativas (se usar soft delete):

   ```typescript
   .eq("active", true)  // Se usar campo active
   ```

6. Criar página `/admin/etiquetas` ou seção em `/admin`:
   - Listar todas as etiquetas
   - Criar nova etiqueta (nome e cor)
   - Editar etiqueta existente (renomear, alterar cor)
   - Desativar/ativar etiqueta
   - Atribuir/remover etiquetas de alunos (integrado ou página separada)

---

### US-COORD-06 — Restrição: não visualizar financeiro

**Status:** ❌ Não implementado - Coordenação atualmente tem acesso ao financeiro

**O que já existe:**

- ✅ Menu do sidebar (`app/_components/siderbar/SideBar.tsx`) mostra "Financeiro" para coordenação (usa `adminMenuItems`)
- ✅ Página `/admin/financeiro/page.tsx` verifica apenas `administrativo`, mas coordenação pode tentar acessar
- ✅ Função `canAccessFinance()` em `app/_lib/actions/profile.ts` retorna `false` para coordenação (mas não está sendo usada em todas as páginas)

**O que falta:**

- ❌ Menu do sidebar inclui "Financeiro" para coordenação (deveria ser removido)
- ❌ Página `/admin/financeiro/page.tsx` não bloqueia explicitamente coordenação (retorna apenas para `administrativo`)
- ❌ Funções de financeiro em `app/_lib/actions/mensalidades.ts` podem não estar verificando restrição de coordenação
- ❌ Não há validação centralizada para bloquear coordenação de todas as funcionalidades financeiras

**Estrutura necessária:**

- N/A (restrição de acesso)

**Próximos passos:**

1. Atualizar `SideBar.tsx` para remover "Financeiro" do menu quando role for `coordenação`:
   - Criar menu separado para coordenação OU
   - Filtrar itens do menu baseado em role:

   ```typescript
   const coordenacaoMenuItems = adminMenuItems.filter(
     (item) => item.title !== "Financeiro",
   );
   ```

2. Atualizar `/admin/financeiro/page.tsx` para bloquear coordenação explicitamente:

   ```typescript
   if (profile.role !== "administrativo") {
     return (
       <div className="flex-1 p-6">Sem acesso ao Financeiro administrativo.</div>
     );
   }
   ```

   (Já está implementado, mas garantir que está correto)

3. Verificar e atualizar funções em `app/_lib/actions/mensalidades.ts`:
   - Garantir que todas as funções de financeiro bloqueiem coordenação
   - Verificar: `listMensalidades()`, `updateMensalidade()`, `updatePagamento()`, `deletePagamento()`, etc.

4. Atualizar `canAccessFinance()` em `app/_lib/actions/profile.ts` para documentar restrição:
   - Função já retorna `false` para coordenação (verificar implementação)

5. Testar todas as rotas e funcionalidades financeiras para garantir que coordenação não consegue acessar

---

## 📋 Estrutura do Banco de Dados Utilizada

### Tabelas Principais

1. **profiles** - Usuários do sistema
   - `user_id` (PK, FK → auth.users)
   - `name`, `email`, `telefone`
   - `role` (aluno|professor|coordenação|recepção|administrativo)

2. **alunos** - Dados específicos de alunos
   - `user_id` (PK, FK → profiles.user_id)
   - `age`, `date_of_birth`

3. **documentos_aluno** - Documentos dos alunos
   - `id` (PK)
   - `aluno_id` (FK → profiles.user_id)
   - `documento_tipo_id` (FK → documento_tipos.id)
   - `status` (pending|delivered|rejected)
   - `observacao`, `rejected_reason`

4. **notas** - Notas dos alunos
   - `id` (PK)
   - `avaliacao_id` (FK → avaliacoes.id)
   - `aluno_id` (FK → profiles.user_id)
   - `value` (numeric)

5. **observacoes_pedagogicas** - Observações pedagógicas
   - `id` (PK)
   - `aluno_id` (FK → profiles.user_id, nullable)
   - `turma_id` (FK → turmas.id, nullable)
   - `content` (text)
   - `author_id` (FK → profiles.user_id)

6. **etiquetas** - Etiquetas do sistema
   - `id` (PK)
   - `name` (unique)
   - `color`
   - `created_by` (FK → profiles.user_id)
   - ⚠️ **Pode precisar**: `active` (boolean) para desativação

7. **aluno_etiquetas** - Relacionamento aluno-etiquetas
   - `aluno_id` (FK → profiles.user_id)
   - `etiqueta_id` (FK → etiquetas.id)

8. **audit_logs** - Logs de auditoria
   - `id` (PK)
   - `user_id` (FK → profiles.user_id)
   - `action`, `entity`, `entity_id`
   - `old_value`, `new_value` (jsonb)
   - `description`

---

## 🚀 Resumo de Ações Necessárias

### Prioridade Alta (Funcionalidades Core)

1. **US-COORD-03 — Gerenciar notas**
   - Atualizar permissões em `notas.ts` para incluir `coordenação`
   - ✅ Relativamente simples, alta prioridade

2. **US-COORD-06 — Restrição financeiro**
   - Remover "Financeiro" do menu para coordenação
   - Garantir bloqueio em todas as rotas/funções
   - ✅ Crítico para segurança/regras de negócio

3. **US-COORD-01 — Gerenciar dados pessoais**
   - Atualizar permissões em `listAlunos()`, `listProfessores()`
   - Criar/atualizar funções de edição para permitir coordenação
   - ✅ Necessário para funcionalidade básica

### Prioridade Média (Funcionalidades Importantes)

4. **US-COORD-02 — Gerenciar documentação**
   - Criar funções de atualização de documentos
   - Criar interface para coordenação gerenciar documentos
   - ✅ Importante, mas pode usar estrutura existente

5. **US-COORD-04 — Gerenciar observações pedagógicas**
   - Criar funções CRUD completas
   - Criar interface para criar/editar/excluir
   - ✅ Funcionalidade importante para coordenação

6. **US-COORD-05 — Gerenciar etiquetas**
   - Criar funções de criação/edição/desativação
   - Atualizar permissões de atribuição
   - Criar interface de gerenciamento
   - ✅ Útil, mas não crítico

---

## 📝 Notas Importantes

1. **Permissões:**
   - Coordenação compartilha muitas funcionalidades com `administrativo`
   - Diferença principal: coordenação NÃO tem acesso ao financeiro
   - Coordenação pode editar notas de qualquer turma (sem restrição de professor)

2. **Auditoria:**
   - Todas as alterações feitas por coordenação devem ser auditadas
   - Usar `logAudit()` em todas as funções de criação/edição/exclusão
   - Entidades: `aluno`, `professor`, `documento`, `nota`, `observacao_pedagogica`, `etiqueta`

3. **Estrutura do Banco:**
   - Verificar nomes exatos das colunas antes de implementar
   - Usar tipos do `database.ts` para garantir consistência
   - Considerar adicionar campo `active` em `etiquetas` se usar soft delete

4. **Validações:**
   - Sempre validar permissões no início das funções
   - Mensagens de erro claras em português
   - Validar dados de entrada (nomes, valores, etc.)

5. **Interface:**
   - Coordenação usa rotas `/admin/*` (compartilha com administrativo)
   - Menu do sidebar deve ser filtrado para remover financeiro
   - Considerar criar componentes reutilizáveis entre admin e coordenação

---

## ✅ Checklist de Implementação

### US-COORD-01 — Gerenciar dados pessoais

- [ ] Atualizar `listAlunos()` para permitir coordenação
- [ ] Atualizar `listProfessores()` para permitir coordenação
- [ ] Atualizar/criar `updateStudentProfile()` para permitir coordenação
- [ ] Criar `updateProfessorProfile()` para coordenação
- [ ] Adicionar interface de edição em `/admin/alunos`
- [ ] Adicionar interface de edição em `/admin/professores`
- [ ] Testar edição de dados pessoais

### US-COORD-02 — Gerenciar documentação

- [ ] Criar `listStudentDocuments()` em `documents.ts`
- [ ] Criar `updateDocumentStatus()` em `documents.ts`
- [ ] Integrar auditoria em `updateDocumentStatus()`
- [ ] Criar página/seção para gerenciar documentos
- [ ] Atualizar `DocumentsView` para usar funções reais
- [ ] Testar edição de documentos

### US-COORD-03 — Gerenciar notas

- [ ] Atualizar `requireNoteEditPermission()` para incluir coordenação
- [ ] Atualizar `upsertNota()` para permitir coordenação editar qualquer turma
- [ ] Atualizar `deleteNota()` para permitir coordenação
- [ ] Testar edição de notas por coordenação
- [ ] (Opcional) Criar página `/admin/notas`

### US-COORD-04 — Gerenciar observações pedagógicas

- [ ] Criar `createObservacaoPedagogica()`
- [ ] Criar `updateObservacaoPedagogica()`
- [ ] Criar `deleteObservacaoPedagogica()`
- [ ] Integrar auditoria em todas as funções
- [ ] Criar/atualizar componente para criar/editar observações
- [ ] Criar página/seção para gerenciar observações
- [ ] Testar CRUD de observações

### US-COORD-05 — Gerenciar etiquetas

- [ ] Decidir estratégia de desativação (soft delete?)
- [ ] Criar migration para campo `active` (se necessário)
- [ ] Criar `createEtiqueta()`
- [ ] Criar `updateEtiqueta()`
- [ ] Criar `deleteEtiqueta()` ou `desativarEtiqueta()`
- [ ] Atualizar `atribuirEtiquetaAoAluno()` para permitir coordenação
- [ ] Atualizar `removerEtiquetaDoAluno()` para permitir coordenação
- [ ] Criar página `/admin/etiquetas` ou seção
- [ ] Testar gerenciamento de etiquetas

### US-COORD-06 — Restrição financeiro

- [ ] Atualizar `SideBar.tsx` para remover "Financeiro" do menu de coordenação
- [ ] Verificar bloqueio em `/admin/financeiro/page.tsx`
- [ ] Verificar bloqueio em todas as funções de `mensalidades.ts`
- [ ] Testar que coordenação não consegue acessar financeiro
- [ ] Documentar restrição

---

## 🔗 Referências

- Documentação geral: `DOCUMENTACAO.md`
- Implementação Admin: `IMPLEMENTACAO_ADMIN.md`
- Implementação Recepção: `IMPLEMENTACAO_RECEPCAO.md`
- Implementação Professor: `IMPLEMENTACAO_PROFESSOR.md`
- Tipos do banco: `app/_lib/types/database.ts`
