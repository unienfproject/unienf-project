import { expect, test } from "@playwright/test";

test.describe("Professor — modais (abrir e fechar, sem gravar)", () => {
  test("Nova Turma", async ({ page }) => {
    await page.goto("/professores/turmas", { waitUntil: "load" });
    await page.getByRole("button", { name: "Nova Turma" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Nova Turma" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Cancelar" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0, { timeout: 10_000 });
  });

  test("Criar aviso (overlay custom — Fechar)", async ({ page }) => {
    await page.goto("/professores/avisos", { waitUntil: "load" });
    await page.getByRole("button", { name: /Criar aviso/i }).first().click();
    const blurb = page.getByText(
      /Envie para uma turma inteira ou selecione alunos manualmente/i,
    );
    await expect(blurb).toBeVisible({ timeout: 15_000 });
    await page.getByRole("button", { name: "Fechar" }).click();
    await expect(blurb).toHaveCount(0, { timeout: 8000 });
  });
});
