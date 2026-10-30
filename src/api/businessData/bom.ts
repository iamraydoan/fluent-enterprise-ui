import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/api/client";
import type { Page } from "@/api/types";
import type { ListQueryParams } from "@/lib/listQuery";

export interface BomRecord {
  name: string;
  description: string;
  product: string;
  version: string;
  state: string;
}

export interface BomItem {
  item: number;
  product: string;
  quantity: number;
  units: string;
  position: number;
  source: string;
}

export interface BomDetail extends BomRecord {
  type: string;
  universalState: string;
  dataGroup: string;
  changeSet: string;
  scope: string;
  baseQuantity: number;
  units: string;
  useTolerances: boolean;
  useMixedAssembly: boolean;
  items: BomItem[];
}

export function listBoms(params: ListQueryParams): Promise<Page<BomRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<BomRecord>>(`/business-data/boms?${search.toString()}`);
}

export function useBoms(params: ListQueryParams) {
  return useQuery({
    queryKey: ["business-data", "boms", params],
    queryFn: () => listBoms(params),
    placeholderData: keepPreviousData,
  });
}

export function getBom(name: string): Promise<BomDetail> {
  return apiFetch<BomDetail>(`/business-data/boms/${encodeURIComponent(name)}`);
}

export function useBomDetail(name: string) {
  return useQuery({ queryKey: ["business-data", "boms", name], queryFn: () => getBom(name) });
}
