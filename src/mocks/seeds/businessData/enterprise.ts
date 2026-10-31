import type { EnterpriseDetail, EnterpriseRecord, Page } from "@/api";
import { RecordState } from "@/api";
import { filterByQuery, filterByState, paginate } from "../mockUtils";

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
  const rows = filterByState(filterByQuery(ENTERPRISES, q, ["name", "description"]), state);
  return paginate(rows, page, limit);
}

export function getEnterpriseDetail(name: string): EnterpriseDetail | undefined {
  return DETAILS[name];
}
