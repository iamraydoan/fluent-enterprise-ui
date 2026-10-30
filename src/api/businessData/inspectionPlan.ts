import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface InspectionPlanRecord {
  name: string;
  description: string;
  type: string;
  state: RecordState;
}

export interface InspectionPlanDetail extends InspectionPlanRecord {
  dataGroup: string;
  resultsRequiredBeforeTrackOut: boolean;
  enableMultipleSamples: boolean;
  containsSeparateInspectionSteps: boolean;
  closeAutomaticallyOnPass: boolean;
  closeAutomaticallyOnFail: boolean;
  openProtocolOnFail: boolean;
  protocol: string;
  futureHoldCreationMode: string;
  setHoldOnFail: boolean;
  futureHoldStep: string;
  futureHoldReason: string;
  futureHoldReleaseRole: string;
  futureHoldComment: string;
  futureHoldDistributionList: string;
  holdReason: string;
  holdReleaseRole: string;
  holdComment: string;
}

export function listInspectionPlans(params: ListQueryParams): Promise<Page<InspectionPlanRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<InspectionPlanRecord>>(`/inspection-plans?${search.toString()}`);
}

export function useInspectionPlans(params: ListQueryParams) {
  return useQuery({
    queryKey: ["inspection-plans", params],
    queryFn: () => listInspectionPlans(params),
    placeholderData: keepPreviousData,
  });
}

export function getInspectionPlan(name: string): Promise<InspectionPlanDetail> {
  return apiFetch<InspectionPlanDetail>(`/inspection-plans/${encodeURIComponent(name)}`);
}

export function useInspectionPlanDetail(name: string) {
  return useQuery({
    queryKey: ["inspection-plan", name],
    queryFn: () => getInspectionPlan(name),
  });
}
