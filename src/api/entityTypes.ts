import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "./client";
import type { Page } from "./types";

export interface EntityTypeRecord {
  id: string;
  name: string;
  description: string;
  system: boolean;
  versioned: boolean;
  isRelation: boolean;
  state: RecordState;
  lockType: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntityTypeListParams extends ListQueryParams {
  isRelation?: boolean;
}

export function listEntityTypes(params: EntityTypeListParams): Promise<Page<EntityTypeRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.sort) search.set("sort", params.sort);
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
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
