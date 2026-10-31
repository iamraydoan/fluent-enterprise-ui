import { RecordState } from "@/api";
import type { Page, SiteDetail, SiteRecord } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

const RECORDS: SiteRecord[] = [
  {
    name: "Cookie Factory Site",
    description: "Main production site",
    enterprise: "Cookie Enterprise",
    isRemote: false,
    state: RecordState.Active,
  },
  {
    name: "Remote Site B",
    description: "Remote shipping site",
    enterprise: "Cookie Enterprise",
    isRemote: true,
    state: RecordState.Active,
  },
];

const DETAILS: Record<string, SiteDetail> = {
  "Cookie Factory Site": {
    name: "Cookie Factory Site",
    description: "Main production site",
    enterprise: "Cookie Enterprise",
    isRemote: false,
    state: RecordState.Active,
    dataGroup: "",
    remoteExportAddress: "",
    facilities: ["Factory Facility", "Warehouse Facility"],
  },
  "Remote Site B": {
    name: "Remote Site B",
    description: "Remote shipping site",
    enterprise: "Cookie Enterprise",
    isRemote: true,
    state: RecordState.Active,
    dataGroup: "",
    remoteExportAddress: "https://remote-site-b.example.com/shipping-gateway",
    facilities: ["Remote Facility"],
  },
};

export function getSitePage(params: {
  page: number;
  limit: number;
  q?: string;
  state?: string;
}): Page<SiteRecord> {
  const rows = filterByState(filterByQuery(RECORDS, params.q, ["name"]), params.state);
  return paginate(rows, params.page, params.limit);
}

export function getSiteDetail(name: string): SiteDetail | undefined {
  return DETAILS[name];
}
