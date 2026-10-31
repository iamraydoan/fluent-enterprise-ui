import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { toListSearchParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface ShiftPlanRecord {
  name: string;
  description: string;
  type: string;
  calendar: string;
  state: RecordState;
}

export interface ShiftPlanWorkgroup {
  name: string;
  description: string;
  ownerRole: string;
  resources: string[];
  personnelRequirements: { position: string; quantity: number }[];
}

export interface ShiftPlanEmployee {
  name: string;
  team: string;
  workgroup: string;
  position: string;
}

export interface ShiftPlanDetail extends ShiftPlanRecord {
  dataGroup: string;
  ownerRole: string;
  workgroups: ShiftPlanWorkgroup[];
  employees: ShiftPlanEmployee[];
}

export type ShiftPlanListParams = ListQueryParams;

export function listShiftPlans(params: ShiftPlanListParams): Promise<Page<ShiftPlanRecord>> {
  return apiFetch<Page<ShiftPlanRecord>>(
    `/business-data/shift-plans?${toListSearchParams(params)}`,
  );
}

export function useShiftPlans(params: ShiftPlanListParams) {
  return useQuery({
    queryKey: ["business-data", "shift-plans", params],
    queryFn: () => listShiftPlans(params),
    placeholderData: keepPreviousData,
  });
}

export function getShiftPlan(name: string): Promise<ShiftPlanDetail> {
  return apiFetch<ShiftPlanDetail>(`/business-data/shift-plans/${encodeURIComponent(name)}`);
}

export function useShiftPlanDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "shift-plan", name],
    queryFn: () => getShiftPlan(name),
  });
}
