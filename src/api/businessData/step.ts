import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { toListSearchParams } from "@/lib/listQuery";
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
  return apiFetch<Page<StepRecord>>(`/business-data/steps?${toListSearchParams(params)}`);
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
