import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "./client";
import type { Page } from "./types";

export interface FabLiveRecord {
  name: string;
  description: string;
  folder: string;
  state: RecordState;
}

export interface FabLiveDetail extends FabLiveRecord {
  dataGroup: string;
}

export type FabLiveListParams = ListQueryParams;

export function listFabLives(params: FabLiveListParams): Promise<Page<FabLiveRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<FabLiveRecord>>(`/manufacturing/fab-lives?${search.toString()}`);
}

export function useFabLives(params: FabLiveListParams) {
  return useQuery({
    queryKey: ["manufacturing", "fab-lives", params],
    queryFn: () => listFabLives(params),
    placeholderData: keepPreviousData,
  });
}

export function getFabLive(name: string): Promise<FabLiveDetail> {
  return apiFetch<FabLiveDetail>(`/manufacturing/fab-lives/${encodeURIComponent(name)}`);
}

export function useFabLiveDetail(name: string) {
  return useQuery({
    queryKey: ["manufacturing", "fab-live", name],
    queryFn: () => getFabLive(name),
  });
}
