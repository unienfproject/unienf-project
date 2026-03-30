import { expect, test } from "@playwright/test";
import { expectMainVisible } from "../helpers/page-assertions";
import { followFirstHref } from "../helpers/detail-links";

test.describe("Recepção — páginas e CTAs (leitura)", () => {
  test("visão geral", async ({ page }) => {
    await page.goto("/recepcao", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(
      page.getByRole("heading", { name: "Recepção" }),
    ).toBeVisible();
  });

  test("alunos e ficha quando houver link", async ({ page }) => {
    await page.goto("/recepcao/alunos", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(page.getByRole("heading", { name: "Alunos" })).toBeVisible();

    const ok = await followFirstHref(page, "/recepcao/alunos/");
    if (!ok) {
      test.skip();
      return;
    }
    await expect(page).toHaveURL(/\/recepcao\/alunos\/[^/]+$/);
    await expect(
      page.getByRole("link", { name: /Registrar Pagamento/i }),
    ).toBeVisible({ timeout: 25_000 });
  });

  test("documentos", async ({ page }) => {
    await page.goto("/recepcao/documentos", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(
      page.getByRole("heading", { name: "Documentos" }),
    ).toBeVisible();
  });

  test("valores por turma", async ({ page }) => {
    await page.goto("/recepcao/precos", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(
      page.getByRole("heading", { name: "Valores por Turma" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Salvar Valor da Turma/i }),
    ).toBeVisible();
  });

  test("financeiro", async ({ page }) => {
    await page.goto("/recepcao/financeiro", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(
      page.getByRole("heading", { name: "Financeiro" }),
    ).toBeVisible();
  });

  test("avisos", async ({ page }) => {
    await page.goto("/recepcao/avisos", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(page.getByRole("heading", { name: "Avisos" })).toBeVisible();
  });

  test("documentos do aluno (subrota)", async ({ page }) => {
    await page.goto("/recepcao/alunos", { waitUntil: "load" });
    const ok = await followFirstHref(page, "/recepcao/alunos/");
    if (!ok) {
      test.skip();
      return;
    }
    const path = new URL(page.url()).pathname.replace(/\/$/, "") + "/documentos";
    await page.goto(path, { waitUntil: "load" });
    await expect(page).toHaveURL(/\/recepcao\/alunos\/[^/]+\/documentos$/);
    await expectMainVisible(page);
  });
});
