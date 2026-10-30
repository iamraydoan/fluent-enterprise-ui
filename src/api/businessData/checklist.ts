import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/api/client";
import type { Page } from "@/api/types";
import type { ListQueryParams } from "@/lib/listQuery";

export interface ChecklistRecord {
  name: string;
  description: string;
  scope: string;
  executionMode: string;
  state: string;
}

export interface ChecklistItem {
  name: string;
  description: string;
  activityType: string;
  trackingType: string;
  standardDuration: string;
  optional: boolean;
  floating: boolean;
}

export interface ChecklistInstance {
  name: string;
  state: string;
}

export interface ChecklistDetail extends ChecklistRecord {
  type: string;
  universalState: string;
  dataGroup: string;
  bom: string;
  product: string;
  materialDeviationProtocol: string;
  defineStandardTimes: boolean;
  trackExecutionTimes: boolean;
  standardDuration: string;
  items: ChecklistItem[];
  instances: ChecklistInstance[];
}

export function useChecklists(params: ListQueryParams) {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return useQuery<Page<ChecklistRecord>>({
    queryKey: ["business-data", "checklists", params],
    queryFn: () => apiFetch<Page<ChecklistRecord>>(`/business-data/checklists?${search.toString()}`),
    placeholderData: keepPreviousData,
  });
}

export function useChecklistDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "checklists", name],
    queryFn: () => apiFetch<ChecklistDetail>(`/business-data/checklists/${encodeURIComponent(name)}`),
  });
}
