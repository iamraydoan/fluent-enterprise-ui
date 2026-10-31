import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { toListSearchParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface SubstrateMapMaskRecord {
  name: string;
  description: string;
  substrateType: string;
  state: RecordState;
}

export interface SubstrateMapMaskDetail extends SubstrateMapMaskRecord {
  dataGroup: string;
}

export type SubstrateMapMaskListParams = ListQueryParams;

export function listSubstrateMapMasks(
  params: SubstrateMapMaskListParams,
): Promise<Page<SubstrateMapMaskRecord>> {
  const search = toListSearchParams(params);
  return apiFetch<Page<SubstrateMapMaskRecord>>(
    `/business-data/substrate-map-masks?${search.toString()}`,
  );
}

export function useSubstrateMapMasks(params: SubstrateMapMaskListParams) {
  return useQuery({
    queryKey: ["business-data", "substrate-map-masks", params],
    queryFn: () => listSubstrateMapMasks(params),
    placeholderData: keepPreviousData,
  });
}

export function getSubstrateMapMask(name: string): Promise<SubstrateMapMaskDetail> {
  return apiFetch<SubstrateMapMaskDetail>(
    `/business-data/substrate-map-masks/${encodeURIComponent(name)}`,
  );
}

export function useSubstrateMapMaskDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "substrate-map-mask", name],
    queryFn: () => getSubstrateMapMask(name),
  });
}
