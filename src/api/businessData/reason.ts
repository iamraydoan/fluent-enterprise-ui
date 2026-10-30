import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";

export type ReasonType = "Bonus" | "Defect" | "Hold" | "Loss" | "Off Flow" | "Pause";

export interface ReasonRecord {
  name: string;
  description: string;
  type: ReasonType;
  state: RecordState;
}

export interface ReasonDetail extends ReasonRecord {
  dataGroup: string;
  excludeFromStepYield: boolean;
  excludeFromResourceYield: boolean;
}

export interface ReasonListParams {
  q?: string;
  state?: string;
}

export function listReasons(params: ReasonListParams): Promise<ReasonRecord[]> {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.state) search.set("state", params.state);
  return apiFetch<ReasonRecord[]>(`/business-data/reasons?${search.toString()}`);
}

export function useReasons(params: ReasonListParams) {
  return useQuery({
    queryKey: ["business-data", "reasons", params],
    queryFn: () => listReasons(params),
    placeholderData: keepPreviousData,
  });
}

export function getReason(name: string): Promise<ReasonDetail> {
  return apiFetch<ReasonDetail>(`/business-data/reasons/${encodeURIComponent(name)}`);
}

export function useReasonDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "reason", name],
    queryFn: () => getReason(name),
  });
}
