import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { toListSearchParams } from "@/lib/listQuery";
import { apiFetch } from "./client";
import type { Page } from "./types";

export interface ConfigurationEntry {
  path: string;
  value: string;
  type: string;
  referenceName: string;
  description: string;
  confidential: boolean;
  userConfig: boolean;
  createdBy: string;
  modifiedBy: string;
  createdOn: number;
  modifiedOn: number;
}

export type ConfigurationListParams = ListQueryParams;

export function listConfigurations(
  params: ConfigurationListParams,
): Promise<Page<ConfigurationEntry>> {
  const search = toListSearchParams(params);
  return apiFetch<Page<ConfigurationEntry>>(`/configurations?${search.toString()}`);
}

export function useConfigurations(params: ConfigurationListParams) {
  return useQuery({
    queryKey: ["configurations", params],
    queryFn: () => listConfigurations(params),
    placeholderData: keepPreviousData,
  });
}

export function getConfiguration(path: string): Promise<ConfigurationEntry> {
  return apiFetch<ConfigurationEntry>(`/configurations/${encodeURIComponent(path)}`);
}

export function useConfiguration(path: string) {
  return useQuery({
    queryKey: ["configuration", path],
    queryFn: () => getConfiguration(path),
  });
}

export function listConfigurationTree(): Promise<string[]> {
  return apiFetch<string[]>(`/configurations/tree`);
}

export function useConfigurationTree() {
  return useQuery({
    queryKey: ["configuration-tree"],
    queryFn: listConfigurationTree,
  });
}
