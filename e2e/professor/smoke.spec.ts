import { test } from "@playwright/test";
import {
  clickSidebarLink,
  expectNotRecepcaoExclusiveWall,
  expectPath,
} from "../helpers/nav";

const MENU: [string, RegExp][] = [
  ["Visão Geral", /\/professores$/],
  ["Minhas Turmas", /\/professores\/turmas/],
  ["Disciplinas", /\/professores\/disciplinas/],
  ["Lançar Notas", /\/professores\/notas/],
  ["Avisos", /\/professores\/avisos/],
];

test.describe("Professor — smoke", () => {
  test("menu lateral: rotas principais carregam", async ({ page }) => {
    await page.goto("/professores", { waitUntil: "domcontentloaded" });
    await expectNotRecepcaoExclusiveWall(page);

    for (const [label, urlPattern] of MENU) {
      await clickSidebarLink(page, label);
      await expectPath(page, urlPattern);
      await expectNotRecepcaoExclusiveWall(page);
    }
  });
});
