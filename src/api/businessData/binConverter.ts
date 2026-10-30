import { keepPreviousData, useQuery } from "@tanstack/react-query";
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
