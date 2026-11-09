import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";
import type { Linter } from "eslint";
import { expect, it } from "vitest";
import featureStyleBaseline from "../eslint.feature-style-baseline.json";
import ledger from "../eslint.page-debt.json";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const PAGE_GLOB = "src/features/**/*Page.tsx";
const LEDGER_FILE_BASELINE = 18;
const LEDGER_MAPPING_BASELINE = 59;
const LEDGER_RAW_MAPPING_BASELINE = 59;

export interface LedgerCheck {
  entries: [string, string[]][];
  emptyTarget: string[];
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

export async function runLedgerCheck({ entries, emptyTarget }: LedgerCheck): Promise<void> {
  const rawMappingCount = entries.reduce((total, [, rules]) => total + rules.length, 0);
  expect(rawMappingCount, "raw ledger mappings").toBeLessThanOrEqual(LEDGER_RAW_MAPPING_BASELINE);
  expect(entries.length, "ledger file entries").toBeLessThanOrEqual(LEDGER_FILE_BASELINE);
  if (entries.length === 0) {
    const empty = new ESLint({ cwd: ROOT });
    const results = await empty.lintFiles(emptyTarget);
    const errorCount = results.reduce((total, result) => total + result.errorCount, 0);
    expect(errorCount, "eslint findings with an empty ledger").toBe(0);
    return;
  }
  expect(entries.length, "non-empty ledger path").toBeGreaterThan(0);
  const fileNames = entries.map(([file]) => file);
  const ruleIds = [...new Set(entries.flatMap(([, rules]) => rules))];
  const pageRuleIds = [
    ...ruleIds,
    "local/no-page-settings-import",
    "local/no-page-conditional-style",
  ];
  const pageFiles = walk(join(ROOT, "src/features"))
    .filter((file) => file.endsWith("Page.tsx"))
    .map((file) => relative(ROOT, file).split("\\").join("/"));
  const referencePage = pageFiles.find((file) => !fileNames.includes(file));
  expect(referencePage, "a clean reference page").toBeDefined();
  const base = new ESLint({ cwd: ROOT });
  const reference = await base.calculateConfigForFile(join(ROOT, referencePage as string));
  const featureSyntax = reference.rules?.["no-restricted-syntax"];
  const pageRules: Linter.RulesRecord = Object.fromEntries(
    pageRuleIds.map((ruleId) => [ruleId, "error" as const]),
  );
  const overrideConfig: Linter.Config[] = [
    { files: [PAGE_GLOB], rules: pageRules },
    ...entries.map(([file, rules]) => ({
      files: [file],
      rules: Object.fromEntries(
        rules.map((ruleId) => [
          ruleId,
          ruleId === "no-restricted-syntax" && featureSyntax ? featureSyntax : ("error" as const),
        ]),
      ),
    })),
  ];
  const eslint = new ESLint({ cwd: ROOT, overrideConfig });
  const results = await eslint.lintFiles([PAGE_GLOB, ...fileNames]);
  const observed = new Set<string>();
  for (const result of results) {
    const file = relative(ROOT, result.filePath).split("\\").join("/");
    for (const message of result.messages) {
      if (message.severity === 2 && message.ruleId && pageRuleIds.includes(message.ruleId)) {
        observed.add(file + "|" + message.ruleId);
      }
    }
  }
  const declared = new Set(
    entries.flatMap(([file, rules]) => rules.map((ruleId) => file + "|" + ruleId)),
  );
  const stale = [...declared].filter((entry) => !observed.has(entry)).sort();
  const missing = [...observed].filter((entry) => !declared.has(entry)).sort();
  expect(stale, "stale ledger entries").toEqual([]);
  expect(missing, "violations missing from the ledger").toEqual([]);
  expect(declared.size, "unique ledger mappings").toBeLessThanOrEqual(LEDGER_MAPPING_BASELINE);
}

const STYLE_OWNER_PATTERNS = [
  /from "@\/styles\/theme"/,
  /makeStyles\(/,
  /from "@\/styles\/shared"/,
];

export function featureStyleOwners(root: string): string[] {
  return walk(join(root, "src/features"))
    .filter((file) => /\.[jt]sx?$/.test(file))
    .filter((file) => !file.endsWith("Page.tsx") && !file.includes(".test."))
    .filter((file) => {
      const source = readFileSync(file, "utf8");
      return STYLE_OWNER_PATTERNS.some((pattern) => pattern.test(source));
    })
    .map((file) => relative(root, file).split("\\").join("/"))
    .sort();
}

export function runFeatureStyleCheck(files: string[]): void {
  const declared = new Set(featureStyleBaseline as string[]);
  const observed = new Set(files);
  const added = [...observed].filter((file) => !declared.has(file)).sort();
  const stale = [...declared].filter((file) => !observed.has(file)).sort();
  expect(added, "feature files that newly own styling").toEqual([]);
  expect(stale, "stale feature style baseline entries").toEqual([]);
  expect(observed.size, "feature styling footprint").toBeLessThanOrEqual(declared.size);
}

const IS_META_ENTRY = (expect.getState().testPath ?? "").endsWith("eslint.page-debt.test.ts");

if (IS_META_ENTRY) {
  it("keeps eslint.page-debt.json exactly matching the page-layer debt", async () => {
    await runLedgerCheck({
      entries: Object.entries(ledger as Record<string, string[]>),
      emptyTarget: ["."],
    });
  }, 600000);

  it("freezes the feature styling footprint", () => {
    runFeatureStyleCheck(featureStyleOwners(ROOT));
  });
}
