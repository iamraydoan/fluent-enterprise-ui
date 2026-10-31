import type { ParameterDetail, ParameterRecord, Page } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

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
  const rows = filterByState(filterByQuery(RECORDS, q, ["name"]), state);
  return paginate(rows, page, limit);
}

export function buildParameterDetail(name: string): ParameterDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return { ...record };
}
