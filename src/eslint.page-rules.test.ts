import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";
import { expect, it } from "vitest";
import ledger from "../eslint.page-debt.json";
import { runLedgerCheck } from "./eslint.page-debt.test";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const RAW_MAPPING_BASELINE = 212;
const FIXTURE_PAGE = "src/features/fixture/FixturePage.tsx";
const COMPLIANT_PAGE_FILE = "src/features/administration/apps/AppsListPage.tsx";

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

const GAP_ATTRIBUTE_PAGE = [
  "export function FixturePage() {",
  '  return <div gap="12px" />;',
  "}",
].join("\n");

const WIDTH_ATTRIBUTE_PAGE = [
  "export function FixturePage() {",
  '  return <img width="24px" alt="" />;',
  "}",
].join("\n");

const HREF_FRAGMENT_PAGE = [
  "export function FixturePage() {",
  '  return <a href="#abc">x</a>;',
  "}",
].join("\n");

const STYLE_HEX_PAGE = [
  "export function FixturePage() {",
  '  return <div style={{ color: "#fff" }} />;',
  "}",
].join("\n");

const STYLE_PX_PAGE = [
  "export function FixturePage() {",
  '  return <div style={{ width: "24px" }} />;',
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

function pageFindings(messages: { ruleId: string | null; severity: number }[]) {
  return messages
    .filter((message) => message.severity === 2 && message.ruleId?.startsWith("local/no-page-"))
    .map((message) => message.ruleId);
}

async function lintFixture(code: string) {
  const eslint = new ESLint({ cwd: ROOT });
  const [result] = await eslint.lintText(code, { filePath: FIXTURE_PAGE });
  return pageFindings(result.messages);
}

it("does not fire on non-style data literals", async () => {
  const eslint = new ESLint({ cwd: ROOT });
  const [result] = await eslint.lintText(DATA_ONLY_PAGE, { filePath: FIXTURE_PAGE });
  expect(pageFindings(result.messages)).toEqual([]);
  expect(result.errorCount).toBe(0);
});

it("fires on a px literal passed as a JSX attribute", async () => {
  expect(await lintFixture(GAP_ATTRIBUTE_PAGE)).toEqual(["local/no-page-literal-px"]);
  expect(await lintFixture(WIDTH_ATTRIBUTE_PAGE)).toEqual(["local/no-page-literal-px"]);
});

it("fires on a px literal inside a style object", async () => {
  expect(await lintFixture(STYLE_PX_PAGE)).toContain("local/no-page-literal-px");
});

it("stays silent on exempt hex attributes but fires inside a style object", async () => {
  expect(await lintFixture(HREF_FRAGMENT_PAGE)).not.toContain("local/no-page-literal-hex");
  expect(await lintFixture(STYLE_HEX_PAGE)).toContain("local/no-page-literal-hex");
});

it("fires on a conditional wrapped in a call inside className", async () => {
  expect(await lintFixture(WRAPPED_CONDITIONAL_PAGE)).toEqual(["local/no-page-conditional-style"]);
});

it("keeps the ledger free of duplicate rule ids and inside the raw-mapping ratchet", () => {
  const entries = Object.entries(ledger as Record<string, string[]>);
  const duplicated = entries.filter(([, rules]) => new Set(rules).size !== rules.length);
  const rawMappings = entries.reduce((total, [, rules]) => total + rules.length, 0);
  expect(duplicated).toEqual([]);
  expect(rawMappings).toBeLessThanOrEqual(RAW_MAPPING_BASELINE);
});

it("drives the meta test's empty-ledger branch against a compliant page set", async () => {
  await runLedgerCheck({ entries: [], emptyTarget: [COMPLIANT_PAGE_FILE] });
});
