import { test } from "@playwright/test";
import {
  clickSidebarLink,
  expectNotRecepcaoExclusiveWall,
  expectPath,
} from "../helpers/nav";

const MENU: [string, RegExp][] = [
  ["Visão Geral", /\/recepcao$/],
  ["Alunos", /\/recepcao\/alunos/],
  ["Documentos", /\/recepcao\/documentos/],
  ["Valores", /\/recepcao\/precos/],
  ["Financeiro", /\/recepcao\/financeiro/],
  ["Avisos", /\/recepcao\/avisos/],
];

test.describe("Recepção — smoke", () => {
  test("menu lateral: rotas principais carregam", async ({ page }) => {
    await page.goto("/recepcao", { waitUntil: "domcontentloaded" });
    await expectNotRecepcaoExclusiveWall(page);

    for (const [label, urlPattern] of MENU) {
      await clickSidebarLink(page, label);
      await expectPath(page, urlPattern);
      await expectNotRecepcaoExclusiveWall(page);
    }
  });
});
