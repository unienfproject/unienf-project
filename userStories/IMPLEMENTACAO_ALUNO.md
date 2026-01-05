# Implementação das User Stories do Aluno

Este documento descreve o status atual das implementações para atender às User Stories do aluno e o que ainda precisa ser implementado.

## 📊 Status Geral

| User Story                                      | Status          | Conectado ao Banco? |
| ----------------------------------------------- | --------------- | ------------------- |
| US-ALU-01 — Visualizar meu perfil               | ⚠️ Parcial      | ❌ Não              |
| US-ALU-02 — Visualizar minhas notas e resultado | ⚠️ Parcial      | ❌ Não              |
| US-ALU-03 — Visualizar meus documentos          | ⚠️ Parcial      | ❌ Não              |
| US-ALU-04 — Visualizar meu financeiro           | ⚠️ Parcial      | ❌ Não              |
| US-ALU-05 — Visualizar minhas etiquetas         | ✅ Implementado | ✅ Sim              |

---

## 📋 Análise Detalhada por User Story

### US-ALU-01 — Visualizar meu perfil

**Status:** ⚠️ Parcial - Interface existe mas não conectada ao banco

**O que já existe:**

- ✅ Componente `PerfilAluno.tsx` em `app/_components/aluno/PerfilAluno.tsx`
- ✅ Função `getUserProfile()` em `app/_lib/actions/profile.ts` que retorna dados do usuário logado
- ✅ Página principal do aluno (`app/(app)/aluno/page.tsx`) mostra alguns dados básicos (nome, turma, média)

**O que falta:**

- ❌ Não há uma rota específica `/aluno/perfil` para o aluno visualizar seu próprio perfil completo
- ❌ Componente `PerfilAluno.tsx` está com dados hardcoded (não usa dados reais do banco)
- ❌ Não mostra dados completos do aluno (data de nascimento, endereço, etc.)
- ❌ Não está conectado à tabela `profiles` e `alunos` do banco de dados

**Estrutura do banco necessária:**

- `profiles` - Dados básicos (name, email, telefone)
- `alunos` - Dados específicos do aluno (date_of_birth, age)
- `turma_alunos` - Para mostrar turma atual do aluno

**Próximos passos:**

1. Criar função `getMyProfile()` em `app/_lib/actions/alunos.ts` que retorna dados do aluno logado
2. Criar página `/aluno/perfil` ou adicionar seção de perfil na página principal
3. Conectar componente `PerfilAluno.tsx` aos dados reais do banco
4. Garantir que aluno só veja seus próprios dados (validação de `user_id`)

---

### US-ALU-02 — Visualizar minhas notas e resultado

**Status:** ⚠️ Parcial - Interface existe mas não conectada ao banco

**O que já existe:**

- ✅ Página `/aluno/notas` em `app/(app)/aluno/notas/page.tsx`
- ✅ Interface visual completa com tabela de notas por disciplina
- ✅ Mostra A1, A2, A3, REC e média
- ✅ Actions de notas existem em `app/_lib/actions/notas.ts` (mas apenas para professores/admin editarem)

**O que falta:**

- ❌ Dados estão hardcoded na página (não vem do banco)
- ❌ Não há função para aluno listar suas próprias notas
- ❌ Cálculo de média não segue a regra correta:
  - Regra: Se REC > média(A1, A2, A3), então resultado = REC, senão = média(A1, A2, A3)
- ❌ Não mostra resultado final (aprovado/reprovado) baseado na média
- ❌ Não agrupa notas por turma/disciplina corretamente

**Estrutura do banco necessária:**

- `turma_alunos` - Vínculo aluno-turma
- `turmas` - Turmas
- `avaliacoes` - Avaliações (A1, A2, A3, REC) por turma
- `notas` - Notas do aluno por avaliação

**Próximos passos:**

1. Criar função `listMyNotas()` em `app/_lib/actions/notas.ts` que:
   - Busca todas as turmas do aluno
   - Para cada turma, busca avaliações (A1, A2, A3, REC)
   - Busca notas do aluno nessas avaliações
   - Calcula média seguindo a regra: `IF REC > média(A1,A2,A3) THEN REC ELSE média(A1,A2,A3)`
2. Atualizar página `/aluno/notas` para usar dados reais
3. Adicionar cálculo de status (aprovado/reprovado) baseado na média final
4. Agrupar notas por turma/disciplina

---

### US-ALU-03 — Visualizar meus documentos

**Status:** ⚠️ Parcial - Interface existe mas usando mockdata

**O que já existe:**

- ✅ Página `/aluno/documentos` em `app/(app)/aluno/documentos/page.tsx`
- ✅ Componente `DocumentsView` que mostra documentos com status
- ✅ Suporte a status: `pending`, `delivered`, `rejected`
- ✅ Mostra observações e motivo de rejeição quando existir
- ✅ Validação de permissão (aluno só vê seus próprios documentos)

**O que falta:**

- ❌ Usa mockdata (`getStudentDocuments` de `app/_lib/mockdata/docs.mock.ts`)
- ❌ Não está conectado à tabela `documentos_aluno` do banco
- ❌ Não há função para listar documentos do aluno do banco

**Estrutura do banco necessária:**

- `documentos_aluno` - Documentos do aluno
  - `id`, `aluno_id`, `document_type_id`, `status`, `observacoes`, `updated_at`
- `tipos_documento` - Tipos de documentos (RG, CPF, etc.)

**Próximos passos:**

1. Criar função `listMyDocuments()` em `app/_lib/actions/documents.ts` que:
   - Busca documentos do aluno logado na tabela `documentos_aluno`
   - Junta com `tipos_documento` para obter título do documento
   - Retorna lista com status, observações, etc.
2. Atualizar página `/aluno/documentos` para usar dados reais
3. Garantir que aluno não pode alterar status (somente visualização)

---

### US-ALU-04 — Visualizar meu financeiro

**Status:** ⚠️ Parcial - Interface existe mas usando mockdata

**O que já existe:**

- ✅ Página `/aluno/financeiro` em `app/(app)/aluno/financeiro/page.tsx`
- ✅ Componente `FinanceiroAlunoView` que mostra mensalidades
- ✅ Mostra status (pago/pendente), valor, forma de pagamento, data
- ✅ Validação de permissão (aluno só vê seu próprio financeiro)

**O que falta:**

- ❌ Usa mockdata (`getStudentInstallments` de `app/_lib/mockdata/finance.mock.ts`)
- ❌ Não está conectado à tabela `mensalidades` e `pagamentos` do banco
- ❌ Existe `listMensalidadesForRecepcao()` mas é apenas para recepção/admin
- ❌ Não há função para aluno listar suas próprias mensalidades

**Estrutura do banco necessária:**

- `mensalidades` - Mensalidades do aluno
  - `id`, `aluno_id`, `competence_year`, `competence_month`, `status`, `valor_mensalidade`, `valor_pago`, `data_vencimento`, `data_pagamento`
- `pagamentos` - Pagamentos registrados
  - `id`, `mensalidade_id`, `valor_pago`, `forma_pagamento`, `data_pagamento`

**Próximos passos:**

1. Criar função `listMyMensalidades()` em `app/_lib/actions/mensalidades.ts` que:
   - Busca mensalidades do aluno logado
   - Junta com `pagamentos` para obter forma de pagamento
   - Retorna lista ordenada por competência (ano/mês)
2. Atualizar componente `FinanceiroAlunoView` para usar dados reais
3. Garantir que aluno não pode alterar nada (somente visualização)

---

### US-ALU-05 — Visualizar minhas etiquetas

**Status:** ✅ Implementado e conectado ao banco

**O que já existe:**

- ✅ Componente `EtiquetasView` em `app/_components/aluno/EtiquetasView.tsx`
- ✅ Funções em `app/_lib/actions/etiquetas.ts`:
  - `listEtiquetasDoAluno()` - Lista etiquetas do aluno (conectado ao banco)
  - `listEtiquetas()` - Lista todas as etiquetas disponíveis
- ✅ Conectado às tabelas `etiquetas` e `aluno_etiquetas` do banco
- ✅ Suporte a visualização somente leitura (quando `canEdit={false}`)

**O que falta:**

- ⚠️ Componente não está sendo usado na página principal do aluno
- ⚠️ Não há rota específica para visualizar etiquetas (pode ser adicionado na página de perfil)

**Estrutura do banco utilizada:**

- ✅ `etiquetas` - Etiquetas disponíveis
- ✅ `aluno_etiquetas` - Vínculo aluno-etiqueta

**Próximos passos:**

1. Adicionar componente `EtiquetasView` na página principal do aluno ou na página de perfil
2. Garantir que `canEdit={false}` para aluno (somente visualização)

---

## 📋 Estrutura do Banco de Dados Necessária

### Tabelas que já existem e estão sendo usadas:

1. **profiles** - Usuários do sistema
   - `user_id` (PK, FK → auth.users)
   - `name`, `email`, `telefone`
   - `role` (aluno|professor|coordenação|recepção|administrativo)

2. **alunos** - Dados específicos do aluno
   - `user_id` (PK, FK → profiles)
   - `age`, `date_of_birth`

3. **turma_alunos** - Vínculo aluno-turma
   - `turma_id` (FK → turmas)
   - `aluno_id` (FK → profiles)

4. **turmas** - Turmas
   - `id` (PK)
   - `disciplina_id` (FK → disciplinas)
   - `professor_id` (FK → profiles)

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

7. **mensalidades** - Mensalidades dos alunos
   - `id` (PK)
   - `aluno_id` (FK → profiles)
   - `competence_year`, `competence_month`
   - `status` (pendente|pago)
   - `valor_mensalidade`, `valor_pago`
   - `data_vencimento`, `data_pagamento`

8. **pagamentos** - Pagamentos registrados
   - `id` (PK)
   - `mensalidade_id` (FK → mensalidades)
   - `valor_pago`
   - `forma_pagamento` (dinheiro|pix|debito|credito)
   - `data_pagamento`

9. **etiquetas** - Etiquetas disponíveis
   - `id` (PK)
   - `name`, `color`

10. **aluno_etiquetas** - Vínculo aluno-etiqueta
    - `aluno_id` (FK → profiles)
    - `etiqueta_id` (FK → etiquetas)

### Tabelas que precisam ser verificadas/criadas:

11. **documentos_aluno** - Documentos do aluno
    - `id` (PK)
    - `aluno_id` (FK → profiles)
    - `document_type_id` (FK → tipos_documento)
    - `status` (pending|delivered|rejected)
    - `observacoes` (texto com motivo de rejeição)
    - `updated_at`

12. **tipos_documento** - Tipos de documentos
    - `id` (PK)
    - `name` (ex: "RG", "CPF", "Histórico Escolar")

---

## 🚀 Plano de Implementação

### Fase 1: Conectar Perfil ao Banco (US-ALU-01)

1. Criar função `getMyProfile()` em `app/_lib/actions/alunos.ts`
2. Criar/atualizar página `/aluno/perfil` ou adicionar seção na página principal
3. Conectar componente `PerfilAluno.tsx` aos dados reais

### Fase 2: Conectar Notas ao Banco (US-ALU-02)

1. Criar função `listMyNotas()` em `app/_lib/actions/notas.ts`
2. Implementar cálculo de média seguindo regra: `IF REC > média(A1,A2,A3) THEN REC ELSE média(A1,A2,A3)`
3. Atualizar página `/aluno/notas` para usar dados reais
4. Adicionar cálculo de status (aprovado/reprovado)

### Fase 3: Conectar Documentos ao Banco (US-ALU-03)

1. Verificar se tabelas `documentos_aluno` e `tipos_documento` existem
2. Criar função `listMyDocuments()` em `app/_lib/actions/documents.ts`
3. Atualizar página `/aluno/documentos` para usar dados reais

### Fase 4: Conectar Financeiro ao Banco (US-ALU-04)

1. Criar função `listMyMensalidades()` em `app/_lib/actions/mensalidades.ts`
2. Atualizar componente `FinanceiroAlunoView` para usar dados reais

### Fase 5: Integrar Etiquetas (US-ALU-05)

1. Adicionar componente `EtiquetasView` na página principal do aluno ou perfil
2. Garantir `canEdit={false}` para aluno

---

## 🔒 Permissões e Segurança

### Aluno pode:

- ✅ Visualizar seu próprio perfil
- ✅ Visualizar suas próprias notas
- ✅ Visualizar seus próprios documentos
- ✅ Visualizar seu próprio financeiro
- ✅ Visualizar suas próprias etiquetas

### Aluno NÃO pode:

- ❌ Alterar dados do perfil (apenas visualização)
- ❌ Alterar notas (apenas visualização)
- ❌ Alterar status de documentos (apenas visualização)
- ❌ Alterar mensalidades/pagamentos (apenas visualização)
- ❌ Atribuir/remover etiquetas (apenas visualização)

**Importante:** Todas as funções devem validar que o `user_id` do aluno logado corresponde ao `aluno_id` dos dados solicitados.

---

## 📝 Notas Técnicas

1. **Validação de permissões:** Todas as funções devem verificar se o usuário logado é um aluno e se está acessando apenas seus próprios dados.

2. **Cálculo de média:** A regra de cálculo de média deve ser:

   ```
   media_parcial = (A1 + A2 + A3) / 3
   media_final = IF REC > media_parcial THEN REC ELSE media_parcial
   ```

3. **Mockdata:** Remover todas as referências a mockdata após conectar ao banco.

4. **Performance:** Considerar cache ou otimização de queries quando necessário (especialmente para notas e mensalidades).

---

## ✅ Status Final

**Resumo:**

- ✅ **US-ALU-05** - Totalmente implementado e conectado ao banco
- ⚠️ **US-ALU-01 a US-ALU-04** - Interfaces existem mas precisam ser conectadas ao banco de dados

**Próximo passo:** Implementar as funções de busca no banco e atualizar as páginas para usar dados reais ao invés de mockdata.
