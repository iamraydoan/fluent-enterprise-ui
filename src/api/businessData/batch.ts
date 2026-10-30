import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/api/client";
import type { Page } from "@/api/types";
import type { ListQueryParams } from "@/lib/listQuery";

export interface BatchRecord {
  name: string;
  description: string;
  resource: string;
  systemState: string;
  loadState: string;
  state: string;
}

export interface BatchDetail extends BatchRecord {
  type: string;
  universalState: string;
  dataGroup: string;
  step: string;
  resourceJob: string;
  priority: number;
  resourceType: string;
  facility: string;
  loadStartMode: string;
  loadMode: string;
  materialSplitMode: string;
  allowProductMix: boolean;
  minimumBatchSize: string;
  mainMaterial: string;
  service: string;
  product: string;
  productDescription: string;
  capacityClass: string;
  quantity: string;
  batchSize: string;
  containerType: string;
}

export function listBatches(params: ListQueryParams): Promise<Page<BatchRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<BatchRecord>>(`/business-data/batches?${search.toString()}`);
}

export function useBatches(params: ListQueryParams) {
  return useQuery({
    queryKey: ["business-data", "batches", params],
    queryFn: () => listBatches(params),
    placeholderData: keepPreviousData,
  });
}

export function getBatch(name: string): Promise<BatchDetail> {
  return apiFetch<BatchDetail>(`/business-data/batches/${encodeURIComponent(name)}`);
}

export function useBatchDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "batches", name],
    queryFn: () => getBatch(name),
  });
}
