import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";
import { expect, it } from "vitest";
import ledger from "../eslint.page-debt.json";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const RAW_MAPPING_BASELINE = 187;
const FIXTURE_PAGE = "src/features/fixture/FixturePage.tsx";

const DATA_ONLY_PAGE = [
  'const width = "12px";',
  'const parsed = parseInt("12px", 10);',
  'const anchor = "#abc";',
  "const model = { borderRadius: 4 };",
  "",
  "export function FixturePage() {",
  "  return (",
  "    <div>",
  "      {width}",
  "      {parsed}",
  "      {anchor}",
  "      {model.borderRadius}",
  "    </div>",
  "  );",
  "}",
].join("\n");

const WRAPPED_CONDITIONAL_PAGE = [
  'import { mergeClasses } from "@/components/ui";',
  "",
  "const active = true;",
  "",
  "export function FixturePage() {",
  '  return <div className={mergeClasses("a", active && "b")} />;',
  "}",
].join("\n");

const COMPLIANT_PAGE = ["export function FixturePage() {", "  return <div />;", "}"].join("\n");

function pageFindings(messages: { ruleId: string | null; severity: number }[]) {
  return messages
    .filter((message) => message.severity === 2 && message.ruleId?.startsWith("local/no-page-"))
    .map((message) => message.ruleId);
}

it("does not fire on non-style data literals", async () => {
  const eslint = new ESLint({ cwd: ROOT });
  const [result] = await eslint.lintText(DATA_ONLY_PAGE, { filePath: FIXTURE_PAGE });
  expect(pageFindings(result.messages)).toEqual([]);
  expect(result.errorCount).toBe(0);
});

it("fires on a conditional wrapped in a call inside className", async () => {
  const eslint = new ESLint({ cwd: ROOT });
  const [result] = await eslint.lintText(WRAPPED_CONDITIONAL_PAGE, { filePath: FIXTURE_PAGE });
  expect(pageFindings(result.messages)).toEqual(["local/no-page-conditional-style"]);
});

it("keeps the ledger free of duplicate rule ids and inside the raw-mapping ratchet", () => {
  const entries = Object.entries(ledger as Record<string, string[]>);
  const duplicated = entries.filter(([, rules]) => new Set(rules).size !== rules.length);
  const rawMappings = entries.reduce((total, [, rules]) => total + rules.length, 0);
  expect(duplicated).toEqual([]);
  expect(rawMappings).toBeLessThanOrEqual(RAW_MAPPING_BASELINE);
});

it("passes the empty-ledger end-state check on a compliant page", async () => {
  const eslint = new ESLint({ cwd: ROOT });
  const [result] = await eslint.lintText(COMPLIANT_PAGE, { filePath: FIXTURE_PAGE });
  expect(result.errorCount).toBe(0);
});
