import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/api/client";
import type { Page } from "@/api/types";
import type { ListQueryParams } from "@/lib/listQuery";

export interface DataCollectionLimitSetRecord {
  name: string;
  description: string;
  dataCollection: string;
  state: string;
}

export interface ParameterLimit {
  parameter: string;
  overrideParameter: boolean;
  includeSampleLimits: boolean;
  minValue: string;
  maxValue: string;
  limitType: string;
  lowerErrorLimit: string;
  lowerWarningLimit: string;
  target: string;
  upperWarningLimit: string;
  upperErrorLimit: string;
}

export interface DataCollectionLimitSetDetail extends DataCollectionLimitSetRecord {
  type: string;
  universalState: string;
  dataGroup: string;
  parameterLimits: ParameterLimit[];
}

export function useDataCollectionLimitSets(params: ListQueryParams) {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return useQuery<Page<DataCollectionLimitSetRecord>>({
    queryKey: ["business-data", "data-collection-limit-sets", params],
    queryFn: () => apiFetch<Page<DataCollectionLimitSetRecord>>(`/business-data/data-collection-limit-sets?${search.toString()}`),
    placeholderData: keepPreviousData,
  });
}

export function useDataCollectionLimitSetDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "data-collection-limit-sets", name],
    queryFn: () => apiFetch<DataCollectionLimitSetDetail>(`/business-data/data-collection-limit-sets/${encodeURIComponent(name)}`),
  });
}
