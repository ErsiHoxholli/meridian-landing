import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("no axe violations on /", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});

test("tab order reaches primary CTA from top of page", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab"); // skip link
  const skip = page.getByRole("link", { name: /skip to content/i });
  await expect(skip).toBeFocused();
  // tab through nav, verify Get Early Access reachable
  let found = false;
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("Tab");
    const el = await page.evaluate(() => document.activeElement?.textContent?.trim());
    if (el && /get early access/i.test(el)) {
      found = true;
      break;
    }
  }
  expect(found).toBe(true);
});

test("waitlist form submits successfully", async ({ page }) => {
  await page.goto("/#waitlist");
  await page.getByLabel(/email address/i).fill("test@example.com");
  await page.getByRole("button", { name: /request access/i }).click();
  await expect(page.getByText(/you're on the list/i)).toBeVisible();
});
