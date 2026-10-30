import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
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
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<PlanRecord>>(`/business-data/plans?${search.toString()}`);
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
