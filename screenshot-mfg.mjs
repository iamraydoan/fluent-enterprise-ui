import { chromium } from "playwright";

const BASE = "http://localhost:4182";
const OUT = "/home/hatch/workspace/screenshots/manufacturing";

// Pages to screenshot: [name, url, actions?]
const PAGES = [
  ["hub", "/manufacturing", null],
  ["augmented-reality", "/manufacturing/augmented-reality", null],
  ["barcode-identification", "/manufacturing/barcode-identification", null],
  ["fab-explorer-enterprises", "/manufacturing/fab-explorer", null],
  ["fab-lives-list", "/manufacturing/fab-lives", null],
  ["my-workgroup", "/manufacturing/my-workgroup", null],
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await context.newPage();

  // Collect console errors
  const errors = [];
  page.on("pageerror", (e) => errors.push(`PAGEERROR: ${e.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`CONSOLE: ${msg.text().slice(0, 200)}`);
  });

  for (const [name, url, actions] of PAGES) {
    console.log(`\n=== ${name}: ${url} ===`);
    try {
      await page.goto(BASE + url, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(2000);

      // Check for tab system - try to open the route via the app's tab store
      // First, see what's on the page
      const title = await page.title();
      console.log(`  Title: ${title}`);

      // Take screenshot
      await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
      console.log(`  Saved: ${OUT}/${name}.png`);

      if (actions) await actions(page);
    } catch (e) {
      console.log(`  ERROR: ${e.message.slice(0, 200)}`);
      await page.screenshot({ path: `${OUT}/${name}-error.png` }).catch(() => {});
    }
  }

  console.log("\n=== ERRORS ===");
  const uniqueErrors = [...new Set(errors)].slice(0, 20);
  uniqueErrors.forEach((e) => console.log(`  ${e}`));
  if (uniqueErrors.length === 0) console.log("  (none)");

  await browser.close();
}

main().catch(console.error);
