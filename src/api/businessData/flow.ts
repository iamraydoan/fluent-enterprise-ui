import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { toListSearchParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface FlowRecord {
  name: string;
  description: string;
  type: string;
  flowType: string;
  state: RecordState;
}

export interface FlowItem {
  position: number;
  name: string;
  itemType: "Step" | "Flow";
  logicalName: string;
  isOptional: boolean;
  hasRework: boolean;
}

export interface FlowDetail extends FlowRecord {
  dataGroup: string;
  enabled: boolean;
  items: FlowItem[];
}

export function listFlows(params: ListQueryParams): Promise<Page<FlowRecord>> {
  return apiFetch<Page<FlowRecord>>(`/flows?${toListSearchParams(params)}`);
}

export function useFlows(params: ListQueryParams) {
  return useQuery({
    queryKey: ["flows", params],
    queryFn: () => listFlows(params),
    placeholderData: keepPreviousData,
  });
}

export function getFlow(name: string): Promise<FlowDetail> {
  return apiFetch<FlowDetail>(`/flows/${encodeURIComponent(name)}`);
}

export function useFlowDetail(name: string) {
  return useQuery({ queryKey: ["flow", name], queryFn: () => getFlow(name) });
}
