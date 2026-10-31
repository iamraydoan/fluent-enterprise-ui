import { RecordState } from "@/api";
import type { Page, SortRuleSetDetail, SortRuleSetRecord } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

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
  const rows = filterByState(filterByQuery(RECORDS, params.q, ["name"]), params.state);
  return paginate(rows, params.page, params.limit);
}

export function getSortRuleSetDetail(name: string): SortRuleSetDetail | undefined {
  return DETAILS[name];
}
