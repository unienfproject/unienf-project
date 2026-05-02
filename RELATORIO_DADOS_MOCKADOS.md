# Relatorio de Dados Mockados e Fallbacks

Data: 2026-05-02

Este documento consolida os pontos encontrados no codigo que ainda usam dados mockados, stubs vazios, conteudo estatico com cara de dado real ou fallbacks que podem esconder falhas de integracao com o banco.

## Resumo Executivo

Os pontos mais importantes estao no financeiro da recepcao, na home da recepcao, no dashboard do aluno e em componentes legados. O risco principal hoje e o sistema mostrar dados falsos ou vazios quando a consulta real falha.

Prioridade recomendada:

1. Remover o fallback mock de mensalidades em `app/_lib/actions/mensalidades.ts`.
2. Implementar `listNoticesReadOnly()` em `app/_lib/actions/recepcao.ts`.
3. Implementar ou remover stubs antigos em `app/_lib/actions/recepcao.ts`.
4. Corrigir o dashboard do aluno para usar as tabelas reais de documentos e avisos.
5. Implementar ou remover o bloco de movimentacoes gerais do financeiro.
6. Decidir se componentes legados como `PerfilAluno` e `FinanceiroRecepcaoView` devem ser removidos ou integrados.
7. Definir se a landing page deve continuar estatica ou puxar cursos do banco.

## Pontos Criticos

### 1. Financeiro da recepcao tem fallback mock de mensalidades

Arquivo: `app/_lib/actions/mensalidades.ts`

Locais:

- `listMensalidadesForRecepcao()`
- `buildMensalidadesMock()`

Situacao:

Quando a query real de `listMensalidadesForRecepcao()` falha, o codigo chama `buildMensalidadesMock()`.

Dados falsos encontrados:

- `Maria Silva`
- `Joao Pereira`
- `Ana Costa`
- valores de mensalidade como `450`
- competencias e vencimentos em 2025
- pagamentos com `pix` e `credito`

Impacto:

Se a consulta real falhar, a recepcao pode visualizar mensalidades falsas como se fossem dados reais. Este e o ponto de maior risco, porque envolve financeiro.

Recomendacao:

Remover `buildMensalidadesMock()` e trocar o fallback por:

- erro explicito, quando for uma falha inesperada; ou
- `[]`, apenas quando a ausencia de dados for esperada.

Tambem vale registrar o erro em log para facilitar diagnostico.

## Recepcao

### 2. Home da recepcao nao mostra avisos reais

Arquivo: `app/_lib/actions/recepcao.ts`

Funcao: `listNoticesReadOnly()`

Situacao:

A funcao valida sessao e permissao, cria o cliente Supabase, mas retorna sempre `[]`.

Impacto:

Na pagina `/recepcao`, o bloco "Avisos Recentes" fica sempre vazio, mesmo se houver avisos no banco.

Recomendacao:

Implementar a leitura real da tabela de avisos. O ideal e reaproveitar a action ja existente de avisos, se ela atender ao mesmo modelo de permissao, ou criar uma consulta especifica para recepcao.

### 3. Lista de mensalidades pendentes da recepcao e stub

Arquivo: `app/_lib/actions/recepcao.ts`

Funcao: `listPendingMensalidades()`

Situacao:

A funcao valida sessao/permissao, cria o cliente Supabase e retorna sempre `[]`.

Impacto:

Qualquer tela que venha a usar essa action vai mostrar zero mensalidades pendentes, mesmo com dados reais no banco.

Recomendacao:

Ou remover a funcao se nao estiver em uso, ou implementar usando a tabela `mensalidades` com filtro `status = 'pendente'`.

### 4. Acao antiga de marcar mensalidade como paga nao persiste nada

Arquivo: `app/_lib/actions/recepcao.ts`

Funcao: `markMensalidadeAsPaid()`

Situacao:

A funcao valida permissao e chama `revalidatePath()`, mas nao insere pagamento nem atualiza mensalidade.

Observacao importante:

Existe uma funcao real com o mesmo nome em `app/_lib/actions/mensalidades.ts`.

Impacto:

Risco de import errado. Se algum componente importar a action de `recepcao.ts`, o usuario pode clicar para pagar e nada sera persistido.

Recomendacao:

Remover essa funcao antiga ou transformar em wrapper que chama a action real de `mensalidades.ts`.

### 5. Criacao de aluno pela recepcao e stub

Arquivo: `app/_lib/actions/recepcao.ts`

Funcao: `createStudent()`

Situacao:

A funcao valida permissao, mas nao cria usuario, profile nem aluno. Apenas revalida a pagina.

Impacto:

Se conectada a algum formulario, passa a impressao de sucesso sem cadastrar no banco.

Recomendacao:

Remover se nao fizer parte do fluxo atual, ou implementar de verdade reaproveitando a logica de criacao de aluno do administrativo.

## Financeiro

### 6. Movimentacoes gerais do financeiro nao carregam dados

Arquivo: `app/_lib/actions/finance.ts`

Funcao: `getFinanceiroEntriesByMonth()`

Situacao:

Retorna sempre `[]`.

Tela relacionada:

`app/_components/finance/FinanceiroAdminView.tsx`, bloco "Movimentacoes gerais (financeiro)".

Impacto:

O bloco sempre mostra "Nenhuma movimentacao geral carregada".

Recomendacao:

Definir se esse bloco ainda e necessario. Se sim, criar ou apontar para uma tabela real de movimentacoes gerais. Se custos internos ja substituem esse fluxo, remover o bloco da interface.

### 7. `FinanceiroRecepcaoView` parece componente legado

Arquivo: `app/_components/finance/FinanceiroRecepcaoView.tsx`

Situacao:

O componente nao apareceu como importado por nenhuma rota na varredura. Ele busca mensalidades reais, mas ainda depende da action `listMensalidadesForRecepcao()`, que possui fallback mock.

Tambem tem texto de exemplo sobre recibo:

> "neste exemplo, voce pode implementar..."

Impacto:

Pode confundir manutencao futura. Se for reconectado, pode reintroduzir comportamento incompleto.

Recomendacao:

Se for legado, remover. Se ainda for necessario, atualizar para o mesmo padrao da rota atual de financeiro da recepcao.

## Aluno

### 8. `PerfilAluno` e praticamente todo mockado

Arquivo: `app/_components/aluno/PerfilAluno.tsx`

Situacao:

O componente contem dados fixos de aluno, documentos, advertencias e notas.

Dados fixos encontrados:

- `Maria Silva`
- matricula `2024001`
- email `maria.silva@email.com`
- telefone `(11) 98765-4321`
- data `15/03/1998`
- endereco fixo
- advertencia fixa
- documentos fixos como RG, CPF, Historico Escolar, Comprovante de Residencia, Certidao de Nascimento, Foto 3x4
- notas fixas de Anatomia Humana, Farmacologia, Enfermagem Clinica e Biosseguranca

Impacto:

Pelo rastreio, o componente nao parece estar sendo usado por rota atualmente. Mas, se for conectado, exibira dados falsos.

Recomendacao:

Remover se for legado. Se for necessario, refatorar para receber dados via action real de aluno, documentos, notas e frequencias.

### 9. Dashboard do aluno tem fallbacks zerados por tabelas possivelmente incorretas

Arquivo: `app/_lib/actions/alunos.ts`

Funcao: `getAlunoOverviewDashboard()`

Situacao:

A funcao busca dados reais, mas alguns trechos podem retornar vazio por divergencia de tabela/modelo:

- Documentos tenta ler `aluno_documentos`, enquanto o restante do sistema usa `documentos_aluno`.
- Se a tabela nao existir, retorna documentos zerados.
- Avisos recentes tentam filtros como `aluno_id` ou `turma_tag` diretamente em `avisos`.

Impacto:

O dashboard do aluno pode mostrar:

- `0` documentos entregues;
- `0` documentos pendentes;
- nenhum aviso recente;

mesmo existindo dados reais em outras tabelas.

Recomendacao:

Padronizar para:

- documentos: `documentos_aluno` + `documento_tipos`;
- avisos: usar o modelo real de `avisos`, `aviso_alunos`, `turma_alunos` e `turmas`.

## Documentos

### 10. Documentos criam itens virtuais quando ainda nao existe linha no banco

Arquivo: `app/_lib/actions/documents.ts`

Funcoes:

- `listMyDocuments()`
- `listStudentDocuments()`

Situacao:

Quando existe tipo de documento em `documento_tipos`, mas ainda nao existe registro em `documentos_aluno`, o codigo cria um item virtual com id `missing:<id>` e status `pending`.

Impacto:

Este comportamento pode ser correto para checklist, mas nem todo item exibido existe como linha no banco ate ser atualizado.

Recomendacao:

Manter se essa for a regra de negocio. Se a equipe quiser que todos os documentos existam fisicamente desde a criacao do aluno, criar os registros em `documentos_aluno` no cadastro/matricula.

## Admin / Schema

### 11. Pagina de schema usa lista manual quando RPC nao existe

Arquivo: `app/_lib/actions/admin/listTables.ts`

Funcao: `listPublicTables()`

Situacao:

Se a RPC `get_public_tables` nao existir no Supabase, a funcao retorna uma lista manual chamada `knownTables`.

Impacto:

A pagina de schema pode:

- mostrar tabelas que nao existem;
- nao mostrar tabelas novas;
- passar uma falsa sensacao de introspeccao dinamica.

Recomendacao:

Executar `database/functions/get_public_tables.sql` no Supabase ou remover o fallback manual.

## Site Publico

### 12. Cursos da landing page sao estaticos

Arquivo: `app/_components/home/Courses.tsx`

Situacao:

Os cursos exibidos na pagina publica estao em um array local `courses`.

Dados estaticos:

- titulo do curso;
- descricao;
- imagem;
- duracao;
- carga horaria;
- lista de diferenciais.

Impacto:

Alteracoes feitas no painel administrativo em `cursos` nao refletem automaticamente na landing page.

Recomendacao:

Se a landing page deve acompanhar o banco, criar campos publicos em `cursos` ou tabela complementar, por exemplo:

- `description`
- `image_url`
- `duration_label`
- `workload_label`
- `featured`
- `public_order`

Depois, trocar o array estatico por uma action de leitura.

### 13. Secao "Sobre" da landing page e estatica

Arquivo: `app/_components/home/About.tsx`

Situacao:

Diferenciais como "Laboratorios Modernos", "Professores Experientes", "Alta Taxa de Aprovacao" e "Estagio Garantido" estao hardcoded.

Impacto:

Provavelmente aceitavel para marketing institucional. So precisa virar banco se o administrativo precisar editar isso pelo painel.

Recomendacao:

Manter estatico se for conteudo institucional raro. Migrar para banco apenas se houver necessidade editorial.

## Fallbacks Defensivos Que Nao Sao Mock Visual

Estes pontos retornam `[]` quando uma tabela ainda nao existe ou quando o usuario nao tem registros. Nem sempre sao problema, mas podem esconder configuracao incompleta:

- `app/_lib/actions/observacoes-pedagogicas.ts`
- `app/_lib/actions/notices.ts`
- `app/_lib/actions/notas.ts`
- `app/_lib/actions/frequencias.ts`
- `app/_lib/actions/avisos.ts`
- `app/_lib/actions/etiquetas.ts`
- `app/_lib/actions/documents.ts`
- `app/_lib/actions/classes.ts`

Recomendacao geral:

Separar retornos vazios legitimos de falhas de schema:

- Se a tabela nao existe, registrar aviso claro no log ou mostrar mensagem administrativa.
- Se a tabela existe mas nao ha dados, retornar `[]`.

## Itens Ja Corrigidos Hoje

Estes pontos foram tratados durante a sessao:

- O botao "Lancar custo" deixou de ser mock e passou a persistir em `custos_internos`.
- A tela financeiro admin passou a listar custos reais por periodo.
- O filtro de periodo do financeiro passou a repassar `from` e `to`.
- O modal "Minha Conta" deixou de consultar `cpf` em `profiles` e passou a buscar dados do usuario logado.

## Checklist De Acao

- [ ] Remover `buildMensalidadesMock()` de `mensalidades.ts`.
- [ ] Implementar `listNoticesReadOnly()` em `recepcao.ts`.
- [ ] Remover ou implementar `listPendingMensalidades()` em `recepcao.ts`.
- [ ] Remover ou redirecionar `markMensalidadeAsPaid()` antigo de `recepcao.ts`.
- [ ] Remover ou implementar `createStudent()` em `recepcao.ts`.
- [ ] Implementar ou remover `getFinanceiroEntriesByMonth()`.
- [ ] Corrigir documentos do dashboard do aluno para `documentos_aluno`.
- [ ] Corrigir avisos recentes do dashboard do aluno para o modelo real de avisos.
- [ ] Decidir destino de `PerfilAluno.tsx`.
- [ ] Decidir destino de `FinanceiroRecepcaoView.tsx`.
- [ ] Executar ou remover fallback manual de `listPublicTables()`.
- [ ] Decidir se cursos da landing page devem vir do banco.

