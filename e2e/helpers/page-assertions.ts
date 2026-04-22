import { expect, type Page } from "@playwright/test";

export async function expectMainVisible(page: Page) {
  const appMain = page.locator('main[data-slot="sidebar-inset"]');

  if ((await appMain.count()) > 0) {
    await expect(appMain).toBeVisible({ timeout: 25_000 });
    return;
  }

  await expect(page.locator("main").first()).toBeVisible({ timeout: 25_000 });
}
