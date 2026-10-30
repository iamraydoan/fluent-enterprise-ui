import type { ParameterDetail, ParameterRecord, Page } from "@/api";

const RECORDS: ParameterRecord[] = [
  {
    name: "Temp_Setpoint",
    description: "Temperature setpoint",
    dataType: "Double",
    value: "180.5",
    state: "Active",
  },
  {
    name: "Speed_Limit",
    description: "Max line speed",
    dataType: "Integer",
    value: "1200",
    state: "Active",
  },
];

export function queryParameters(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<ParameterRecord> {
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

export function buildParameterDetail(name: string): ParameterDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return { ...record };
}
