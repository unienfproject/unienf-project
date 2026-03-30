This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Testes E2E (Playwright)

### Configuração

1. Copie [`.env.e2e.example`](.env.e2e.example) para `.env.e2e` na raiz do projeto.
2. Preencha **obrigatoriamente** os pares e-mail/senha para as roles `aluno`, `professor`, `recepção` e `administrativo`. A role **coordenação** é opcional (veja o exemplo).
3. Se faltar qualquer credencial obrigatória, a execução **falha ao carregar a configuração do Playwright** (antes de subir o `webServer`) — não há skip silencioso para essas roles. O comando `playwright test --list` não exige credenciais.

O inventário de rotas e CTAs por role está em [`e2e/CTAS_MAP.md`](e2e/CTAS_MAP.md), alinhado aos specs `e2e/*/pages-ctas.spec.ts` e `e2e/*/dialogs.spec.ts`.

### Comandos

| Comando | Uso |
|--------|-----|
| `npm run test:e2e` | Suíte completa (headless). |
| `npm run test:e2e:ui` | [UI mode](https://playwright.dev/docs/test-ui-mode) — exploração e depuração interativa. |
| `npm run test:e2e:headed` | Navegador visível, sem UI mode. |

### Local vs CI (servidor Next)

- **Local (padrão):** o Playwright sobe `npm run dev` via `webServer` (rápido para iterar).
- **CI / validação próxima de produção:** defina a variável de ambiente `CI=true` (por exemplo no GitHub Actions ela já vem definida). Nesse caso o `webServer` usa `npm run build && npm run start`, alinhado à recomendação do Next para testar o comportamento de build de produção.

Exemplo local no PowerShell:

```powershell
$env:CI = "true"; npm run test:e2e
```

### UI mode e projeto de autenticação (`setup`)

Os projetos por role dependem do projeto **`setup`**, que grava sessões em `.auth/*.json`. No UI mode, a [documentação do Playwright](https://playwright.dev/docs/test-projects#dependencies) orienta a garantir que o fluxo de autenticação rode antes dos testes que consomem `storageState`.

Na prática:

- Ao **rodar a suíte inteira**, as dependências entre projetos fazem o `setup` executar primeiro.
- Se você **filtrar só um projeto** (por exemplo só `aluno`) sem ter rodado o `setup` antes, os arquivos em `.auth/` podem não existir ou estar desatualizados. Nesse caso, execute antes o projeto **setup** (ou rode todos os testes uma vez).

### Inspecionar falhas (relatório e trace)

- **Relatório HTML** (gerado após execuções com reporter HTML, padrão fora de CI):

  ```bash
  npx playwright show-report
  ```

  Abre o último relatório em `playwright-report/` com falhas, screenshots e links para traces quando configurados.

- **Trace:** em `playwright.config.ts` está `trace: "on-first-retry"` — em testes que falham e são repetidos (por exemplo em CI com retries), o trace ajuda a ver rede, DOM e timeline. Para abrir um arquivo `trace.zip` manualmente:

  ```bash
  npx playwright show-trace caminho/para/trace.zip
  ```

- **UI mode** também permite reexecutar testes falhos e inspecionar passo a passo; use `npm run test:e2e:ui` quando precisar depurar fluxos longos ou intermitentes.

Documentação oficial: [Playwright — Run tests](https://playwright.dev/docs/running-tests), [Trace viewer](https://playwright.dev/docs/trace-viewer).
