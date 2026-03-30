import { expect, test } from "@playwright/test";
import { expectNotRecepcaoExclusiveWall } from "../helpers/nav";
import { expectMainVisible } from "../helpers/page-assertions";
import { followFirstHref } from "../helpers/detail-links";

test.describe("Professor — páginas e CTAs (leitura)", () => {
  test("dashboard", async ({ page }) => {
    await page.goto("/professores", { waitUntil: "load" });
    await expectNotRecepcaoExclusiveWall(page);
    await expectMainVisible(page);
  });

  test("turmas: busca e Nova Turma", async ({ page }) => {
    await page.goto("/professores/turmas", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(
      page.getByRole("heading", { name: "Minhas Turmas" }),
    ).toBeVisible();
    await expect(
      page.getByPlaceholder(/Digite nome ou etiqueta/i),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Nova Turma" }),
    ).toBeVisible();
  });

  test("disciplinas: formulário criar", async ({ page }) => {
    await page.goto("/professores/disciplinas", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(
      page.getByRole("heading", { name: "Nova Disciplina" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Criar disciplina/i }),
    ).toBeVisible();
  });

  test("notas: título", async ({ page }) => {
    await page.goto("/professores/notas", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(
      page.getByRole("heading", { name: "Lançar Notas" }),
    ).toBeVisible();
  });

  test("avisos: criar e filtros", async ({ page }) => {
    await page.goto("/professores/avisos", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(
      page.getByRole("button", { name: /Criar aviso/i }).first(),
    ).toBeVisible();
  });

  test("meus alunos (satélite) e detalhe quando houver link", async ({
    page,
  }) => {
    await page.goto("/professores/alunos", { waitUntil: "load" });
    await expectMainVisible(page);
    await expect(
      page.getByRole("heading", { name: /Meus Alunos/i }),
    ).toBeVisible();

    const ok = await followFirstHref(page, "/professores/alunos/");
    if (!ok) {
      test.skip();
      return;
    }
    await expect(page).toHaveURL(/\/professores\/alunos\/[^/]+$/);
    await expectMainVisible(page);
  });

  test("detalhe turma quando houver link na tabela", async ({ page }) => {
    await page.goto("/professores/turmas", { waitUntil: "load" });
    const ok = await followFirstHref(page, "/professores/turmas/");
    if (!ok) {
      test.skip();
      return;
    }
    await expect(page).toHaveURL(/\/professores\/turmas\/[^/]+$/);
    await expectMainVisible(page);
  });
});
