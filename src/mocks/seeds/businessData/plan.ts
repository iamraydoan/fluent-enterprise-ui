import type { PlanDetail, PlanRecord, Page } from "@/api";

const RECORDS: PlanRecord[] = [
  { name: "PLAN-2026", description: "Annual production plan", type: "Production", state: "Active", startDate: "01/01/2026" },
];

export function queryPlans(page: number, limit: number, q?: string, state?: string): Page<PlanRecord> {
  let rows = RECORDS;
  if (q !== undefined && q !== "") {
    const needle = q.toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(needle));
  }
  if (state !== undefined && state !== "" && state !== "all") {
    rows = rows.filter((r) => (r as unknown as Record<string, string>).state?.toLowerCase() === state.toLowerCase());
  }
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function buildPlanDetail(name: string): PlanDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return { ...record };
}
