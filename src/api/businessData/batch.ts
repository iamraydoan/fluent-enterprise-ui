import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export interface BatchUpsertInput extends Partial<BatchDetail> {
  name: string;
}

function postJson<T>(path: string, method: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function createBatchRecord(input: BatchUpsertInput): Promise<BatchDetail> {
  return postJson<BatchDetail>("/business-data/batches", "POST", input);
}

export function updateBatchRecord(name: string, input: Partial<BatchDetail>): Promise<BatchDetail> {
  return postJson<BatchDetail>(`/business-data/batches/${encodeURIComponent(name)}`, "PUT", input);
}

export function setBatchRecordState(
  name: string,
  patch: { state?: string; systemState?: string },
): Promise<BatchDetail> {
  return postJson<BatchDetail>(
    `/business-data/batches/${encodeURIComponent(name)}/state`,
    "PATCH",
    patch,
  );
}

const BATCH_QUERY_KEY = ["business-data", "batches"];

export function useCreateBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBatchRecord,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: BATCH_QUERY_KEY });
    },
  });
}

export function useUpdateBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, input }: { name: string; input: Partial<BatchDetail> }) =>
      updateBatchRecord(name, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: BATCH_QUERY_KEY });
    },
  });
}

export function useSetBatchState() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      patch,
    }: {
      name: string;
      patch: { state?: string; systemState?: string };
    }) => setBatchRecordState(name, patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: BATCH_QUERY_KEY });
    },
  });
}
