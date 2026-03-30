import { expect, test } from "@playwright/test";

test.describe("Administrativo — modais (abrir e cancelar, sem gravar)", () => {
  test("Nova Matrícula", async ({ page }) => {
    await page.goto("/admin/alunos", { waitUntil: "load" });
    await page.getByRole("button", { name: "Nova Matrícula" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Nova Matrícula" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Cancelar" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0, { timeout: 10_000 });
  });

  test("Novo Usuário", async ({ page }) => {
    await page.goto("/admin/users", { waitUntil: "load" });
    await page.getByRole("button", { name: "Novo Usuário" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Novo Usuário" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Cancelar" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0, { timeout: 10_000 });
  });

  test("Novo Aviso", async ({ page }) => {
    await page.goto("/admin/avisos", { waitUntil: "load" });
    await page.getByRole("button", { name: "Novo Aviso" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Novo Aviso" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Cancelar" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0, { timeout: 10_000 });
  });

  test("Novo Professor/Instrutor", async ({ page }) => {
    await page.goto("/admin/professores", { waitUntil: "load" });
    await page.getByRole("button", { name: "Novo Professor/Instrutor" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Novo Professor\/Instrutor/i }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Cancelar" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0, { timeout: 10_000 });
  });

  test("Nova Turma (botão Nova Disciplina na lista de turmas)", async ({
    page,
  }) => {
    await page.goto("/admin/turmas", { waitUntil: "load" });
    await page.getByRole("button", { name: "Nova Disciplina" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Nova Turma" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Cancelar" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0, { timeout: 10_000 });
  });

  test("Novo Curso (fechar com Escape — sem botão Cancelar)", async ({
    page,
  }) => {
    await page.goto("/admin/cursos", { waitUntil: "load" });
    await page.getByRole("button", { name: "Novo Curso" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Novo Curso" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0, { timeout: 10_000 });
  });

  test("Novo Conteúdo em disciplinas (Escape)", async ({ page }) => {
    await page.goto("/admin/disciplinas", { waitUntil: "load" });
    await page.getByRole("button", { name: "Novo Conteúdo" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Novo conteúdo/i }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0, { timeout: 10_000 });
  });
});
