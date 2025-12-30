# Scripts de Banco de Dados

Esta pasta contém scripts SQL para configuração e manutenção do banco de dados.

## 📁 Estrutura

```
database/
├── README.md                    # Este arquivo
├── functions/                   # Funções SQL (RPC)
│   └── get_public_tables.sql   # Função para listar tabelas
└── tables/                      # Criação de tabelas
    └── audit_logs.sql          # Tabela de auditoria
```

## 🚀 Como Usar

### Opção 1: Executar no Supabase SQL Editor (Recomendado)

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Copie e cole o conteúdo do arquivo SQL
4. Execute o script

### Opção 2: Via CLI do Supabase (se configurado)

```bash
supabase db execute -f database/tables/audit_logs.sql
```

## 📋 Scripts Disponíveis

### Funções SQL

#### `functions/get_public_tables.sql`

- **O que faz:** Cria função RPC para listar todas as tabelas do schema public
- **Quando executar:** Uma vez, para habilitar listagem dinâmica na página `/admin/schema`
- **Dependências:** Nenhuma

### Tabelas

#### `tables/audit_logs.sql`

- **O que faz:** Cria tabela de auditoria para rastrear alterações no sistema
- **Quando executar:** Uma vez, para habilitar sistema de auditoria
- **Dependências:** Tabela `profiles` deve existir
- **RLS:** Habilitado (apenas administrativo pode ver logs)

## ⚠️ Importante

- **Sempre execute os scripts na ordem correta** (tabelas antes de funções que as usam)
- **Faça backup** antes de executar scripts em produção
- **Teste primeiro** em ambiente de desenvolvimento
- **Mantenha os scripts atualizados** se fizer alterações diretas no Supabase

## 📝 Convenções

- Use `IF NOT EXISTS` para evitar erros em re-execução
- Sempre adicione comentários explicativos
- Documente dependências entre scripts
- Mantenha scripts idempotentes (podem ser executados múltiplas vezes)

## 🔄 Atualização

Se você modificar o schema diretamente no Supabase:

1. Atualize o script SQL correspondente aqui
2. Ou crie um novo script de migração
3. Documente as mudanças no commit
