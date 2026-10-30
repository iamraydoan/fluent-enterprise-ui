import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface KpiRecord {
  name: string;
  description: string;
  type: string;
  state: RecordState;
}

export interface KpiDetail extends KpiRecord {
  dataGroup: string;
  sourceType: string;
  entityType: string;
  parameter: string;
  kpiType: string;
  frequency: string;
  ownerRole: string;
  closeToTargetMinimumValue: number;
  inTargetMinimumValue: number;
  targetValue: number;
}

export function listKpis(params: ListQueryParams): Promise<Page<KpiRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<KpiRecord>>(`/kpis?${search.toString()}`);
}

export function useKpis(params: ListQueryParams) {
  return useQuery({
    queryKey: ["kpis", params],
    queryFn: () => listKpis(params),
    placeholderData: keepPreviousData,
  });
}

export function getKpi(name: string): Promise<KpiDetail> {
  return apiFetch<KpiDetail>(`/kpis/${encodeURIComponent(name)}`);
}

export function useKpiDetail(name: string) {
  return useQuery({ queryKey: ["kpi", name], queryFn: () => getKpi(name) });
}
