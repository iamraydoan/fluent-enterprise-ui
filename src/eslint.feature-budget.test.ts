import { readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";
import { expect, it } from "vitest";
import budget from "../eslint.feature-budget.json";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const FEATURE_GLOB = "src/features/**/*.{ts,tsx}";
const FEATURE_ROOT = "src/features/";
const FEATURE_DEBT_TOTAL_BASELINE = 1937;
const EXCLUDED_TEST_FILE_COUNT = 58;
const EXCLUDED_FIXTURE_FILE_COUNT = 0;
const CELL_SEPARATOR = "|";

const FEATURE_RULES = [
  "local/no-feature-makeStyles",
  "local/no-feature-style-prop",
  "local/no-feature-literal-hex",
  "local/no-feature-literal-px",
  "local/no-feature-literal-radius",
  "local/no-feature-theme-import",
  "local/no-feature-settings-import",
  "local/no-feature-conditional-style",
  "no-restricted-syntax",
];

function cell(head: string, ruleId: string) {
  return head + CELL_SEPARATOR + ruleId;
}

function walk(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...walk(full));
    else if (entry.isFile()) found.push(full);
  }
  return found;
}

it("keeps every feature folder cell exactly at its committed budget", async () => {
  const eslint = new ESLint({ cwd: ROOT });
  const results = await eslint.lintFiles([FEATURE_GLOB]);
  const measured: Record<string, number> = {};
  for (const result of results) {
    const file = relative(ROOT, result.filePath).split("\\").join("/");
    if (!file.startsWith(FEATURE_ROOT)) continue;
    const head = file.split("/")[2];
    for (const message of result.messages) {
      if (message.severity !== 1 || !message.ruleId) continue;
      if (!FEATURE_RULES.includes(message.ruleId)) continue;
      const key = cell(head, message.ruleId);
      measured[key] = (measured[key] ?? 0) + 1;
    }
  }

  const declared: Record<string, number> = {};
  for (const [head, rules] of Object.entries(budget as Record<string, Record<string, number>>)) {
    for (const [ruleId, count] of Object.entries(rules)) {
      declared[cell(head, ruleId)] = count;
    }
  }

  const keys = [...new Set([...Object.keys(measured), ...Object.keys(declared)])].sort();
  for (const key of keys) {
    const measuredCount = measured[key] ?? 0;
    const declaredCount = declared[key] ?? 0;
    const direction =
      measuredCount > declaredCount
        ? "over budget, new debt was introduced"
        : measuredCount < declaredCount
          ? "under budget, lower the declared cell in this commit"
          : "in budget";
    expect(
      measuredCount,
      key + ": measured " + measuredCount + ", declared " + declaredCount + " (" + direction + ")",
    ).toBe(declaredCount);
  }

  const measuredTotal = Object.values(measured).reduce((sum, count) => sum + count, 0);
  const declaredTotal = Object.values(declared).reduce((sum, count) => sum + count, 0);
  expect(
    measuredTotal,
    "feature warning total: measured " + measuredTotal + ", declared " + declaredTotal,
  ).toBe(declaredTotal);
  expect(
    declaredTotal,
    "declared total " +
      declaredTotal +
      " exceeds the committed high-water mark " +
      FEATURE_DEBT_TOTAL_BASELINE,
  ).toBeLessThanOrEqual(FEATURE_DEBT_TOTAL_BASELINE);
}, 600000);

it("pins the excluded feature set to the files the runners collect", () => {
  const files = walk(join(ROOT, "src/features")).map((file) =>
    relative(ROOT, file).split("\\").join("/"),
  );
  const ignoredTests = files
    .filter((file) => file.endsWith(".test.ts") || file.endsWith(".browser.test.tsx"))
    .sort();
  const ignoredFixtures = files.filter((file) => file.includes("/__fixtures__/")).sort();
  expect(ignoredTests.length, "ignored test files").toBe(EXCLUDED_TEST_FILE_COUNT);
  expect(ignoredFixtures.length, "ignored fixture files").toBe(EXCLUDED_FIXTURE_FILE_COUNT);
});
