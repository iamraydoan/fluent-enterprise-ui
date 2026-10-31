import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { toListSearchParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "./client";

export type UIPageType = "Cluster" | "Page" | "Step" | "Wizard";
export type UIPageScope = "General" | "EntityType" | "MenuEntry" | "Workspace";

export interface UIPageRecord {
  name: string;
  description: string;
  type: UIPageType;
  scope: UIPageScope;
  folder: string;
  section: string;
  entityType: string;
  isSystem: boolean;
  state: RecordState;
}

export interface UIPageFolder {
  name: string;
  path: string;
}

export interface UIPageListParams {
  folder?: string;
  scope?: string;
  section?: string;
  entityType?: string;
  q?: string;
  showTerminated?: boolean;
  showSystemItems?: boolean;
}

export function listUIPages(params: UIPageListParams): Promise<UIPageRecord[]> {
  const search = toListSearchParams(params);
  return apiFetch<UIPageRecord[]>(`/ui-pages?${search.toString()}`);
}

export function useUIPages(params: UIPageListParams) {
  return useQuery({
    queryKey: ["ui-pages", params],
    queryFn: () => listUIPages(params),
    placeholderData: keepPreviousData,
  });
}

export function listUIPageFolders(): Promise<UIPageFolder[]> {
  return apiFetch<UIPageFolder[]>("/ui-page-folders");
}

export function useUIPageFolders() {
  return useQuery({ queryKey: ["ui-page-folders"], queryFn: listUIPageFolders });
}
