import { RecordState } from "@/api";
import type { Page, SubstrateMapDetail, SubstrateMapRecord } from "@/api";

const RECORDS: SubstrateMapRecord[] = [
  {
    name: "Wafer Map 001",
    description: "12-inch wafer bin code map",
    substrateType: "Wafer",
    state: RecordState.Active,
  },
  {
    name: "Strip Map 002",
    description: "Lead frame strip map",
    substrateType: "Strip",
    state: RecordState.Active,
  },
];

const DETAILS: Record<string, SubstrateMapDetail> = {
  "Wafer Map 001": {
    name: "Wafer Map 001",
    description: "12-inch wafer bin code map",
    substrateType: "Wafer",
    state: RecordState.Active,
    dataGroup: "",
    overlays: [
      { name: "BinCodeMap", type: "Bin Code Map", version: "1", isActive: true },
      { name: "DeviceIdMap", type: "Device ID Map", version: "1", isActive: false },
    ],
  },
  "Strip Map 002": {
    name: "Strip Map 002",
    description: "Lead frame strip map",
    substrateType: "Strip",
    state: RecordState.Active,
    dataGroup: "",
    overlays: [{ name: "BinCodeMap", type: "Bin Code Map", version: "1", isActive: true }],
  },
};

export function getSubstrateMapPage(params: {
  page: number;
  limit: number;
  q?: string;
  state?: string;
}): Page<SubstrateMapRecord> {
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

export function getSubstrateMapDetail(name: string): SubstrateMapDetail | undefined {
  return DETAILS[name];
}
