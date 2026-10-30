import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/api/client";
import type { Page } from "@/api/types";
import type { ListQueryParams } from "@/lib/listQuery";

export interface ContainerRecord {
  name: string;
  description: string;
  type: string;
  systemState: string;
  state: string;
}

export interface ContainerMaterial {
  position: number;
  material: string;
  product: string;
  step: string;
  quantity: string;
}

export interface ContainerPosition {
  position: number;
  material: string;
  product: string;
  step: string;
  quantity: number;
  unit: string;
}

export interface ContainerDetail extends ContainerRecord {
  universalState: string;
  dataGroup: string;
  facility: string;
  parent: string;
  onHold: boolean;
  positionUnitType: string;
  allowMixedTypes: boolean;
  usedPositions: number;
  totalPositions: number;
  capacityValidationMode: string;
  capacityUnit: string;
  capacityPerPosition: number;
  positionSorting: string;
  materials: ContainerMaterial[];
  positions: ContainerPosition[];
}

export function useContainers(params: ListQueryParams) {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return useQuery<Page<ContainerRecord>>({
    queryKey: ["business-data", "containers", params],
    queryFn: () => apiFetch<Page<ContainerRecord>>(`/business-data/containers?${search.toString()}`),
    placeholderData: keepPreviousData,
  });
}

export function useContainerDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "containers", name],
    queryFn: () => apiFetch<ContainerDetail>(`/business-data/containers/${encodeURIComponent(name)}`),
  });
}
