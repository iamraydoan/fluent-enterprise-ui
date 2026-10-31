import type { ProtocolDetail, ProtocolRecord, Page } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

const RECORDS: ProtocolRecord[] = [
  {
    name: "Cleaning-01",
    description: "Line cleaning protocol",
    type: "Cleaning",
    state: "Active",
    version: "1.0",
  },
  {
    name: "Calibration-02",
    description: "Scale calibration",
    type: "Calibration",
    state: "Active",
    version: "2.1",
  },
];

export function queryProtocols(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<ProtocolRecord> {
  const rows = filterByState(filterByQuery(RECORDS, q, ["name"]), state);
  return paginate(rows, page, limit);
}

export function buildProtocolDetail(name: string): ProtocolDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return { ...record };
}
