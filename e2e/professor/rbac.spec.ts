import { expect, test } from "@playwright/test";
import { RECEPCAO_DENIED, gotoAndSettle } from "../helpers/nav";

test.describe("Professor — RBAC", () => {
  test("não acessa área da recepção", async ({ page }) => {
    await gotoAndSettle(page, "/recepcao");
    await expect(page.getByText(RECEPCAO_DENIED)).toBeVisible();
  });
});
