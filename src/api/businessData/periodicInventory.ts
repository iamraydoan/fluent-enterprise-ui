import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface PeriodicInventoryRecord {
  name: string;
  description: string;
  facility: string;
  state: string;
  scheduledOn: string;
}

export interface PeriodicInventoryDetail extends PeriodicInventoryRecord {
  detailNote?: string;
}

export function listPeriodicInventorys(params: ListQueryParams): Promise<Page<PeriodicInventoryRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<PeriodicInventoryRecord>>(`/business-data/periodic-inventorys?${search.toString()}`);
}

export function usePeriodicInventorys(params: ListQueryParams) {
  return useQuery({
    queryKey: ["business-data", "periodic-inventorys", params],
    queryFn: () => listPeriodicInventorys(params),
    placeholderData: keepPreviousData,
  });
}

export function getPeriodicInventory(name: string): Promise<PeriodicInventoryDetail> {
  return apiFetch<PeriodicInventoryDetail>(`/business-data/periodic-inventorys/${encodeURIComponent(name)}`);
}

export function usePeriodicInventoryDetail(name: string) {
  return useQuery({ queryKey: ["business-data", "periodic-inventory", name], queryFn: () => getPeriodicInventory(name) });
}
