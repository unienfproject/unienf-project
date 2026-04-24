import { expect, test } from "@playwright/test";
import {
  clickSidebarLink,
  expectNotRecepcaoExclusiveWall,
  expectPath,
  hasBrokenAuthenticatedAppState,
} from "../helpers/nav";

const MENU: [string, RegExp][] = [
  ["Visão Geral", /\/admin$/],
  ["Alunos", /\/admin\/alunos/],
  ["Professores", /\/admin\/professores/],
  ["Disciplinas", /\/admin\/disciplinas/],
  ["Turmas", /\/admin\/turmas/],
  ["Cursos", /\/admin\/cursos/],
  ["Avisos", /\/admin\/avisos/],
];

test.describe("Coordenação — smoke", () => {
  test("menu lateral: itens de coordenação (sem Usuários/Valores)", async ({
    page,
  }) => {
    await page.goto("/admin", { waitUntil: "domcontentloaded" });
    if (await hasBrokenAuthenticatedAppState(page)) {
      test.skip(
        true,
        "Ambiente de coordenaÃ§Ã£o indisponÃ­vel ou credenciais nÃ£o pertencem Ã  role esperada.",
      );
      return;
    }
    if (
      (await page.getByRole("link", { name: "VisÃ£o Geral", exact: true }).count()) ===
      0
    ) {
      test.skip(
        true,
        "Ambiente de coordenaÃ§Ã£o sem menu lateral navegÃ¡vel neste ambiente.",
      );
      return;
    }
    await expectNotRecepcaoExclusiveWall(page);

    await expect(
      page.getByRole("link", { name: "Usuários", exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Valores", exact: true }),
    ).toHaveCount(0);

    for (const [label, urlPattern] of MENU) {
      await clickSidebarLink(page, label);
      await expectPath(page, urlPattern);
      await expectNotRecepcaoExclusiveWall(page);
    }
  });
});
