import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiFetch } from "./client";

export type WorkgroupSystemState = "Up" | "Down";

export interface WorkgroupResourceTile {
  name: string;
  facility: string;
  type: string;
  systemState: WorkgroupSystemState;
  dispatched: number;
  inProcess: number;
  processed: number;
}

export interface WorkgroupStepTile {
  name: string;
  facility: string;
  processingType: string;
  type: string;
  materials: number;
  resources: number;
}

export interface MyWorkgroupInfo {
  name: string;
  shiftPlan: string;
}

export interface MyWorkgroupResourceParams {
  workgroup?: string;
  type?: string;
  systemState?: string;
  facility?: string;
  state?: string;
  q?: string;
}

export interface MyWorkgroupStepParams {
  workgroup?: string;
  processingType?: string;
  type?: string;
  facility?: string;
  q?: string;
}

function toSearchParams(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, value);
  }
  return search.toString();
}

export function listMyWorkgroupResources(
  params: MyWorkgroupResourceParams,
): Promise<WorkgroupResourceTile[]> {
  return apiFetch<WorkgroupResourceTile[]>(
    `/my-workgroup/resources?${toSearchParams({ ...params })}`,
  );
}

export function useMyWorkgroupResources(params: MyWorkgroupResourceParams) {
  return useQuery({
    queryKey: ["my-workgroup", "resources", params],
    queryFn: () => listMyWorkgroupResources(params),
    placeholderData: keepPreviousData,
  });
}

export function listMyWorkgroupSteps(params: MyWorkgroupStepParams): Promise<WorkgroupStepTile[]> {
  return apiFetch<WorkgroupStepTile[]>(`/my-workgroup/steps?${toSearchParams({ ...params })}`);
}

export function useMyWorkgroupSteps(params: MyWorkgroupStepParams) {
  return useQuery({
    queryKey: ["my-workgroup", "steps", params],
    queryFn: () => listMyWorkgroupSteps(params),
    placeholderData: keepPreviousData,
  });
}

export function listMyWorkgroups(): Promise<MyWorkgroupInfo[]> {
  return apiFetch<MyWorkgroupInfo[]>(`/my-workgroups`);
}

export function useMyWorkgroups() {
  return useQuery({
    queryKey: ["my-workgroups"],
    queryFn: listMyWorkgroups,
    placeholderData: keepPreviousData,
  });
}
