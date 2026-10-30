import type { ProtocolDetail, ProtocolRecord, Page } from "@/api";

const RECORDS: ProtocolRecord[] = [
  { name: "Cleaning-01", description: "Line cleaning protocol", type: "Cleaning", state: "Active", version: "1.0" },
  { name: "Calibration-02", description: "Scale calibration", type: "Calibration", state: "Active", version: "2.1" },
];

export function queryProtocols(page: number, limit: number, q?: string, state?: string): Page<ProtocolRecord> {
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

export function buildProtocolDetail(name: string): ProtocolDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return { ...record };
}
