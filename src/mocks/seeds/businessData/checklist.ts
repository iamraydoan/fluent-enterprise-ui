import type { ChecklistDetail, ChecklistRecord } from "@/api";
import type { Page } from "@/api";

const RECORDS: ChecklistRecord[] = [
  { name: "Material Deviation Checklist 002", description: "Material Deviation Checklist 002", scope: "MaterialTracking", executionMode: "Long Running", state: "Effective" },
  { name: "Preventive Maintenance 01", description: "Monthly PM checklist", scope: "Maintenance Management", executionMode: "Immediate", state: "Effective" },
];

export function queryChecklists(page: number, limit: number, q?: string, state?: string): Page<ChecklistRecord> {
  let rows = RECORDS;
  if (q) {
    const n = q.toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(n) || r.description.toLowerCase().includes(n));
  }
  if (state && state !== "" && state !== "all") rows = rows.filter((r) => r.state.toLowerCase() === state.toLowerCase());
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function buildChecklistDetail(name: string): ChecklistDetail {
  const r = RECORDS.find((x) => x.name === name) ?? { name, description: name, scope: "General", executionMode: "Immediate", state: "Effective" };
  return {
    ...r,
    type: "Standard",
    universalState: r.state,
    dataGroup: "",
    bom: "BOM 001 [A]",
    product: "",
    materialDeviationProtocol: "DeviationProtocol_001 [A]",
    defineStandardTimes: true,
    trackExecutionTimes: true,
    standardDuration: "10m",
    items: [
      { name: "Item 01: Verify Material Deviation", description: "Confirm that the material deviation has been correctly identified.", activityType: "Manual Task", trackingType: "End", standardDuration: "5m", optional: false, floating: false },
      { name: "Item 02: Isolate Affected Material", description: "Physically and systemically segregate all affected material.", activityType: "Manual Task", trackingType: "End", standardDuration: "5m", optional: false, floating: false },
    ],
    instances: [{ name: "Instance 2026-10-001", state: "Open" }],
  };
}
