import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "./client";
import type { Page } from "./types";

export interface AppRecord {
  name: string;
  description: string;
  type: string;
  state: RecordState;
}

export type AppListParams = ListQueryParams;

export function listApps(params: AppListParams): Promise<Page<AppRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.sort) search.set("sort", params.sort);
  if (params.filters?.q) search.set("q", params.filters.q);
  return apiFetch<Page<AppRecord>>(`/apps?${search.toString()}`);
}

export function useApps(params: AppListParams) {
  return useQuery({
    queryKey: ["apps", params],
    queryFn: () => listApps(params),
    placeholderData: keepPreviousData,
  });
}
