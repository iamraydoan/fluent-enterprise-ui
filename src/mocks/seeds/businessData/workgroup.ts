import { RecordState } from "@/api";
import type { Page, WorkgroupDetail, WorkgroupRecord } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

const RECORDS: WorkgroupRecord[] = [
  {
    name: "Production WG",
    description: "Production workspace workgroup",
    scope: "Workspace",
    state: RecordState.Active,
  },
  {
    name: "Quality WG",
    description: "Quality workspace workgroup",
    scope: "Workspace",
    state: RecordState.Active,
  },
];

const DETAILS: Record<string, WorkgroupDetail> = {
  "Production WG": {
    name: "Production WG",
    description: "Production workspace workgroup",
    scope: "Workspace",
    state: RecordState.Active,
    dataGroup: "",
    resources: ["Mixer-01", "Oven-01"],
    steps: ["Mixing", "Baking"],
    areas: ["Mixing Area", "Baking Area"],
  },
  "Quality WG": {
    name: "Quality WG",
    description: "Quality workspace workgroup",
    scope: "Workspace",
    state: RecordState.Active,
    dataGroup: "",
    resources: ["Lab-01"],
    steps: ["Inspection"],
    areas: ["Quality Lab"],
  },
};

export function getWorkgroupPage(params: {
  page: number;
  limit: number;
  q?: string;
  state?: string;
}): Page<WorkgroupRecord> {
  const rows = filterByState(filterByQuery(RECORDS, params.q, ["name"]), params.state);
  return paginate(rows, params.page, params.limit);
}

export function getWorkgroupDetail(name: string): WorkgroupDetail | undefined {
  return DETAILS[name];
}
