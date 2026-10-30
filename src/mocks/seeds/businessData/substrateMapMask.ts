import { RecordState } from "@/api";
import type { Page, SubstrateMapMaskDetail, SubstrateMapMaskRecord } from "@/api";

const RECORDS: SubstrateMapMaskRecord[] = [
  {
    name: "Mask 001",
    description: "Etch mask for wafer",
    substrateType: "Wafer",
    state: RecordState.Active,
  },
];

const DETAILS: Record<string, SubstrateMapMaskDetail> = {
  "Mask 001": {
    name: "Mask 001",
    description: "Etch mask for wafer",
    substrateType: "Wafer",
    state: RecordState.Active,
    dataGroup: "",
  },
};

export function getSubstrateMapMaskPage(params: {
  page: number;
  limit: number;
  q?: string;
  state?: string;
}): Page<SubstrateMapMaskRecord> {
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

export function getSubstrateMapMaskDetail(name: string): SubstrateMapMaskDetail | undefined {
  return DETAILS[name];
}
