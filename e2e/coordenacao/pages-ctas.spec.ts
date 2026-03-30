import { expect, test } from "@playwright/test";
import { expectMainVisible } from "../helpers/page-assertions";

/**
 * Mesmas URLs do menu de coordenação (sem Usuários / Valores).
 */
test.describe("Coordenação — páginas e CTAs do menu (leitura)", () => {
  test("visão geral e demais entradas do menu", async ({ page }) => {
    const routes: { path: string; heading: string | RegExp }[] = [
      { path: "/admin", heading: "Visão Geral" },
      { path: "/admin/alunos", heading: "Alunos" },
      { path: "/admin/professores", heading: "Professores" },
      { path: "/admin/disciplinas", heading: "Conteúdos" },
      { path: "/admin/turmas", heading: "Disciplinas Cadastradas" },
      { path: "/admin/cursos", heading: "Cursos" },
      { path: "/admin/avisos", heading: "Avisos e Comunicados" },
    ];

    for (const { path, heading } of routes) {
      await page.goto(path, { waitUntil: "load" });
      await expectMainVisible(page);
      await expect(page.getByRole("heading", { name: heading }).first()).toBeVisible({
        timeout: 20_000,
      });
    }
  });

  test("menu não exibe Usuários nem Valores", async ({ page }) => {
    await page.goto("/admin", { waitUntil: "load" });
    await expect(
      page.getByRole("link", { name: "Usuários", exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Valores", exact: true }),
    ).toHaveCount(0);
  });
});
