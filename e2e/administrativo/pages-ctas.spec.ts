import { expect, test } from "@playwright/test";
import { expectMainVisible } from "../helpers/page-assertions";
import { openFirstTableVerPerfil } from "../helpers/detail-links";

test.describe("Administrativo — páginas e CTAs (leitura)", () => {
  test("visão geral", async ({ page }) => {
    await page.goto("/admin", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(
      page.getByRole("heading", { name: "Visão Geral" }),
    ).toBeVisible();
  });

  test("alunos: lista e cadastro", async ({ page }) => {
    await page.goto("/admin/alunos", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(page.getByRole("heading", { name: "Alunos" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Nova Matrícula" }),
    ).toBeVisible();
  });

  test("detalhe aluno e documentos quando houver link", async ({ page }) => {
    await page.goto("/admin/alunos", { waitUntil: "load" });
    const ok = await openFirstTableVerPerfil(page);
    if (!ok) {
      test.skip();
      return;
    }
    await expect(page).toHaveURL(/\/admin\/alunos\/[^/]+$/);
    await expect(page.getByRole("link").first()).toBeVisible({ timeout: 15_000 });
    const path =
      new URL(page.url()).pathname.replace(/\/$/, "") + "/documentos";
    await page.goto(path, { waitUntil: "load" });
    await expect(page).toHaveURL(/\/admin\/alunos\/[^/]+\/documentos$/);
  });

  test("professores", async ({ page }) => {
    await page.goto("/admin/professores", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(
      page.getByRole("button", { name: "Novo Professor/Instrutor" }),
    ).toBeVisible();
  });

  test("disciplinas (conteúdos)", async ({ page }) => {
    await page.goto("/admin/disciplinas", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(
      page.getByRole("heading", { name: "Conteúdos" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Novo Conteúdo" }),
    ).toBeVisible();
  });

  test("usuários", async ({ page }) => {
    await page.goto("/admin/users", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(
      page.getByRole("button", { name: "Novo Usuário" }),
    ).toBeVisible();
  });

  test("turmas", async ({ page }) => {
    await page.goto("/admin/turmas", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(
      page.getByRole("button", { name: "Nova Disciplina" }),
    ).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Turma" })).toBeVisible();
  });

  test("cursos", async ({ page }) => {
    await page.goto("/admin/cursos", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(page.getByRole("heading", { name: "Cursos" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Novo Curso" })).toBeVisible();
  });

  test("financeiro", async ({ page }) => {
    await page.goto("/admin/financeiro", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(
      page.getByRole("heading", { name: "Financeiro", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Lançar custo" }),
    ).toBeVisible();
  });

  test("avisos", async ({ page }) => {
    await page.goto("/admin/avisos", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(
      page.getByRole("heading", { name: "Avisos e Comunicados" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Novo Aviso" }),
    ).toBeVisible();
  });

  test("schema (satélite)", async ({ page }) => {
    await page.goto("/admin/schema", { waitUntil: "load" });
    await expect(
      page.getByRole("heading", { name: "Schema do Banco de Dados" }),
    ).toBeVisible();
  });

  test("detalhe professor quando houver link", async ({ page }) => {
    await page.goto("/admin/professores", { waitUntil: "load" });
    const ok = await openFirstTableVerPerfil(page);
    if (!ok) {
      test.skip();
      return;
    }
    await expect(page).toHaveURL(/\/admin\/professores\/[^/]+$/);
  });
});
