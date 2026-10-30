import type { EnterpriseDetail, EnterpriseRecord, Page } from "@/api";
import { RecordState } from "@/api";

const ENTERPRISES: EnterpriseRecord[] = [
  { name: "Giant Enterprise", description: "", dataGroup: "", state: RecordState.Active },
  { name: "ACME", description: "Demo enterprise", dataGroup: "", state: RecordState.Active },
  { name: "Old Enterprise", description: "Merged", dataGroup: "", state: RecordState.Terminated },
];

const DETAILS: Record<string, EnterpriseDetail> = {
  "Giant Enterprise": {
    name: "Giant Enterprise",
    description: "",
    dataGroup: "",
    state: RecordState.Active,
    sites: [
      { name: "Dresden-Backend", state: RecordState.Active },
      { name: "Porto-Frontend", state: RecordState.Active },
    ],
  },
  ACME: {
    name: "ACME",
    description: "Demo enterprise",
    dataGroup: "",
    state: RecordState.Active,
    sites: [{ name: "ACME-Site", state: RecordState.Active }],
  },
};

export function queryEnterprises(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<EnterpriseRecord> {
  let rows = ENTERPRISES;
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

export function getEnterpriseDetail(name: string): EnterpriseDetail | undefined {
  return DETAILS[name];
}
