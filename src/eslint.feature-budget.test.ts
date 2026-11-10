import { relative } from "node:path";
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";
import { expect, it } from "vitest";
import budget from "../eslint.feature-budget.json";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const FEATURE_GLOB = "src/features/**/*.{ts,tsx}";
const FEATURE_ROOT = "src/features/";
const FEATURE_DEBT_TOTAL_BASELINE = 1937;
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

it("keeps every feature folder cell inside the committed budget", async () => {
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

  const total = Object.values(measured).reduce((sum, count) => sum + count, 0);
  expect(total, "feature warning total").toBeLessThanOrEqual(FEATURE_DEBT_TOTAL_BASELINE);

  const declared: Record<string, number> = {};
  for (const [head, rules] of Object.entries(budget as Record<string, Record<string, number>>)) {
    for (const [ruleId, count] of Object.entries(rules)) {
      declared[cell(head, ruleId)] = count;
    }
  }
  for (const [key, count] of Object.entries(measured)) {
    expect(count, key).toBeLessThanOrEqual(declared[key] ?? 0);
  }

  const measuredKeys = Object.keys(measured).sort();
  const declaredKeys = Object.keys(declared).sort();
  expect(
    declaredKeys.filter((key) => !measuredKeys.includes(key)),
    "stale budget cells",
  ).toEqual([]);
  expect(
    measuredKeys.filter((key) => !declaredKeys.includes(key)),
    "unlisted budget cells",
  ).toEqual([]);
}, 600000);
