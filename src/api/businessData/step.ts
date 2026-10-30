import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface StepRecord {
  name: string;
  description: string;
  state: RecordState;
}

export interface StepDetail extends StepRecord {
  dataGroup: string;
  includeInScheduling: boolean;
  logicalNames: string[];
  areas: string[];
  reasons: string[];
}

export type StepListParams = ListQueryParams;

export function listSteps(params: StepListParams): Promise<Page<StepRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<StepRecord>>(`/business-data/steps?${search.toString()}`);
}

export function useSteps(params: StepListParams) {
  return useQuery({
    queryKey: ["business-data", "steps", params],
    queryFn: () => listSteps(params),
    placeholderData: keepPreviousData,
  });
}

export function getStep(name: string): Promise<StepDetail> {
  return apiFetch<StepDetail>(`/business-data/steps/${encodeURIComponent(name)}`);
}

export function useStepDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "step", name],
    queryFn: () => getStep(name),
  });
}
