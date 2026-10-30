import type { PeriodicInventoryDetail, PeriodicInventoryRecord, Page } from "@/api";

const RECORDS: PeriodicInventoryRecord[] = [
  {
    name: "PI-2026-Q4",
    description: "Q4 inventory count",
    facility: "Cookie Factory",
    state: "Scheduled",
    scheduledOn: "12/01/2026",
  },
  {
    name: "PI-2026-Q3",
    description: "Q3 inventory count",
    facility: "Warehouse A",
    state: "Completed",
    scheduledOn: "09/01/2026",
  },
];

export function queryPeriodicInventorys(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<PeriodicInventoryRecord> {
  let rows = RECORDS;
  if (q !== undefined && q !== "") {
    const needle = q.toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(needle));
  }
  if (state !== undefined && state !== "" && state !== "all") {
    rows = rows.filter(
      (r) => (r as unknown as Record<string, string>).state?.toLowerCase() === state.toLowerCase(),
    );
  }
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function buildPeriodicInventoryDetail(name: string): PeriodicInventoryDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return { ...record };
}
