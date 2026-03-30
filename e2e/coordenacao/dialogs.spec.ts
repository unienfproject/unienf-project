import { expect, test } from "@playwright/test";

test.describe("Coordenação — modais compartilhados com admin (cancelar)", () => {
  test("Nova Matrícula", async ({ page }) => {
    await page.goto("/admin/alunos", { waitUntil: "load" });
    await page.getByRole("button", { name: "Nova Matrícula" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Cancelar" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0, { timeout: 10_000 });
  });

  test("Novo Aviso", async ({ page }) => {
    await page.goto("/admin/avisos", { waitUntil: "load" });
    await page.getByRole("button", { name: "Novo Aviso" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Cancelar" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0, { timeout: 10_000 });
  });

  test("Nova Turma", async ({ page }) => {
    await page.goto("/admin/turmas", { waitUntil: "load" });
    await page.getByRole("button", { name: "Nova Disciplina" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Cancelar" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0, { timeout: 10_000 });
  });
});
