import type { PickListDetail, PickListRecord, Page } from "@/api";
import { filterByQuery, filterByState, paginate } from "../mockUtils";

const RECORDS: PickListRecord[] = [
  {
    name: "PL-0001",
    description: "Morning picks",
    state: "Open",
    itemCount: "25",
    createdOn: "10/30/2026",
  },
  {
    name: "PL-0002",
    description: "Afternoon picks",
    state: "Completed",
    itemCount: "18",
    createdOn: "10/29/2026",
  },
];

export function queryPickLists(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<PickListRecord> {
  const rows = filterByState(filterByQuery(RECORDS, q, ["name"]), state);
  return paginate(rows, page, limit);
}

export function buildPickListDetail(name: string): PickListDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return { ...record };
}
