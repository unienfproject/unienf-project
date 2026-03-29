import { expect, test } from "@playwright/test";
import { RECEPCAO_DENIED, gotoAndSettle } from "../helpers/nav";

test.describe("Aluno — RBAC", () => {
  test("não acessa área da recepção", async ({ page }) => {
    await gotoAndSettle(page, "/recepcao");
    await expect(page.getByText(RECEPCAO_DENIED)).toBeVisible();
  });

  test("não acessa turmas do professor", async ({ page }) => {
    await gotoAndSettle(page, "/professores/turmas");
    await expect(
      page.getByText(/Esta página é exclusiva do professor/i),
    ).toBeVisible();
  });
});
