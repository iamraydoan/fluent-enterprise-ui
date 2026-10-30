import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface MaintenanceActivityOrderRecord {
  name: string;
  description: string;
  type: string;
  executionState: string;
  scheduleType: string;
  state: RecordState;
}

export interface MaintenanceActivityOrderDetail extends MaintenanceActivityOrderRecord {
  dataGroup: string;
  scheduleDate: number;
  requestedBy: string;
  requestDate: number;
  comment: string;
  maintenancePlanInstance: string;
  resource: string;
  ownerRole: string;
  maintenanceActivity: string;
  role: string;
  beginDate: number | null;
  endDate: number | null;
  expectedDuration: string;
  reworkCount: number;
  requestApprovalMode: string;
  maintenanceType: string;
  materialTypeRestrictionMode: string;
  materialType: string;
  orderReleaseMode: string;
  completionAcceptanceMode: string;
  beginAndCompleteMode: string;
  cost: number;
  checklist: string;
}

export function listMaintenanceActivityOrders(
  params: ListQueryParams,
): Promise<Page<MaintenanceActivityOrderRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<MaintenanceActivityOrderRecord>>(
    `/maintenance-activity-orders?${search.toString()}`,
  );
}

export function useMaintenanceActivityOrders(params: ListQueryParams) {
  return useQuery({
    queryKey: ["maintenance-activity-orders", params],
    queryFn: () => listMaintenanceActivityOrders(params),
    placeholderData: keepPreviousData,
  });
}

export function getMaintenanceActivityOrder(name: string): Promise<MaintenanceActivityOrderDetail> {
  return apiFetch<MaintenanceActivityOrderDetail>(
    `/maintenance-activity-orders/${encodeURIComponent(name)}`,
  );
}

export function useMaintenanceActivityOrderDetail(name: string) {
  return useQuery({
    queryKey: ["maintenance-activity-order", name],
    queryFn: () => getMaintenanceActivityOrder(name),
  });
}
