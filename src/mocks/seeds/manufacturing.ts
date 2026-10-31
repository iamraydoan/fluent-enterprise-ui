import { RecordState } from "@/api";
import type { Page, FabLiveDetail, FabLiveRecord } from "@/api";

const RECORDS: FabLiveRecord[] = [
  {
    name: "FabLive_1_AP",
    description: "Assembly packaging line live view",
    folder: "fabLives",
    state: RecordState.Active,
  },
  {
    name: "FabLive_2_AP",
    description: "SMT line live view",
    folder: "fabLives",
    state: RecordState.Active,
  },
  {
    name: "FabLive_3_AP",
    description: "Test station live view",
    folder: "fabLives",
    state: RecordState.Active,
  },
];

const DETAILS: Record<string, FabLiveDetail> = {
  FabLive_1_AP: {
    name: "FabLive_1_AP",
    description: "Assembly packaging line live view",
    folder: "fabLives",
    state: RecordState.Active,
    dataGroup: "",
  },
  FabLive_2_AP: {
    name: "FabLive_2_AP",
    description: "SMT line live view",
    folder: "fabLives",
    state: RecordState.Active,
    dataGroup: "",
  },
  FabLive_3_AP: {
    name: "FabLive_3_AP",
    description: "Test station live view",
    folder: "fabLives",
    state: RecordState.Active,
    dataGroup: "",
  },
};

export function getFabLivePage(params: {
  page: number;
  limit: number;
  q?: string;
  state?: string;
}): Page<FabLiveRecord> {
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

export function getFabLiveDetail(name: string): FabLiveDetail | undefined {
  return DETAILS[name];
}
