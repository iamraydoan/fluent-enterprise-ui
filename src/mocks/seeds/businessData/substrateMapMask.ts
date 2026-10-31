import { RecordState } from "@/api";
import type { Page, SubstrateMapMaskDetail, SubstrateMapMaskRecord } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

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
  const rows = filterByState(filterByQuery(RECORDS, params.q, ["name"]), params.state);
  return paginate(rows, params.page, params.limit);
}

export function getSubstrateMapMaskDetail(name: string): SubstrateMapMaskDetail | undefined {
  return DETAILS[name];
}
