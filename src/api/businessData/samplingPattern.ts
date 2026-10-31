import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { toListSearchParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";

export type SamplingPatternMode = "Manual" | "Rule" | "System";

export interface SamplingPatternRecord {
  name: string;
  description: string;
  type: string;
  mode: SamplingPatternMode;
  state: RecordState;
}

export interface SamplingPatternDetail extends SamplingPatternRecord {
  dataGroup: string;
  samplingSelection: string;
  rule: string;
  sourceForm: string;
  materialCount: number;
  countIsPercentage: boolean;
  selectionMethod: string;
  sequencingMethod: string;
}

export interface SamplingPatternListParams {
  q?: string;
  state?: string;
}

export function listSamplingPatterns(
  params: SamplingPatternListParams,
): Promise<SamplingPatternRecord[]> {
  const search = toListSearchParams(params);
  return apiFetch<SamplingPatternRecord[]>(`/business-data/sampling-patterns?${search.toString()}`);
}

export function useSamplingPatterns(params: SamplingPatternListParams) {
  return useQuery({
    queryKey: ["business-data", "sampling-patterns", params],
    queryFn: () => listSamplingPatterns(params),
    placeholderData: keepPreviousData,
  });
}

export function getSamplingPattern(name: string): Promise<SamplingPatternDetail> {
  return apiFetch<SamplingPatternDetail>(
    `/business-data/sampling-patterns/${encodeURIComponent(name)}`,
  );
}

export function useSamplingPatternDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "sampling-pattern", name],
    queryFn: () => getSamplingPattern(name),
  });
}
