import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { toListSearchParams } from "@/lib/listQuery";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface ProductGroupRecord {
  name: string;
  description: string;
  state: string;
  productCount: string;
}

export interface ProductGroupDetail extends ProductGroupRecord {
  detailNote?: string;
}

export function listProductGroups(params: ListQueryParams): Promise<Page<ProductGroupRecord>> {
  return apiFetch<Page<ProductGroupRecord>>(
    `/business-data/product-groups?${toListSearchParams(params)}`,
  );
}

export function useProductGroups(params: ListQueryParams) {
  return useQuery({
    queryKey: ["business-data", "product-groups", params],
    queryFn: () => listProductGroups(params),
    placeholderData: keepPreviousData,
  });
}

export function getProductGroup(name: string): Promise<ProductGroupDetail> {
  return apiFetch<ProductGroupDetail>(`/business-data/product-groups/${encodeURIComponent(name)}`);
}

export function useProductGroupDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "product-group", name],
    queryFn: () => getProductGroup(name),
  });
}
