import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/api/client";
import type { Page } from "@/api/types";
import type { ListQueryParams } from "@/lib/listQuery";

export interface BinConverterRecord {
  name: string;
  description: string;
  converterType: string;
  binType: string;
  state: string;
}

export interface BinConversion {
  fromBinCode: string;
  toBinCode: string;
  toBinDescription: string;
  toBinQuality: string;
  toBinColor: string;
}

export interface BinConverterDetail extends BinConverterRecord {
  universalState: string;
  dataGroup: string;
  conversions: BinConversion[];
}

export function listBinConverters(params: ListQueryParams): Promise<Page<BinConverterRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<BinConverterRecord>>(`/business-data/bin-converters?${search.toString()}`);
}

export function useBinConverters(params: ListQueryParams) {
  return useQuery({
    queryKey: ["business-data", "bin-converters", params],
    queryFn: () => listBinConverters(params),
    placeholderData: keepPreviousData,
  });
}

export function useBinConverterDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "bin-converters", name],
    queryFn: () => apiFetch<BinConverterDetail>(`/business-data/bin-converters/${encodeURIComponent(name)}`),
  });
}

export interface BinConverterUpsertInput extends Partial<BinConverterDetail> {
  name: string;
}

function postJson<T>(path: string, method: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function createBinConverterRecord(input: BinConverterUpsertInput): Promise<BinConverterDetail> {
  return postJson<BinConverterDetail>("/business-data/bin-converters", "POST", input);
}

export function updateBinConverterRecord(
  name: string,
  input: Partial<BinConverterDetail>,
): Promise<BinConverterDetail> {
  return postJson<BinConverterDetail>(
    `/business-data/bin-converters/${encodeURIComponent(name)}`,
    "PUT",
    input,
  );
}

export function setBinConverterRecordState(name: string, state: string): Promise<BinConverterDetail> {
  return postJson<BinConverterDetail>(
    `/business-data/bin-converters/${encodeURIComponent(name)}/state`,
    "PATCH",
    { state },
  );
}

const BIN_CONVERTER_QUERY_KEY = ["business-data", "bin-converters"];

export function useCreateBinConverter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBinConverterRecord,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: BIN_CONVERTER_QUERY_KEY });
    },
  });
}

export function useUpdateBinConverter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, input }: { name: string; input: Partial<BinConverterDetail> }) =>
      updateBinConverterRecord(name, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: BIN_CONVERTER_QUERY_KEY });
    },
  });
}

export function useSetBinConverterState() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, state }: { name: string; state: string }) =>
      setBinConverterRecordState(name, state),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: BIN_CONVERTER_QUERY_KEY });
    },
  });
}
