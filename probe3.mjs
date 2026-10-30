import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await page.goto("http://[::1]:4180", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.locator('button[aria-label="Business Data"]').click();
await page.waitForTimeout(1500);
await page.getByRole("button", { name: "Container", exact: true }).first().click();
await page.waitForTimeout(2000);
await page.locator("tbody tr").first().click();
await page.waitForTimeout(2000);
// open Add dialog via menu
await page.getByRole("button", { name: "More" }).nth(1).click();
await page.waitForTimeout(600);
await page.getByRole("menuitem", { name: "Add Container to Container" }).click();
await page.waitForTimeout(600);
console.log("add dialog visible:", await page.getByText("Add the Container").count());
await page.screenshot({ path: "/tmp/dbg1.png" });
// close via Cancel
await page.getByRole("button", { name: "Cancel" }).first().click();
await page.waitForTimeout(600);
console.log("dialog closed:", (await page.getByText("Add the Container").count()) === 0);
await page.screenshot({ path: "/tmp/dbg2.png" });
// reopen menu
await page.getByRole("button", { name: "More" }).nth(1).click();
await page.waitForTimeout(800);
await page.screenshot({ path: "/tmp/dbg3.png" });
console.log("dock menuitem count:", await page.getByRole("menuitem", { name: "Dock Container" }).count());
console.log("any menu count:", await page.locator('[role="menu"]').count());
await browser.close();
