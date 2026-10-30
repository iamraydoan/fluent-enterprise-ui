import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";

export type SamplingPlanType = "CounterBased" | "CounterAndTimeBased" | "TimeBased";

export interface SamplingPlanRecord {
  name: string;
  description: string;
  type: string;
  defaultSamplingType: SamplingPlanType;
  state: RecordState;
}

export interface SamplingPlanDetail extends SamplingPlanRecord {
  dataGroup: string;
  counterFrequency: number;
  timeFrequency: number;
}

export interface SamplingPlanListParams {
  q?: string;
  state?: string;
}

export function listSamplingPlans(params: SamplingPlanListParams): Promise<SamplingPlanRecord[]> {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.state) search.set("state", params.state);
  return apiFetch<SamplingPlanRecord[]>(`/business-data/sampling-plans?${search.toString()}`);
}

export function useSamplingPlans(params: SamplingPlanListParams) {
  return useQuery({
    queryKey: ["business-data", "sampling-plans", params],
    queryFn: () => listSamplingPlans(params),
    placeholderData: keepPreviousData,
  });
}

export function getSamplingPlan(name: string): Promise<SamplingPlanDetail> {
  return apiFetch<SamplingPlanDetail>(`/business-data/sampling-plans/${encodeURIComponent(name)}`);
}

export function useSamplingPlanDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "sampling-plan", name],
    queryFn: () => getSamplingPlan(name),
  });
}
