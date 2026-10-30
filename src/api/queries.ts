import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiFetch } from "./client";

export interface QueryRecord {
  name: string;
  description: string;
  entityType: string;
  folder: string;
  isPrivate: boolean;
  isSystem: boolean;
  modifiedBy: string;
  modifiedOn: number;
}

export interface QueryFilter {
  property: string;
  operator: string;
  value: string;
  isParameter: boolean;
  isOptional: boolean;
}

export interface QueryDetail extends QueryRecord {
  filters: QueryFilter[];
  columns: string[];
  results: Record<string, unknown>[];
}

export interface QueryFolder {
  name: string;
  path: string;
}

export interface QueryListParams {
  folder?: string;
  q?: string;
  showSystemItems?: boolean;
}

export function listQueries(params: QueryListParams): Promise<QueryRecord[]> {
  const search = new URLSearchParams();
  if (params.folder) search.set("folder", params.folder);
  if (params.q) search.set("q", params.q);
  if (params.showSystemItems) search.set("showSystemItems", "true");
  return apiFetch<QueryRecord[]>(`/queries?${search.toString()}`);
}

export function useQueries(params: QueryListParams) {
  return useQuery({
    queryKey: ["queries", params],
    queryFn: () => listQueries(params),
    placeholderData: keepPreviousData,
  });
}

export function getQuery(name: string): Promise<QueryDetail> {
  return apiFetch<QueryDetail>(`/queries/${encodeURIComponent(name)}`);
}

export function useQueryDetail(name: string) {
  return useQuery({ queryKey: ["query", name], queryFn: () => getQuery(name) });
}

export function listQueryFolders(): Promise<QueryFolder[]> {
  return apiFetch<QueryFolder[]>("/query-folders");
}

export function useQueryFolders() {
  return useQuery({ queryKey: ["query-folders"], queryFn: listQueryFolders });
}
