import { chromium } from "playwright";

const URL = process.env.MERIDIAN_URL ?? "http://localhost:3100/";
const OUT = "docs/screenshots/hero.png";

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  reducedMotion: "no-preference",
  colorScheme: "light",
});
const page = await context.newPage();
await page.goto(URL, { waitUntil: "networkidle", timeout: 30_000 });
await page.waitForTimeout(1500);
await page.screenshot({
  path: OUT,
  clip: { x: 0, y: 0, width: 1440, height: 900 },
  type: "png",
});
await browser.close();
console.log(`wrote ${OUT}`);
