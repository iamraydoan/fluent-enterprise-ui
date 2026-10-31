// Fails the build when the initial JS bundle grows past the budget in
// .github/bundle-baseline.json. Run after `vite build` via `pnpm check:bundle`.
/* global console, process */
import { readFileSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const baselinePath = join(root, ".github", "bundle-baseline.json");

function fail(message) {
  console.error(`bundle-size: FAIL — ${message}`);
  process.exit(1);
}

if (!existsSync(baselinePath)) fail(`baseline file not found: ${baselinePath}`);
if (!existsSync(join(dist, "index.html")))
  fail("dist/index.html not found. Run `pnpm build` first.");

const baseline = JSON.parse(readFileSync(baselinePath, "utf8"));
const budgetKb = baseline.initialJsGzipBudgetKb;
if (typeof budgetKb !== "number") fail("baseline.initialJsGzipBudgetKb must be a number");

const html = readFileSync(join(dist, "index.html"), "utf8");
const initialFiles = new Set();
for (const match of html.matchAll(/<script[^>]*type="module"[^>]*src="([^"]+)"/g)) {
  initialFiles.add(match[1]);
}
for (const match of html.matchAll(/<link[^>]*rel="modulepreload"[^>]*href="([^"]+)"/g)) {
  initialFiles.add(match[1]);
}
if (initialFiles.size === 0) fail("no initial chunks found in dist/index.html");

let rawBytes = 0;
let gzipBytes = 0;
const rows = [];
for (const href of [...initialFiles].sort()) {
  const filePath = join(dist, href.replace(/^\//, ""));
  if (!existsSync(filePath)) fail(`chunk referenced in index.html is missing: ${href}`);
  const buf = readFileSync(filePath);
  const gz = gzipSync(buf).length;
  rawBytes += buf.length;
  gzipBytes += gz;
  rows.push({ file: href, kb: (buf.length / 1024).toFixed(1), gzipKb: (gz / 1024).toFixed(1) });
}

const gzipKb = gzipBytes / 1024;
console.log("bundle-size: initial chunks (from dist/index.html)");
for (const row of rows) console.log(`  ${row.file}  ${row.kb} KB (gzip ${row.gzipKb} KB)`);
console.log(
  `bundle-size: total ${initialFiles.size} files, ${(rawBytes / 1024).toFixed(1)} KB raw, ${gzipKb.toFixed(1)} KB gzip (budget ${budgetKb} KB)`,
);

if (gzipKb > budgetKb) {
  fail(
    `initial JS gzip ${gzipKb.toFixed(1)} KB exceeds budget ${budgetKb} KB by ${(gzipKb - budgetKb).toFixed(1)} KB. ` +
      `Investigate what grew, or raise the budget in .github/bundle-baseline.json with justification.`,
  );
}
console.log("bundle-size: PASS");
