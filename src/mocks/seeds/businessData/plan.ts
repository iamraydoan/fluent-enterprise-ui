import type { PlanDetail, PlanRecord, Page } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

const RECORDS: PlanRecord[] = [
  {
    name: "PLAN-2026",
    description: "Annual production plan",
    type: "Production",
    state: "Active",
    startDate: "01/01/2026",
  },
];

export function queryPlans(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<PlanRecord> {
  const rows = filterByState(filterByQuery(RECORDS, q, ["name"]), state);
  return paginate(rows, page, limit);
}

export function buildPlanDetail(name: string): PlanDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return { ...record };
}
