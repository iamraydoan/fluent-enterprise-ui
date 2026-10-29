import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type { Page } from "./types";

export interface ConfigurationRecord {
  setting: string;
  value: string;
  scope: string;
  modified: string;
}

export interface ConfigurationListParams {
  page: number;
  limit: number;
  sort?: string;
  q?: string;
}

export function listConfigurations(
  params: ConfigurationListParams,
): Promise<Page<ConfigurationRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.sort) search.set("sort", params.sort);
  if (params.q) search.set("q", params.q);
  return apiFetch<Page<ConfigurationRecord>>(`/configurations?${search.toString()}`);
}

export function useConfigurations(params: ConfigurationListParams) {
  return useQuery({
    queryKey: ["configurations", params],
    queryFn: () => listConfigurations(params),
    placeholderData: keepPreviousData,
  });
}
