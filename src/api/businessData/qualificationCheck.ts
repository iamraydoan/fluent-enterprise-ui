import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";

export type QualificationCheckInstanceType = "Single" | "Multiple";

export interface QualificationCheckRecord {
  name: string;
  description: string;
  instanceType: QualificationCheckInstanceType;
  state: RecordState;
}

export interface QualificationCheckDetail extends QualificationCheckRecord {
  dataGroup: string;
}

export interface QualificationCheckListParams {
  q?: string;
  state?: string;
}

export function listQualificationChecks(
  params: QualificationCheckListParams,
): Promise<QualificationCheckRecord[]> {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.state) search.set("state", params.state);
  return apiFetch<QualificationCheckRecord[]>(
    `/business-data/qualification-checks?${search.toString()}`,
  );
}

export function useQualificationChecks(params: QualificationCheckListParams) {
  return useQuery({
    queryKey: ["business-data", "qualification-checks", params],
    queryFn: () => listQualificationChecks(params),
    placeholderData: keepPreviousData,
  });
}

export function getQualificationCheck(name: string): Promise<QualificationCheckDetail> {
  return apiFetch<QualificationCheckDetail>(
    `/business-data/qualification-checks/${encodeURIComponent(name)}`,
  );
}

export function useQualificationCheckDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "qualification-check", name],
    queryFn: () => getQualificationCheck(name),
  });
}
