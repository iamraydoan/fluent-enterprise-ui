import type { PeriodicInventoryDetail, PeriodicInventoryRecord, Page } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

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
  const rows = filterByState(filterByQuery(RECORDS, q, ["name"]), state);
  return paginate(rows, page, limit);
}

export function buildPeriodicInventoryDetail(name: string): PeriodicInventoryDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return { ...record };
}
