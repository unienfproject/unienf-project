import { expect, type Page } from "@playwright/test";

/** Mensagem exibida quando um perfil errado abre área da recepção. */
export const RECEPCAO_DENIED = /Rota exclusiva da recepção/;

export async function gotoAndSettle(page: Page, url: string) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
}

export async function clickSidebarLink(page: Page, name: string) {
  const link = page.getByRole("link", { name, exact: true }).first();
  await expect(link).toBeVisible({ timeout: 20_000 });
  await link.click();
}

/** Garante que a página atual não é o bloqueio explícito da home da recepção. */
export async function expectNotRecepcaoExclusiveWall(page: Page) {
  await expect(page.getByText(RECEPCAO_DENIED)).toHaveCount(0);
}

export async function expectPath(page: Page, pattern: RegExp) {
  await expect(page).toHaveURL(pattern);
}
