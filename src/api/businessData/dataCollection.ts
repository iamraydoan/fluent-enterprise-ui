import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/api/client";
import type { Page } from "@/api/types";
import type { ListQueryParams } from "@/lib/listQuery";

export interface DataCollectionRecord {
  name: string;
  description: string;
  scope: string;
  state: string;
}

export interface DataCollectionParameter {
  parameter: string;
  dataType: string;
  isOptional: boolean;
  minimumSamples: number;
  maximumSamples: number;
  minimumSampleReadings: number;
  maximumSampleReadings: number;
  limitChecking: string;
}

export interface DataCollectionLimitSetRef {
  name: string;
}

export interface DataCollectionInstance {
  name: string;
  state: string;
}

export interface DataCollectionDetail extends DataCollectionRecord {
  type: string;
  universalState: string;
  dataGroup: string;
  changeSet: string;
  userInterface: string;
  limitCheckingMode: string;
  parameters: DataCollectionParameter[];
  limitSets: DataCollectionLimitSetRef[];
  instances: DataCollectionInstance[];
}

export function useDataCollections(params: ListQueryParams) {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return useQuery<Page<DataCollectionRecord>>({
    queryKey: ["business-data", "data-collections", params],
    queryFn: () => apiFetch<Page<DataCollectionRecord>>(`/business-data/data-collections?${search.toString()}`),
    placeholderData: keepPreviousData,
  });
}

export function useDataCollectionDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "data-collections", name],
    queryFn: () => apiFetch<DataCollectionDetail>(`/business-data/data-collections/${encodeURIComponent(name)}`),
  });
}
