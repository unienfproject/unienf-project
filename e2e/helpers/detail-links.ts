import type { Page } from "@playwright/test";

/** Primeiro `a[href^=pathPrefix]` na página (algumas telas não envolvem links em `<main>`). */
export async function followFirstHref(
  page: Page,
  pathPrefix: string,
): Promise<boolean> {
  const link = page.locator(`a[href^="${pathPrefix}"]`).first();
  if ((await link.count()) === 0) {
    return false;
  }
  await link.click();
  await page.waitForLoadState("domcontentloaded");
  return true;
}

/** Primeira linha da tabela: menu ⋮ → item "Ver perfil" (rotas admin sem `<a>`). */
export async function openFirstTableVerPerfil(page: Page): Promise<boolean> {
  const row = page.locator("tbody tr").first();
  if ((await row.count()) === 0) {
    return false;
  }
  const trigger = row.locator("button").first();
  await trigger.click();
  await page.getByRole("menuitem", { name: /Ver perfil/i }).click();
  await page.waitForLoadState("domcontentloaded");
  return true;
}
