import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";

export type ResourceJobSystemState =
  "Created" | "Queued" | "Executing" | "Completed" | "Canceled" | "Abort";

export interface ResourceJobRecord {
  name: string;
  description: string;
  resource: string;
  type: string;
  systemState: ResourceJobSystemState;
  state: RecordState;
  priority: number;
  progress: number;
}

export interface ResourceJobDetail extends ResourceJobRecord {
  dataGroup: string;
  subType: string;
  selectionMode: string;
  equipmentJobId: string;
  jobInformation: string;
}

export interface ResourceJobListParams {
  q?: string;
  state?: string;
}

export function listResourceJobs(params: ResourceJobListParams): Promise<ResourceJobRecord[]> {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.state) search.set("state", params.state);
  return apiFetch<ResourceJobRecord[]>(`/business-data/resource-jobs?${search.toString()}`);
}

export function useResourceJobs(params: ResourceJobListParams) {
  return useQuery({
    queryKey: ["business-data", "resource-jobs", params],
    queryFn: () => listResourceJobs(params),
    placeholderData: keepPreviousData,
  });
}

export function getResourceJob(name: string): Promise<ResourceJobDetail> {
  return apiFetch<ResourceJobDetail>(`/business-data/resource-jobs/${encodeURIComponent(name)}`);
}

export function useResourceJobDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "resource-job", name],
    queryFn: () => getResourceJob(name),
  });
}
