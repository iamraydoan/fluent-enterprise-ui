import type { PickListDetail, PickListRecord, Page } from "@/api";

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

export function buildPickListDetail(name: string): PickListDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return { ...record };
}
