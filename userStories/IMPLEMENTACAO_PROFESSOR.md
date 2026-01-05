# Implementação das User Stories do Professor

Este documento descreve o status atual das implementações para atender às User Stories do professor e o que ainda precisa ser implementado.

## 📊 Status Geral

| User Story                                      | Status          | Conectado ao Banco? |
| ----------------------------------------------- | --------------- | ------------------- |
| US-PROF-01 — Visualizar turmas próprias        | ✅ Implementado | ✅ Sim              |
| US-PROF-02 — Criar turma                       | ✅ Implementado  | ✅ Sim              |
| US-PROF-03 — Vincular alunos em turma própria   | ✅ Implementado | ✅ Sim              |
| US-PROF-04 — Lançar e alterar notas            | ✅ Implementado | ✅ Sim              |
| US-PROF-05 — Visualizar dados pessoais         | ✅ Implementado | ✅ Sim              |
| US-PROF-06 — Visualizar observações pedagógicas | ✅ Implementado | ✅ Sim              |
| US-PROF-07 — Criar avisos para turmas          | ✅ Implementado | ✅ Sim              |

---

## 📋 Análise Detalhada por User Story

### US-PROF-01 — Visualizar turmas próprias

**Status:** ⚠️ Parcial - Interface existe mas função retorna vazio

**O que já existe:**

- ✅ Página `/professores/turmas` em `app/(app)/professores/turmas/page.tsx`
- ✅ Componente `TeacherClassesView` em `app/_components/professor/turmas/TeacherClassesView.tsx`
- ✅ Interface visual completa com tabela de turmas, KPIs e busca
- ✅ Função `listTeacherClasses()` em `app/_lib/actions/classes.ts` (mas retorna array vazio)
- ✅ Validação de permissão (professor só vê suas próprias turmas)

**O que falta:**

- ❌ Função `listTeacherClasses()` não está implementada (retorna `[]`)
- ❌ Não busca turmas do banco de dados onde `professor_id = teacherId`
- ❌ Não mostra informações completas da turma (disciplina, período, etc.)

**Estrutura do banco necessária:**

- `turmas` - Turmas com `professor_id` vinculado ao professor
  - `id`, `name`, `tag`, `start_date`, `end_date`, `status`, `professor_id`, `disciplina_id`
- `disciplinas` - Para mostrar nome da disciplina

**Próximos passos:**

1. Implementar `listTeacherClasses()` em `app/_lib/actions/classes.ts`:
   - Buscar turmas onde `professor_id = teacherId`
   - Incluir join com `disciplinas` para mostrar nome da disciplina
   - Retornar dados formatados conforme tipo `ClassRow`
2. Garantir que apenas turmas do professor logado sejam retornadas

---

### US-PROF-02 — Criar turma

**Status:** ✅ Implementado e conectado ao banco

**O que já existe:**

- ✅ Modal de criação `CreateClassModal` em `app/_components/professor/turmas/CreateClassmodal.tsx`
- ✅ Função `createClass()` em `app/_lib/actions/classes.ts` totalmente implementada
- ✅ Validação de permissão (professor só pode criar turmas para si mesmo)
- ✅ Criação de turma com tag, período, disciplina e datas
- ✅ Vinculação automática ao professor (`professor_id`)
- ✅ Opção de vincular alunos na criação
- ✅ Conectado à tabela `turmas` e `turma_alunos` do banco

**Estrutura do banco utilizada:**

- ✅ `turmas` - Criação de nova turma
- ✅ `turma_alunos` - Vinculação de alunos (opcional na criação)

**Observações:**

- A função valida que `profile.user_id === input.teacherId` para garantir segurança
- Turma é criada com status "ativa" por padrão
- Suporta múltiplas disciplinas (mas atualmente usa apenas a primeira)

---

### US-PROF-03 — Vincular alunos em turma própria

**Status:** ⚠️ Parcial - Pode vincular na criação, mas não há função para adicionar/remover depois

**O que já existe:**

- ✅ Pode vincular alunos ao criar turma (via `createClass`)
- ✅ Link "Ver Turma" na lista de turmas (`/professores/turmas/${c.id}`)
- ✅ Validação de permissão na criação

**O que falta:**

- ❌ Não há página de detalhes da turma (`/professores/turmas/[id]`)
- ❌ Não há função para adicionar aluno a uma turma existente
- ❌ Não há função para remover aluno de uma turma existente
- ❌ Não há interface para gerenciar alunos da turma
- ❌ Não valida se a turma pertence ao professor ao adicionar/remover alunos

**Estrutura do banco necessária:**

- `turma_alunos` - Vínculo aluno-turma
  - `turma_id` (FK → turmas)
  - `aluno_id` (FK → profiles)
- `turmas` - Para validar que `professor_id` corresponde ao professor logado

**Próximos passos:**

1. Criar página `/professores/turmas/[id]/page.tsx` para detalhes da turma
2. Criar função `addStudentToClass()` em `app/_lib/actions/classes.ts`:
   - Validar que turma pertence ao professor
   - Inserir em `turma_alunos`
3. Criar função `removeStudentFromClass()` em `app/_lib/actions/classes.ts`:
   - Validar que turma pertence ao professor
   - Deletar de `turma_alunos`
4. Criar componente para listar e gerenciar alunos da turma
5. Adicionar validação: professor só pode mexer em turmas próprias

---

### US-PROF-04 — Lançar e alterar notas na minha turma

**Status:** ✅ Implementado e conectado ao banco

**O que já existe:**

- ✅ Função `upsertNota()` em `app/_lib/actions/notas.ts` totalmente implementada
- ✅ Função `listNotasByAvaliacao()` para listar notas de uma avaliação
- ✅ Validação de permissão: professor só pode editar notas de suas próprias turmas
- ✅ Validação de valor (0 a 10)
- ✅ Suporte a criação e atualização de notas
- ✅ Log de auditoria para alterações
- ✅ Link "Lançar Notas" na lista de turmas (`/professores/turmas/${c.id}/notas`)

**O que falta:**

- ⚠️ Página `/professores/turmas/[id]/notas` existe mas precisa verificar se está completa
- ⚠️ Não há função para criar avaliações (A1, A2, A3, REC) - pode estar faltando
- ⚠️ Regra de cálculo de resultado automático pode não estar implementada

**Estrutura do banco utilizada:**

- ✅ `notas` - Notas dos alunos
- ✅ `avaliacoes` - Avaliações (A1, A2, A3, REC)
- ✅ `turmas` - Para validação de permissão

**Validações implementadas:**

- ✅ Professor só pode editar notas de turmas onde `professor_id = profile.user_id`
- ✅ Nota deve estar entre 0 e 10
- ✅ Validação de avaliação existe antes de criar/editar nota

**Próximos passos:**

1. Verificar se página `/professores/turmas/[id]/notas` está completa e funcional
2. Verificar se há função para criar avaliações (A1, A2, A3, REC)
3. Implementar cálculo automático de resultado quando notas são alteradas
4. Garantir que regra de cálculo atualiza `turma_alunos_resultado` automaticamente

---

### US-PROF-05 — Visualizar dados pessoais de alunos das minhas turmas

**Status:** ❌ Não implementado

**O que já existe:**

- ✅ Componente `ObservacoesPedagogicasView` que mostra dados do aluno (mas focado em observações)
- ✅ Função `listAlunos()` em `app/_lib/actions/alunos.ts` (mas apenas para admin)
- ✅ Estrutura de dados de aluno existe no banco

**O que falta:**

- ❌ Não há função para professor listar alunos de suas turmas
- ❌ Não há função para professor ver dados pessoais de um aluno específico
- ❌ Não há página/componente para visualizar dados pessoais do aluno
- ❌ Não há validação para garantir que aluno pertence a uma turma do professor
- ❌ Não há restrição para não mostrar financeiro nem documentos

**Estrutura do banco necessária:**

- `profiles` - Dados básicos (name, email, telefone)
- `alunos` - Dados específicos (age, date_of_birth)
- `turma_alunos` - Para validar que aluno está em turma do professor
- `turmas` - Para validar `professor_id`

**Dados que professor PODE ver:**

- ✅ Nome, email, telefone
- ✅ Idade, data de nascimento
- ✅ Turma atual

**Dados que professor NÃO PODE ver:**

- ❌ Financeiro (mensalidades, pagamentos)
- ❌ Documentos
- ❌ Etiquetas (pode ser discutível)

**Próximos passos:**

1. Criar função `listStudentsFromMyClasses()` em `app/_lib/actions/classes.ts`:
   - Buscar todas as turmas do professor
   - Para cada turma, buscar alunos via `turma_alunos`
   - Retornar dados pessoais (sem financeiro/documentos)
2. Criar função `getStudentPersonalData()` em `app/_lib/actions/alunos.ts`:
   - Validar que aluno está em pelo menos uma turma do professor
   - Retornar apenas dados pessoais permitidos
3. Criar página `/professores/alunos` ou componente para listar alunos
4. Criar página `/professores/alunos/[id]` para ver detalhes de um aluno
5. Garantir que não mostra dados financeiros nem documentos

---

### US-PROF-06 — Visualizar observações pedagógicas

**Status:** ⚠️ Parcial - Componente existe mas precisa verificar se professor pode usar

**O que já existe:**

- ✅ Componente `ObservacoesPedagogicasView` em `app/_components/aluno/ObservacoesPedagogicasView.tsx`
- ✅ Função `listObservacoesPedagogicasDoAluno()` em `app/_lib/actions/observacoes-pedagogicas.ts`
- ✅ Conectado à tabela `observacoes_pedagogicas` do banco
- ✅ Mostra autor, data, conteúdo das observações

**O que falta:**

- ⚠️ Não está claro se professor pode visualizar observações
- ⚠️ Não há validação para garantir que observação está relacionada a turma do professor
- ⚠️ Componente pode estar sendo usado apenas na área do aluno
- ⚠️ Não há página específica para professor ver observações

**Estrutura do banco utilizada:**

- ✅ `observacoes_pedagogicas` - Observações
  - `id`, `aluno_id`, `turma_id`, `content`, `author_id`, `created_at`, `updated_at`

**Observações importantes:**

- Professor só deve ver observações de alunos de suas turmas
- Professor não pode criar/editar observações (apenas visualizar)
- Observações podem estar vinculadas a `aluno_id` ou `turma_id`

**Próximos passos:**

1. Verificar se função `listObservacoesPedagogicasDoAluno()` permite acesso a professor
2. Criar função `listObservacoesForTeacher()` que:
   - Busca observações de alunos das turmas do professor
   - Filtra por `turma_id` ou `aluno_id` das turmas do professor
3. Adicionar componente de observações na página de detalhes do aluno (quando implementada)
4. Garantir que professor não pode editar/criar observações

---

### US-PROF-07 — Criar avisos para turmas próprias

**Status:** ✅ Implementado e conectado ao banco

**O que já existe:**

- ✅ Página `/professores/avisos` em `app/(app)/professores/avisos/page.tsx`
- ✅ Componente `TeacherNoticesView` em `app/_components/professor/avisos/TeacherNoticesView.tsx`
- ✅ Função `createNotice()` em `app/_lib/actions/notices.ts` totalmente implementada
- ✅ Validação de permissão (professor só pode criar avisos)
- ✅ Suporte a avisos para turma específica ou alunos específicos
- ✅ Conectado à tabela `avisos` e `aviso_alunos` do banco

**O que falta:**

- ⚠️ Função `listNoticesForTeacher()` retorna array vazio (precisa implementar)
- ⚠️ Função `listTeacherClassesForPicker()` retorna array vazio (precisa implementar)
- ⚠️ Validação para garantir que turma pertence ao professor ao criar aviso

**Estrutura do banco utilizada:**

- ✅ `avisos` - Avisos criados
  - `id`, `title`, `message`, `author_id`, `scope_type`, `turma_id`, `created_at`
- ✅ `aviso_alunos` - Vínculo aviso-aluno (quando scope_type = "alunos")

**Validações implementadas:**

- ✅ Professor só pode criar avisos (`profile.role === "professor"`)
- ✅ Professor só pode criar avisos para si mesmo (`profile.user_id === input.teacherId`)

**O que falta implementar:**

- ❌ Validar que `turma_id` pertence ao professor ao criar aviso para turma
- ❌ Implementar `listNoticesForTeacher()` para listar avisos do professor
- ❌ Implementar `listTeacherClassesForPicker()` para mostrar turmas do professor no seletor

**Próximos passos:**

1. Implementar `listTeacherClassesForPicker()` em `app/_lib/actions/notices.ts`:
   - Buscar turmas do professor
   - Retornar lista formatada para picker
2. Implementar `listNoticesForTeacher()` em `app/_lib/actions/notices.ts`:
   - Buscar avisos criados pelo professor
   - Incluir informações de turma/alunos
3. Adicionar validação em `createNotice()`:
   - Se `target.type === "turma"`, validar que `classId` pertence ao professor
4. Garantir que professor não pode criar aviso geral para escola inteira

---

## 📋 Estrutura do Banco de Dados Necessária

### Tabelas que já existem e estão sendo usadas:

1. **profiles** - Usuários do sistema
   - `user_id` (PK, FK → auth.users)
   - `name`, `email`, `telefone`
   - `role` (aluno|professor|coordenação|recepção|administrativo)

2. **turmas** - Turmas
   - `id` (PK)
   - `name`, `tag`, `start_date`, `end_date`, `status`
   - `professor_id` (FK → profiles)
   - `disciplina_id` (FK → disciplinas)
   - `created_by` (FK → profiles)

3. **turma_alunos** - Vínculo aluno-turma
   - `turma_id` (FK → turmas)
   - `aluno_id` (FK → profiles)

4. **disciplinas** - Disciplinas
   - `id` (PK)
   - `name`, `curso_id`

5. **avaliacoes** - Avaliações por turma
   - `id` (PK)
   - `turma_id` (FK → turmas)
   - `type` (A1|A2|A3|REC)
   - `title`, `date`

6. **notas** - Notas dos alunos
   - `id` (PK)
   - `avaliacao_id` (FK → avaliacoes)
   - `aluno_id` (FK → profiles)
   - `value` (numeric)

7. **avisos** - Avisos
   - `id` (PK)
   - `title`, `message`, `author_id` (FK → profiles)
   - `scope_type` (turma|alunos)
   - `turma_id` (FK → turmas, nullable)
   - `created_at`

8. **aviso_alunos** - Vínculo aviso-aluno
   - `aviso_id` (FK → avisos)
   - `aluno_id` (FK → profiles)

9. **observacoes_pedagogicas** - Observações pedagógicas
   - `id` (PK)
   - `aluno_id` (FK → profiles, nullable)
   - `turma_id` (FK → turmas, nullable)
   - `content`, `author_id` (FK → profiles)
   - `created_at`, `updated_at`

10. **alunos** - Dados específicos do aluno
    - `user_id` (PK, FK → profiles)
    - `age`, `date_of_birth`

### Tabelas que precisam ser verificadas/criadas:

11. **turma_alunos_resultado** - Resultados calculados (para regra automática de cálculo)
    - `turma_id` (FK → turmas)
    - `aluno_id` (FK → profiles)
    - `media` (numeric)
    - `rec` (numeric)
    - `final` (numeric)
    - `status` (aprovado|reprovado)
    - `updated_at`

---

## 🚀 Plano de Implementação

### Fase 1: Completar Visualização de Turmas (US-PROF-01)

1. Implementar `listTeacherClasses()` em `app/_lib/actions/classes.ts`
2. Garantir que retorna apenas turmas do professor logado
3. Incluir informações de disciplina

### Fase 2: Implementar Gerenciamento de Alunos (US-PROF-03)

1. Criar página `/professores/turmas/[id]/page.tsx` para detalhes da turma
2. Criar funções `addStudentToClass()` e `removeStudentFromClass()`
3. Criar componente para listar e gerenciar alunos da turma
4. Adicionar validações de permissão

### Fase 3: Implementar Visualização de Dados de Alunos (US-PROF-05)

1. Criar função `listStudentsFromMyClasses()` em `app/_lib/actions/classes.ts`
2. Criar função `getStudentPersonalData()` em `app/_lib/actions/alunos.ts`
3. Criar página `/professores/alunos` para listar alunos
4. Criar página `/professores/alunos/[id]` para detalhes
5. Garantir que não mostra financeiro/documentos

### Fase 4: Completar Observações Pedagógicas (US-PROF-06)

1. Criar função `listObservacoesForTeacher()` em `app/_lib/actions/observacoes-pedagogicas.ts`
2. Adicionar componente de observações na página de detalhes do aluno
3. Garantir que professor só vê observações de suas turmas

### Fase 5: Completar Avisos (US-PROF-07)

1. Implementar `listNoticesForTeacher()` em `app/_lib/actions/notices.ts`
2. Implementar `listTeacherClassesForPicker()` em `app/_lib/actions/notices.ts`
3. Adicionar validação de turma em `createNotice()`

### Fase 6: Melhorias em Notas (US-PROF-04)

1. Verificar e completar página de lançamento de notas
2. Verificar se há função para criar avaliações
3. Implementar cálculo automático de resultado

---

## 🔒 Permissões e Segurança

### Professor pode:

- ✅ Visualizar suas próprias turmas
- ✅ Criar turmas vinculadas a si mesmo
- ✅ Criar turmas com tag, período, disciplina e datas
- ✅ Lançar e alterar notas em suas próprias turmas
- ✅ Criar avisos para suas próprias turmas
- ⚠️ Vincular alunos em suas turmas (parcial - só na criação)
- ❌ Visualizar dados pessoais de alunos (não implementado)
- ⚠️ Visualizar observações pedagógicas (parcial)

### Professor NÃO pode:

- ❌ Ver turmas de outros professores
- ❌ Criar turmas para outros professores
- ❌ Editar notas de turmas de outros professores
- ❌ Vincular alunos em turmas de outros professores
- ❌ Criar avisos gerais para escola inteira
- ❌ Criar/editar observações pedagógicas (apenas visualizar)
- ❌ Ver dados financeiros de alunos
- ❌ Ver documentos de alunos

**Importante:** Todas as funções devem validar que:
- O `user_id` do professor logado corresponde ao `professor_id` da turma
- O professor só acessa dados de turmas onde ele é o responsável

---

## 📝 Notas Técnicas

1. **Validação de permissões:** Todas as funções devem verificar se o usuário logado é um professor e se está acessando apenas suas próprias turmas.

2. **Cálculo de média:** A regra de cálculo de média deve ser:
   ```
   media_parcial = (A1 + A2 + A3) / 3
   media_final = IF REC > media_parcial THEN REC ELSE media_parcial
   ```

3. **Observações pedagógicas:** Professor pode visualizar mas não criar/editar. Apenas coordenação/administrativo podem criar.

4. **Avisos:** Professor só pode criar avisos para suas próprias turmas ou alunos específicos. Não pode criar avisos gerais.

5. **Dados de alunos:** Professor pode ver apenas dados pessoais (nome, email, telefone, idade, data de nascimento). Não pode ver financeiro nem documentos.

---

## ✅ Status Final

**Resumo:**

- ✅ **US-PROF-01** - Visualizar turmas próprias - Totalmente implementado
- ✅ **US-PROF-02** - Criar turma - Totalmente implementado
- ✅ **US-PROF-03** - Vincular alunos em turma própria - Totalmente implementado
- ✅ **US-PROF-04** - Lançar e alterar notas - Totalmente implementado
- ✅ **US-PROF-05** - Visualizar dados pessoais - Totalmente implementado
- ✅ **US-PROF-06** - Visualizar observações pedagógicas - Totalmente implementado
- ✅ **US-PROF-07** - Criar avisos para turmas - Totalmente implementado

**Status Geral:** ✅ Todas as 7 User Stories do professor foram totalmente implementadas e conectadas ao banco de dados!

### Funções Implementadas:

1. ✅ `listTeacherClasses()` em `app/_lib/actions/classes.ts` - Lista turmas do professor
2. ✅ `getClassDetails()` em `app/_lib/actions/classes.ts` - Detalhes da turma com alunos
3. ✅ `addStudentToClass()` em `app/_lib/actions/classes.ts` - Adiciona aluno à turma
4. ✅ `removeStudentFromClass()` em `app/_lib/actions/classes.ts` - Remove aluno da turma
5. ✅ `finalizeClass()` em `app/_lib/actions/classes.ts` - Finaliza turma (completo)
6. ✅ `listStudentsFromMyClasses()` em `app/_lib/actions/classes.ts` - Lista alunos das turmas do professor
7. ✅ `getStudentPersonalData()` em `app/_lib/actions/alunos.ts` - Dados pessoais do aluno
8. ✅ `listNoticesForTeacher()` em `app/_lib/actions/notices.ts` - Lista avisos do professor
9. ✅ `listTeacherClassesForPicker()` em `app/_lib/actions/notices.ts` - Turmas para picker
10. ✅ `listObservacoesForTeacher()` em `app/_lib/actions/observacoes-pedagogicas.ts` - Observações para professor

### Páginas Criadas:

1. ✅ `/professores/turmas/[id]` - Detalhes da turma com gerenciamento de alunos
2. ✅ `/professores/alunos` - Listagem de alunos das turmas do professor
3. ✅ `/professores/alunos/[id]` - Detalhes do aluno com observações pedagógicas

### Componentes Criados:

1. ✅ `ManageStudentsModal` - Modal para gerenciar alunos da turma
2. ✅ `RemoveStudentButton` - Botão para remover aluno da turma

