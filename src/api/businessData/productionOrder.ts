import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface ProductionOrderRecord {
  name: string;
  description: string;
  product: string;
  quantity: string;
  state: string;
  priority: string;
}

export interface ProductionOrderDetail extends ProductionOrderRecord {
  detailNote?: string;
}

export function listProductionOrders(params: ListQueryParams): Promise<Page<ProductionOrderRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<ProductionOrderRecord>>(`/business-data/production-orders?${search.toString()}`);
}

export function useProductionOrders(params: ListQueryParams) {
  return useQuery({
    queryKey: ["business-data", "production-orders", params],
    queryFn: () => listProductionOrders(params),
    placeholderData: keepPreviousData,
  });
}

export function getProductionOrder(name: string): Promise<ProductionOrderDetail> {
  return apiFetch<ProductionOrderDetail>(`/business-data/production-orders/${encodeURIComponent(name)}`);
}

export function useProductionOrderDetail(name: string) {
  return useQuery({ queryKey: ["business-data", "production-order", name], queryFn: () => getProductionOrder(name) });
}
