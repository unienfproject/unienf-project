import { expect, test } from "@playwright/test";
import {
  RECEPCAO_DENIED,
  gotoAndSettle,
  hasBrokenAuthenticatedAppState,
} from "../helpers/nav";

test.describe("Coordenação — RBAC", () => {
  test("não acessa home exclusiva da recepção", async ({ page }) => {
    await gotoAndSettle(page, "/recepcao");
    if (await hasBrokenAuthenticatedAppState(page)) {
      test.skip(
        true,
        "Ambiente de coordenaÃ§Ã£o indisponÃ­vel ou credenciais nÃ£o pertencem Ã  role esperada.",
      );
      return;
    }
    await expect(page.getByText(RECEPCAO_DENIED)).toBeVisible();
  });
});
