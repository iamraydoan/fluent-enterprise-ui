import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface TransferOrderRecord {
  name: string;
  description: string;
  sourceLocation: string;
  destinationLocation: string;
  orderState: string;
  state: RecordState;
}

export interface TransferOrderItem {
  material: string;
  product: string;
  quantity: number;
}

export interface TransferOrderDetail extends TransferOrderRecord {
  dataGroup: string;
  items: TransferOrderItem[];
}

export type TransferOrderListParams = ListQueryParams;

export function listTransferOrders(params: TransferOrderListParams): Promise<Page<TransferOrderRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<TransferOrderRecord>>(`/business-data/transfer-orders?${search.toString()}`);
}

export function useTransferOrders(params: TransferOrderListParams) {
  return useQuery({
    queryKey: ["business-data", "transfer-orders", params],
    queryFn: () => listTransferOrders(params),
    placeholderData: keepPreviousData,
  });
}

export function getTransferOrder(name: string): Promise<TransferOrderDetail> {
  return apiFetch<TransferOrderDetail>(`/business-data/transfer-orders/${encodeURIComponent(name)}`);
}

export function useTransferOrderDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "transfer-order", name],
    queryFn: () => getTransferOrder(name),
  });
}
