import * as fs from "node:fs";
import * as path from "node:path";
import { test as setup, expect } from "@playwright/test";

const authDir = path.join(process.cwd(), ".auth");

setup.beforeAll(() => {
  fs.mkdirSync(authDir, { recursive: true });
});

async function authenticate(
  page: import("@playwright/test").Page,
  email: string,
  password: string,
  expectedPathPrefix: string,
  storageFile: string,
) {
  await page.goto("/login", { waitUntil: "load" });
  const submit = page.getByRole("button", { name: /Entrar/i });
  await submit.waitFor({ state: "visible" });
  await expect(submit).toBeEnabled();

  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha").fill(password);
  await submit.click();

  await expect(page).not.toHaveURL(/[?&]password=/);

  await page.waitForURL(
    (url) => url.pathname.startsWith(expectedPathPrefix),
    { timeout: 45_000, waitUntil: "commit" },
  );
  await expect(page.locator("body")).not.toContainText("Role não definida");
  await page.context().storageState({ path: path.join(authDir, storageFile) });
}

setup("authenticate aluno", async ({ page }) => {
  const email = process.env.E2E_ALUNO_EMAIL!.trim();
  const password = process.env.E2E_ALUNO_PASSWORD!;
  await authenticate(page, email, password, "/aluno", "aluno.json");
});

setup("authenticate professor", async ({ page }) => {
  const email = process.env.E2E_PROFESSOR_EMAIL!.trim();
  const password = process.env.E2E_PROFESSOR_PASSWORD!;
  await authenticate(page, email, password, "/professores", "professor.json");
});

setup("authenticate recepcao", async ({ page }) => {
  const email = process.env.E2E_RECEPCAO_EMAIL!.trim();
  const password = process.env.E2E_RECEPCAO_PASSWORD!;
  await authenticate(page, email, password, "/recepcao", "recepcao.json");
});

setup("authenticate administrativo", async ({ page }) => {
  const email = process.env.E2E_ADMINISTRATIVO_EMAIL!.trim();
  const password = process.env.E2E_ADMINISTRATIVO_PASSWORD!;
  await authenticate(page, email, password, "/admin", "administrativo.json");
});

setup("authenticate coordenacao", async ({ page }) => {
  const email = process.env.E2E_COORDENACAO_EMAIL?.trim();
  const password = process.env.E2E_COORDENACAO_PASSWORD;
  setup.skip(
    !email || !password,
    "Coordenação: defina E2E_COORDENACAO_* em .env.e2e para habilitar o projeto coordenacao",
  );
  await authenticate(page, email!, password!, "/admin", "coordenacao.json");
});
