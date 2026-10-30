import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export type EntityPropertyKind = "Native" | "Custom";
export type PropertySearchType = "Contains" | "StartsWith";

export interface EntityTypeProperty {
  name: string;
  description: string;
  kind: EntityPropertyKind;
  referenceType: string;
  scalarType: string;
  size?: number;
  searchable: boolean;
  searchType?: PropertySearchType;
  enabled: boolean;
  isSystem: boolean;
}

export function getEntityType(name: string): Promise<EntityTypeRecord> {
  return apiFetch<EntityTypeRecord>(`/entity-types/${encodeURIComponent(name)}`);
}

export function useEntityType(name: string) {
  return useQuery({ queryKey: ["entity-type", name], queryFn: () => getEntityType(name) });
}

export function listEntityTypeProperties(name: string): Promise<EntityTypeProperty[]> {
  return apiFetch<EntityTypeProperty[]>(`/entity-types/${encodeURIComponent(name)}/properties`);
}

export function useEntityTypeProperties(name: string) {
  return useQuery({
    queryKey: ["entity-type-properties", name],
    queryFn: () => listEntityTypeProperties(name),
  });
}

export function useUpdateEntityTypeProperties(name: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (properties: EntityTypeProperty[]) =>
      apiFetch<EntityTypeProperty[]>(`/entity-types/${encodeURIComponent(name)}/properties`, {
        method: "PUT",
        body: JSON.stringify(properties),
      }),
    onSuccess: (properties) => {
      queryClient.setQueryData(["entity-type-properties", name], properties);
    },
  });
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
