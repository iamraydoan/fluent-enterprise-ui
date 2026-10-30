import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface MaintenancePlanRecord {
  name: string;
  description: string;
  type: string;
  scope: string;
  state: RecordState;
}

export interface MaintenanceActivity {
  name: string;
  description: string;
  type: string;
  scheduleType: string;
  expectedDurationHours: number;
  executionRole: string;
  requestApprovalMode: string;
  maintenanceType: string;
  materialTypeRestrictionMode: string;
  orderReleaseMode: string;
  acceptanceMode: string;
  ignoreInScheduling: boolean;
  autoDisableAfterLateDue: boolean;
  postMaintenanceActivity: string;
}

export interface MaintenancePlanDetail extends MaintenancePlanRecord {
  dataGroup: string;
  activities: MaintenanceActivity[];
}

export function listMaintenancePlans(
  params: ListQueryParams,
): Promise<Page<MaintenancePlanRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<MaintenancePlanRecord>>(`/maintenance-plans?${search.toString()}`);
}

export function useMaintenancePlans(params: ListQueryParams) {
  return useQuery({
    queryKey: ["maintenance-plans", params],
    queryFn: () => listMaintenancePlans(params),
    placeholderData: keepPreviousData,
  });
}

export function getMaintenancePlan(name: string): Promise<MaintenancePlanDetail> {
  return apiFetch<MaintenancePlanDetail>(`/maintenance-plans/${encodeURIComponent(name)}`);
}

export function useMaintenancePlanDetail(name: string) {
  return useQuery({
    queryKey: ["maintenance-plan", name],
    queryFn: () => getMaintenancePlan(name),
  });
}
