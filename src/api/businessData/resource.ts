import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { toListSearchParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";

export type ResourceProcessingType =
  | "Component"
  | "Consumable Feed"
  | "Instrument"
  | "Line"
  | "Load Port"
  | "Process"
  | "Storage"
  | "Transport";

export interface ResourceRecord {
  name: string;
  description: string;
  type: string;
  processingType: ResourceProcessingType;
  state: RecordState;
  systemState: string;
  automationMode: string;
}

export interface ResourceDetail extends ResourceRecord {
  dataGroup: string;
  area: string;
  priority: number;
  displayOrder: number;
  vendor: string;
  model: string;
  modelRevision: string;
  serialNumber: string;
  criticality: string;
  installationDate: string;
  yearBuilt: number;
  stateModel: string;
  resourceState: string;
  runningMode: string;
  instrumentMode: string;
}

export interface ResourceListParams {
  q?: string;
  state?: string;
}

export function listResources(params: ResourceListParams): Promise<ResourceRecord[]> {
  return apiFetch<ResourceRecord[]>(`/business-data/resources?${toListSearchParams(params)}`);
}

export function useResources(params: ResourceListParams) {
  return useQuery({
    queryKey: ["business-data", "resources", params],
    queryFn: () => listResources(params),
    placeholderData: keepPreviousData,
  });
}

export function getResource(name: string): Promise<ResourceDetail> {
  return apiFetch<ResourceDetail>(`/business-data/resources/${encodeURIComponent(name)}`);
}

export function useResourceDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "resource", name],
    queryFn: () => getResource(name),
  });
}
