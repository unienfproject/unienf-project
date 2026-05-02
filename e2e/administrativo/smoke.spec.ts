import { test } from "@playwright/test";
import {
  clickSidebarLink,
  expectNotRecepcaoExclusiveWall,
  expectPath,
} from "../helpers/nav";

const MENU: [string, RegExp][] = [
  ["Visão Geral", /\/admin$/],
  ["Alunos", /\/admin\/alunos/],
  ["Professores", /\/admin\/professores/],
  ["Disciplinas", /\/admin\/disciplinas/],
  ["Usuários", /\/admin\/users/],
  ["Turmas", /\/admin\/turmas/],
  ["Cursos", /\/admin\/cursos/],
  ["Financeiro", /\/admin\/financeiro/],
  ["Avisos", /\/admin\/avisos/],
];

test.describe("Administrativo — smoke", () => {
  test("menu lateral: rotas principais carregam", async ({ page }) => {
    await page.goto("/admin", { waitUntil: "domcontentloaded" });
    await expectNotRecepcaoExclusiveWall(page);

    for (const [label, urlPattern] of MENU) {
      await clickSidebarLink(page, label);
      await expectPath(page, urlPattern);
      await expectNotRecepcaoExclusiveWall(page);
    }
  });
});
