import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { toListSearchParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "./client";
import type { Page } from "./types";

export enum AppType {
  System = "System",
  UserDefined = "User defined",
}

export interface AppRecord {
  name: string;
  description: string;
  type: AppType;
  state: RecordState;
}

export type AppListParams = ListQueryParams;

export function listApps(params: AppListParams): Promise<Page<AppRecord>> {
  return apiFetch<Page<AppRecord>>(`/apps?${toListSearchParams(params)}`);
}

export function useApps(params: AppListParams) {
  return useQuery({
    queryKey: ["apps", params],
    queryFn: () => listApps(params),
    placeholderData: keepPreviousData,
  });
}
