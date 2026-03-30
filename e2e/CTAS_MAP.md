# Mapa de páginas e CTAs por role (E2E)

Referência para os specs por role: `e2e/<role>/pages-ctas.spec.ts` (headings e CTAs) e `e2e/<role>/dialogs.spec.ts` onde existir (abrir modal e cancelar, sem persistência). Atualize quando a UI mudar.

## Global (layout `app/(app)`)

| Área | Rota / elemento | CTAs |
|------|-------------------|------|
| Sidebar footer | `NavUser` | **Conta** (dialog), **Log Out** |
| Header | `DashboardHeader` | **Abrir menu** |
| Perfil | `/perfil` | conforme role (`PerfilAluno` etc.) |

---

## `aluno`

| Rota | Heading / texto chave | CTAs principais |
|------|------------------------|-----------------|
| `/aluno` | `Olá,` (nome) | Links **Ver todas** (notas), cards |
| `/aluno/documentos` | Meus Documentos | **Enviar Documento** / **Enviar Novamente** (por card) |
| `/aluno/notas` | Minhas Notas | tabela (leitura) |
| `/aluno/financeiro` | Financeiro | leitura |
| `/aluno/avisos` | Avisos | leitura |
| `/perfil` | perfil | **Editar** (quando aplicável) |
| `/aluno/[studendId]/documents` | dinâmica | só se houver link na app |

---

## `professor`

| Rota | Heading / texto chave | CTAs principais |
|------|------------------------|-----------------|
| `/professores` | dashboard | KPIs |
| `/professores/turmas` | Minhas Turmas | **Buscar**, **Nova Turma** |
| `/professores/turmas/[id]` | detalhe turma | links/alunos |
| `/professores/disciplinas` | Nova Disciplina | **Criar disciplina** (`DisciplinaForm`) |
| `/professores/notas` | Lançar Notas | seletores turma/avaliação |
| `/professores/avisos` | (lista) | **Criar aviso**, **Buscar**, filtro |
| `/professores/alunos` | Meus Alunos | links para `/professores/alunos/[id]` (satélite) |
| `/professores/alunos/[id]` | ficha | leitura limitada |

---

## `recepção`

| Rota | Heading | CTAs principais |
|------|---------|-----------------|
| `/recepcao` | Recepção | KPIs |
| `/recepcao/alunos` | Alunos | lista → ficha |
| `/recepcao/alunos/[id]` | nome aluno | **Editar**, **Salvar**, **Registrar Pagamento** |
| `/recepcao/documentos` | Documentos | **Salvar Observação** (contexto) |
| `/recepcao/alunos/[id]/documentos` | Documentos | idem |
| `/recepcao/precos` | Valores por Turma | **Salvar Valor da Turma** |
| `/recepcao/financeiro` | Financeiro | **Buscar aluno**, **Registrar** |
| `/recepcao/avisos` | Avisos | leitura |

---

## `administrativo`

| Rota | Heading | CTAs principais |
|------|---------|-----------------|
| `/admin` | dashboard admin | filtros data, gráficos |
| `/admin/alunos` | Alunos | **Nova Matrícula**, **Buscar**, **Editar** |
| `/admin/alunos/[id]` | ficha | ações |
| `/admin/alunos/[id]/documentos` | documentos | gestão |
| `/admin/professores` | (lista) | **Novo Professor/Instrutor** |
| `/admin/professores/[id]` | ficha | menu ações |
| `/admin/disciplinas` | Conteúdos | **Novo Conteúdo** |
| `/admin/users` | usuários | **Novo Usuário**, **Buscar** |
| `/admin/turmas` | (UI mista: título “Disciplinas Cadastradas”) | botão **Nova Disciplina** abre dialog **Nova Turma** |
| `/admin/cursos` | Cursos | **Novo Curso** |
| `/admin/precos` | Valores por Turma | **Salvar Valor da Turma** |
| `/admin/financeiro` | Financeiro | **Novo custo interno** |
| `/admin/avisos` | Avisos e Comunicados | **Novo Aviso** |
| `/admin/schema` | Schema do Banco de Dados | satélite (sem menu) |

---

## `coordenação`

Mesmas rotas de menu que `coordenacaoMenuItems` em `SideBar.tsx` (sem **Usuários** e **Valores** no menu). CTAs iguais ao admin nas páginas compartilhadas; permissões reais dependem de server actions / RLS.

---

## Testes de diálogo (sem persistência)

- **Administrativo:** [`administrativo/dialogs.spec.ts`](./administrativo/dialogs.spec.ts)
- **Coordenação:** [`coordenacao/dialogs.spec.ts`](./coordenacao/dialogs.spec.ts)
- **Professor:** [`professor/dialogs.spec.ts`](./professor/dialogs.spec.ts)
- **Aluno:** [`aluno/dialogs.spec.ts`](./aluno/dialogs.spec.ts) (perfil, se houver **Editar**)
- **Recepção:** CTAs em página cheia (ex.: **Salvar Valor da Turma**); ver [`recepcao/pages-ctas.spec.ts`](./recepcao/pages-ctas.spec.ts).

Para fluxos que **criam** registros de verdade no banco, use ambiente isolado e dados descartáveis (futuro `E2E_ENABLE_WRITE` ou projeto dedicado).
