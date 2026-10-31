import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { toListSearchParams } from "@/lib/listQuery";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface PlanRecord {
  name: string;
  description: string;
  type: string;
  state: string;
  startDate: string;
}

export interface PlanDetail extends PlanRecord {
  detailNote?: string;
}

export function listPlans(params: ListQueryParams): Promise<Page<PlanRecord>> {
  return apiFetch<Page<PlanRecord>>(`/business-data/plans?${toListSearchParams(params)}`);
}

export function usePlans(params: ListQueryParams) {
  return useQuery({
    queryKey: ["business-data", "plans", params],
    queryFn: () => listPlans(params),
    placeholderData: keepPreviousData,
  });
}

export function getPlan(name: string): Promise<PlanDetail> {
  return apiFetch<PlanDetail>(`/business-data/plans/${encodeURIComponent(name)}`);
}

export function usePlanDetail(name: string) {
  return useQuery({ queryKey: ["business-data", "plan", name], queryFn: () => getPlan(name) });
}
