import { test } from "@playwright/test";
import {
  clickSidebarLink,
  expectNotRecepcaoExclusiveWall,
  expectPath,
} from "../helpers/nav";

const MENU: [string, RegExp][] = [
  ["Visão Geral", /\/aluno$/],
  ["Meus Documentos", /\/aluno\/documentos/],
  ["Minhas Notas", /\/aluno\/notas/],
  ["Financeiro", /\/aluno\/financeiro/],
  ["Avisos", /\/aluno\/avisos/],
];

test.describe("Aluno — smoke", () => {
  test("menu lateral: rotas principais carregam", async ({ page }) => {
    await page.goto("/aluno", { waitUntil: "domcontentloaded" });
    await expectNotRecepcaoExclusiveWall(page);

    for (const [label, urlPattern] of MENU) {
      await clickSidebarLink(page, label);
      await expectPath(page, urlPattern);
      await expectNotRecepcaoExclusiveWall(page);
    }
  });

  test("perfil acessível", async ({ page }) => {
    await page.goto("/perfil", { waitUntil: "domcontentloaded" });
    await expectPath(page, /\/perfil/);
    await expectNotRecepcaoExclusiveWall(page);
  });
});
