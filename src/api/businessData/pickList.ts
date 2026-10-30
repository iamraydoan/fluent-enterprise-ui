import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface PickListRecord {
  name: string;
  description: string;
  state: string;
  itemCount: string;
  createdOn: string;
}

export interface PickListDetail extends PickListRecord {
  detailNote?: string;
}

export function listPickLists(params: ListQueryParams): Promise<Page<PickListRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<PickListRecord>>(`/business-data/pick-lists?${search.toString()}`);
}

export function usePickLists(params: ListQueryParams) {
  return useQuery({
    queryKey: ["business-data", "pick-lists", params],
    queryFn: () => listPickLists(params),
    placeholderData: keepPreviousData,
  });
}

export function getPickList(name: string): Promise<PickListDetail> {
  return apiFetch<PickListDetail>(`/business-data/pick-lists/${encodeURIComponent(name)}`);
}

export function usePickListDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "pick-list", name],
    queryFn: () => getPickList(name),
  });
}
