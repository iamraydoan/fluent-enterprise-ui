import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface SubstrateMapRecord {
  name: string;
  description: string;
  substrateType: string;
  state: RecordState;
}

export interface SubstrateMapOverlay {
  name: string;
  type: string;
  version: string;
  isActive: boolean;
}

export interface SubstrateMapDetail extends SubstrateMapRecord {
  dataGroup: string;
  overlays: SubstrateMapOverlay[];
}

export type SubstrateMapListParams = ListQueryParams;

export function listSubstrateMaps(params: SubstrateMapListParams): Promise<Page<SubstrateMapRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<SubstrateMapRecord>>(`/business-data/substrate-maps?${search.toString()}`);
}

export function useSubstrateMaps(params: SubstrateMapListParams) {
  return useQuery({
    queryKey: ["business-data", "substrate-maps", params],
    queryFn: () => listSubstrateMaps(params),
    placeholderData: keepPreviousData,
  });
}

export function getSubstrateMap(name: string): Promise<SubstrateMapDetail> {
  return apiFetch<SubstrateMapDetail>(`/business-data/substrate-maps/${encodeURIComponent(name)}`);
}

export function useSubstrateMapDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "substrate-map", name],
    queryFn: () => getSubstrateMap(name),
  });
}
