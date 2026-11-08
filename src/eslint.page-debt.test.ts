import { readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";
import type { Linter } from "eslint";
import { expect, it } from "vitest";
import ledger from "../eslint.page-debt.json";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const PAGE_GLOB = "src/features/**/*Page.tsx";
const LEDGER_FILE_BASELINE = 67;
const LEDGER_MAPPING_BASELINE = 209;

function walk(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...walk(full));
    else if (entry.isFile()) found.push(full);
  }
  return found;
}

const ledgerEntries = Object.entries(ledger as Record<string, string[]>);
const ledgerFiles = ledgerEntries.map(([file]) => file);
const ledgerRuleIds = [...new Set(ledgerEntries.flatMap(([, rules]) => rules))];
const pageRuleIds = [
  ...ledgerRuleIds,
  "local/no-page-settings-import",
  "local/no-page-conditional-style",
];
const pageFiles = walk(join(ROOT, "src/features"))
  .filter((file) => file.endsWith("Page.tsx"))
  .map((file) => relative(ROOT, file).split("\\").join("/"));
const referencePage = pageFiles.find((file) => !ledgerFiles.includes(file));

it("keeps eslint.page-debt.json exactly matching the page-layer debt", async () => {
  expect(referencePage, "a clean reference page").toBeDefined();
  const base = new ESLint({ cwd: ROOT });
  const reference = await base.calculateConfigForFile(join(ROOT, referencePage as string));
  const featureSyntax = reference.rules?.["no-restricted-syntax"];
  const pageRules: Linter.RulesRecord = Object.fromEntries(
    pageRuleIds.map((ruleId) => [ruleId, "error" as const]),
  );
  const overrideConfig: Linter.Config[] = [
    { files: [PAGE_GLOB], rules: pageRules },
    ...ledgerEntries.map(([file, rules]) => ({
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
  const results = await eslint.lintFiles([PAGE_GLOB, ...ledgerFiles]);
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
    ledgerEntries.flatMap(([file, rules]) => rules.map((ruleId) => file + "|" + ruleId)),
  );
  const stale = [...declared].filter((entry) => !observed.has(entry)).sort();
  const missing = [...observed].filter((entry) => !declared.has(entry)).sort();
  expect(stale, "stale ledger entries").toEqual([]);
  expect(missing, "violations missing from the ledger").toEqual([]);
  expect(ledgerFiles.length, "ledger file entries").toBeLessThanOrEqual(LEDGER_FILE_BASELINE);
  expect(declared.size, "ledger rule mappings").toBeLessThanOrEqual(LEDGER_MAPPING_BASELINE);
}, 600000);
