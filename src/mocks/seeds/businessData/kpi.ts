import type { KpiDetail, KpiRecord, Page } from "@/api";
import { RecordState } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

const KPIS: KpiRecord[] = [
  { name: "Yield", description: "", type: "Performance", state: RecordState.Active },
  { name: "Cycle Time", description: "", type: "Performance", state: RecordState.Active },
  { name: "Old KPI", description: "", type: "Quality", state: RecordState.Terminated },
];

const DETAILS: Record<string, KpiDetail> = {
  Yield: {
    name: "Yield",
    description: "",
    type: "Performance",
    state: RecordState.Active,
    dataGroup: "",
    sourceType: "Static",
    entityType: "",
    parameter: "KPI Percentage",
    kpiType: "Maximum",
    frequency: "Weekly",
    ownerRole: "",
    closeToTargetMinimumValue: 80,
    inTargetMinimumValue: 85,
    targetValue: 90,
  },
};

export function queryKpis(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<KpiRecord> {
  const rows = filterByState(filterByQuery(KPIS, q, ["name", "description"]), state);
  return paginate(rows, page, limit);
}

export function getKpiDetail(name: string): KpiDetail | undefined {
  return DETAILS[name];
}
