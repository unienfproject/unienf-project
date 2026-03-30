import { expect, type Page } from "@playwright/test";

export async function expectMainVisible(page: Page) {
  await expect(page.locator("main")).toBeVisible({ timeout: 25_000 });
}
