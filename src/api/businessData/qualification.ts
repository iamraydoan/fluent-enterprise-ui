import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";

export interface QualificationRecord {
  name: string;
  description: string;
  type: string;
  state: RecordState;
}

export interface QualificationDetail extends QualificationRecord {
  dataGroup: string;
  ownerRole: string;
  defaultReason: string;
  informationUrl: string;
  allowSelfAssignment: boolean;
  allowAssignmentByManager: boolean;
  validFor: string;
  allowOverride: boolean;
  gracePeriodDuration: string;
}

export interface QualificationListParams {
  q?: string;
  state?: string;
}

export function listQualifications(
  params: QualificationListParams,
): Promise<QualificationRecord[]> {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.state) search.set("state", params.state);
  return apiFetch<QualificationRecord[]>(`/business-data/qualifications?${search.toString()}`);
}

export function useQualifications(params: QualificationListParams) {
  return useQuery({
    queryKey: ["business-data", "qualifications", params],
    queryFn: () => listQualifications(params),
    placeholderData: keepPreviousData,
  });
}

export function getQualification(name: string): Promise<QualificationDetail> {
  return apiFetch<QualificationDetail>(`/business-data/qualifications/${encodeURIComponent(name)}`);
}

export function useQualificationDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "qualification", name],
    queryFn: () => getQualification(name),
  });
}
