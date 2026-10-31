import type { SortRule } from "@/api";

export function formatRuleMeta(rule: SortRule): string {
  return [rule.description, rule.sorting].filter(Boolean).join(" · ");
}
