import type { KpiDetail, KpiRecord, Page } from "@/api";
import { RecordState } from "@/api";

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
  let rows = KPIS;
  if (q !== undefined && q !== "") {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (row) =>
        row.name.toLowerCase().includes(needle) ||
        row.description.toLowerCase().includes(needle),
    );
  }
  if (state !== undefined && state !== "") {
    const needle = state.toLowerCase();
    rows = rows.filter((row) => row.state.toLowerCase() === needle);
  }
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function getKpiDetail(name: string): KpiDetail | undefined {
  return DETAILS[name];
}
