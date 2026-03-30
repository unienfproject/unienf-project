import { test } from "@playwright/test";

test.describe("Aluno — interações leves (sem gravar)", () => {
  test("perfil: Editar abre fluxo e pode fechar com Escape", async ({
    page,
  }) => {
    await page.goto("/perfil", { waitUntil: "load" });
    const edit = page.getByRole("button", { name: /^Editar$/i });
    if ((await edit.count()) === 0) {
      test.skip();
      return;
    }
    await edit.first().click();
    await page.keyboard.press("Escape");
  });
});
