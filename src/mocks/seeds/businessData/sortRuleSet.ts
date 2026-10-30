import { RecordState } from "@/api";
import type { Page, SortRuleSetDetail, SortRuleSetRecord } from "@/api";

const RECORDS: SortRuleSetRecord[] = [
  {
    name: "Default Material Sort",
    description: "Default material sorting",
    scope: "Material",
    state: RecordState.Active,
  },
  {
    name: "Resource Dispatch Sort",
    description: "Resource dispatch sorting",
    scope: "Resource",
    state: RecordState.Active,
  },
];

const DETAILS: Record<string, SortRuleSetDetail> = {
  "Default Material Sort": {
    name: "Default Material Sort",
    description: "Default material sorting",
    scope: "Material",
    state: RecordState.Active,
    dataGroup: "",
    rules: [
      {
        rule: "StandardSchedulingMaterialSorting",
        description: "Sort by planned start date",
        sorting: "Ascending",
      },
    ],
  },
  "Resource Dispatch Sort": {
    name: "Resource Dispatch Sort",
    description: "Resource dispatch sorting",
    scope: "Resource",
    state: RecordState.Active,
    dataGroup: "",
    rules: [
      {
        rule: "StandardSchedulingResourceSorting",
        description: "Prioritize assigned resource",
        sorting: "Ascending",
      },
    ],
  },
};

export function getSortRuleSetPage(params: {
  page: number;
  limit: number;
  q?: string;
  state?: string;
}): Page<SortRuleSetRecord> {
  let filtered = RECORDS;
  if (params.q) {
    const q = params.q.toLowerCase();
    filtered = filtered.filter((r) => r.name.toLowerCase().includes(q));
  }
  if (params.state && params.state !== "All") {
    filtered = filtered.filter((r) => r.state === params.state);
  }
  const start = (params.page - 1) * params.limit;
  return {
    data: filtered.slice(start, start + params.limit),
    meta: { page: params.page, limit: params.limit, total: filtered.length },
  };
}

export function getSortRuleSetDetail(name: string): SortRuleSetDetail | undefined {
  return DETAILS[name];
}
