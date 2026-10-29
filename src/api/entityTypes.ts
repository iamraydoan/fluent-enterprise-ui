import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type { Page } from "./types";

export type EntityTypeState = "Active" | "Terminated";

export interface EntityTypeRecord {
  id: string;
  name: string;
  description: string;
  system: boolean;
  versioned: boolean;
  isRelation: boolean;
  state: EntityTypeState;
  lockType: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntityTypeListParams {
  page: number;
  limit: number;
  sort?: string;
  q?: string;
  state?: string;
  isRelation?: boolean;
}

export function listEntityTypes(params: EntityTypeListParams): Promise<Page<EntityTypeRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.sort) search.set("sort", params.sort);
  if (params.q) search.set("q", params.q);
  if (params.state) search.set("state", params.state);
  if (params.isRelation !== undefined) search.set("isRelation", String(params.isRelation));
  return apiFetch<Page<EntityTypeRecord>>(`/entity-types?${search.toString()}`);
}

export function useEntityTypes(params: EntityTypeListParams) {
  return useQuery({
    queryKey: ["entity-types", params],
    queryFn: () => listEntityTypes(params),
    placeholderData: keepPreviousData,
  });
}
