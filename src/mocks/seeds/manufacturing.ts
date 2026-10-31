import { RecordState } from "@/api";
import type { Page, FabLiveDetail, FabLiveRecord } from "@/api";
import { filterByQuery, filterByState, paginate } from "../mockUtils";

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
  const rows = filterByState(filterByQuery(RECORDS, params.q, ["name"]), params.state);
  return paginate(rows, params.page, params.limit);
}

export function getFabLiveDetail(name: string): FabLiveDetail | undefined {
  return DETAILS[name];
}
