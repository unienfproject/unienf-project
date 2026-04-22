import { expect, test } from "@playwright/test";
import { expectNotRecepcaoExclusiveWall } from "../helpers/nav";
import { expectMainVisible } from "../helpers/page-assertions";

test.describe("Aluno — páginas e CTAs (leitura)", () => {
  test("dashboard: saudação e atalho Ver todas (notas)", async ({ page }) => {
    await page.goto("/aluno", { waitUntil: "load" });
    await expectNotRecepcaoExclusiveWall(page);
    await expectMainVisible(page);
    await expect(page.getByRole("heading", { name: /Olá,/ })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Ver todas/i }).first(),
    ).toBeVisible();
  });

  test("documentos: título e possíveis ações de envio", async ({ page }) => {
    await page.goto("/aluno/documentos", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(
      page.getByRole("heading", { name: /Progresso da documenta/i }),
    ).toBeVisible();
    const send = page.getByRole("button", {
      name: /Enviar (Documento|Novamente)/,
    });
    if ((await send.count()) > 0) {
      await expect(send.first()).toBeVisible();
    }
  });

  test("notas e financeiro carregam", async ({ page }) => {
    await page.goto("/aluno/notas", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(
      page.getByRole("heading", { name: /Minhas Notas/i }),
    ).toBeVisible();

    await page.goto("/aluno/financeiro", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(
      page.getByRole("heading", { name: /Financeiro/i }),
    ).toBeVisible();
  });

  test("avisos", async ({ page }) => {
    await page.goto("/aluno/avisos", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(page.getByRole("heading", { name: /Avisos/i })).toBeVisible();
  });

  test("perfil: área principal", async ({ page }) => {
    await page.goto("/perfil", { waitUntil: "load" });
    await expectMainVisible(page);
    const edit = page.getByRole("button", { name: /^Editar$/i });
    if ((await edit.count()) > 0) {
      await expect(edit.first()).toBeVisible();
    }
  });
});
