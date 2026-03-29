import { expect, test } from "@playwright/test";
import { gotoAndSettle } from "../helpers/nav";

test.describe("Recepção — RBAC", () => {
  test("não acessa turmas do professor", async ({ page }) => {
    await gotoAndSettle(page, "/professores/turmas");
    await expect(
      page.getByText(/Esta página é exclusiva do professor/i),
    ).toBeVisible();
  });
});
