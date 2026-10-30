import { RecordState } from "@/api";
import type { Page, WorkgroupDetail, WorkgroupRecord } from "@/api";

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
  let filtered = RECORDS;
  if (params.q) {
    const q = params.q.toLowerCase();
    filtered = filtered.filter((r) => r.name.toLowerCase().includes(q));
  }
  if (params.state && params.state !== "All") {
    filtered = filtered.filter((r) => r.state === params.state);
  }
  const start = (params.page - 1) * params.limit;
  return {
    data: filtered.slice(start, start + params.limit),
    meta: { page: params.page, limit: params.limit, total: filtered.length },
  };
}

export function getWorkgroupDetail(name: string): WorkgroupDetail | undefined {
  return DETAILS[name];
}
