import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface ProductRecord {
  name: string;
  description: string;
  productType: string;
  state: string;
  isActive: string;
}

export interface ProductDetail extends ProductRecord {
  detailNote?: string;
}

export function listProducts(params: ListQueryParams): Promise<Page<ProductRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<ProductRecord>>(`/business-data/products?${search.toString()}`);
}

export function useProducts(params: ListQueryParams) {
  return useQuery({
    queryKey: ["business-data", "products", params],
    queryFn: () => listProducts(params),
    placeholderData: keepPreviousData,
  });
}

export function getProduct(name: string): Promise<ProductDetail> {
  return apiFetch<ProductDetail>(`/business-data/products/${encodeURIComponent(name)}`);
}

export function useProductDetail(name: string) {
  return useQuery({ queryKey: ["business-data", "product", name], queryFn: () => getProduct(name) });
}
