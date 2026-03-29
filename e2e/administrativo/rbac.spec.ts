import { expect, test } from "@playwright/test";
import { RECEPCAO_DENIED, gotoAndSettle } from "../helpers/nav";

test.describe("Administrativo — RBAC", () => {
  test("não acessa home exclusiva da recepção", async ({ page }) => {
    await gotoAndSettle(page, "/recepcao");
    await expect(page.getByText(RECEPCAO_DENIED)).toBeVisible();
  });
});
