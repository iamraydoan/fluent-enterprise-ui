import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { toListSearchParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";

export interface ServiceRecord {
  name: string;
  description: string;
  type: string;
  enabled: boolean;
  state: RecordState;
}

export interface ServiceDetail extends ServiceRecord {
  dataGroup: string;
  processingType: string;
}

export interface ServiceListParams {
  q?: string;
  state?: string;
}

export function listServices(params: ServiceListParams): Promise<ServiceRecord[]> {
  return apiFetch<ServiceRecord[]>(`/business-data/services?${toListSearchParams(params)}`);
}

export function useServices(params: ServiceListParams) {
  return useQuery({
    queryKey: ["business-data", "services", params],
    queryFn: () => listServices(params),
    placeholderData: keepPreviousData,
  });
}

export function getService(name: string): Promise<ServiceDetail> {
  return apiFetch<ServiceDetail>(`/business-data/services/${encodeURIComponent(name)}`);
}

export function useServiceDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "service", name],
    queryFn: () => getService(name),
  });
}
