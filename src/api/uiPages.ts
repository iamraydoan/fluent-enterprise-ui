import { keepPreviousData, useQuery } from "@tanstack/react-query";
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
  const search = new URLSearchParams();
  if (params.folder) search.set("folder", params.folder);
  if (params.scope) search.set("scope", params.scope);
  if (params.section) search.set("section", params.section);
  if (params.entityType) search.set("entityType", params.entityType);
  if (params.q) search.set("q", params.q);
  if (params.showTerminated) search.set("showTerminated", "true");
  if (params.showSystemItems) search.set("showSystemItems", "true");
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
