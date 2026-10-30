import { RecordState } from "@/api";
import type { Page, SiteDetail, SiteRecord } from "@/api";

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

export function getSiteDetail(name: string): SiteDetail | undefined {
  return DETAILS[name];
}
