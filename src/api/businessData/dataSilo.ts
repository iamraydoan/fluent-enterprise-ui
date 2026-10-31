import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { toListSearchParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface DataSiloRecord {
  name: string;
  description: string;
  type: string;
  enterpriseName: string;
  siteName: string;
  state: RecordState;
}

export interface DataSiloDetail extends DataSiloRecord {
  dataVersion: string;
  facilityName: string;
  isExternal: boolean;
  isObsolete: boolean;
  isSystem: boolean;
  isTemplate: boolean;
  keywords: string;
  ownerInstance: string;
  user: string;
}

export function listDataSilos(params: ListQueryParams): Promise<Page<DataSiloRecord>> {
  return apiFetch<Page<DataSiloRecord>>(`/data-silos?${toListSearchParams(params)}`);
}

export function useDataSilos(params: ListQueryParams) {
  return useQuery({
    queryKey: ["data-silos", params],
    queryFn: () => listDataSilos(params),
    placeholderData: keepPreviousData,
  });
}

export function getDataSilo(name: string): Promise<DataSiloDetail> {
  return apiFetch<DataSiloDetail>(`/data-silos/${encodeURIComponent(name)}`);
}

export function useDataSiloDetail(name: string) {
  return useQuery({
    queryKey: ["data-silo", name],
    queryFn: () => getDataSilo(name),
  });
}
