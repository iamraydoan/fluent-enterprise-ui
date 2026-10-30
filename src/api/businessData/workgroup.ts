import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface WorkgroupRecord {
  name: string;
  description: string;
  scope: string;
  state: RecordState;
}

export interface WorkgroupDetail extends WorkgroupRecord {
  dataGroup: string;
  resources: string[];
  steps: string[];
  areas: string[];
}

export type WorkgroupListParams = ListQueryParams;

export function listWorkgroups(params: WorkgroupListParams): Promise<Page<WorkgroupRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<WorkgroupRecord>>(`/business-data/workgroups?${search.toString()}`);
}

export function useWorkgroups(params: WorkgroupListParams) {
  return useQuery({
    queryKey: ["business-data", "workgroups", params],
    queryFn: () => listWorkgroups(params),
    placeholderData: keepPreviousData,
  });
}

export function getWorkgroup(name: string): Promise<WorkgroupDetail> {
  return apiFetch<WorkgroupDetail>(`/business-data/workgroups/${encodeURIComponent(name)}`);
}

export function useWorkgroupDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "workgroup", name],
    queryFn: () => getWorkgroup(name),
  });
}
