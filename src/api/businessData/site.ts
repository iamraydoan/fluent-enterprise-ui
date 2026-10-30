import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface SiteRecord {
  name: string;
  description: string;
  enterprise: string;
  isRemote: boolean;
  state: RecordState;
}

export interface SiteDetail extends SiteRecord {
  dataGroup: string;
  remoteExportAddress: string;
  facilities: string[];
}

export type SiteListParams = ListQueryParams;

export function listSites(params: SiteListParams): Promise<Page<SiteRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<SiteRecord>>(`/business-data/sites?${search.toString()}`);
}

export function useSites(params: SiteListParams) {
  return useQuery({
    queryKey: ["business-data", "sites", params],
    queryFn: () => listSites(params),
    placeholderData: keepPreviousData,
  });
}

export function getSite(name: string): Promise<SiteDetail> {
  return apiFetch<SiteDetail>(`/business-data/sites/${encodeURIComponent(name)}`);
}

export function useSiteDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "site", name],
    queryFn: () => getSite(name),
  });
}
