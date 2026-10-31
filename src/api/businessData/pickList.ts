import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { toListSearchParams } from "@/lib/listQuery";
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
  return apiFetch<Page<PickListRecord>>(`/business-data/pick-lists?${toListSearchParams(params)}`);
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
