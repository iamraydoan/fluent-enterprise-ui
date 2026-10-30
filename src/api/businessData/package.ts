import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface PackageRecord {
  name: string;
  description: string;
  product: string;
  level: string;
  state: string;
  packedQuantity: string;
  contentType: string;
}

export interface PackageDetail extends PackageRecord {
  detailNote?: string;
}

export function listPackages(params: ListQueryParams): Promise<Page<PackageRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<PackageRecord>>(`/business-data/packages?${search.toString()}`);
}

export function usePackages(params: ListQueryParams) {
  return useQuery({
    queryKey: ["business-data", "packages", params],
    queryFn: () => listPackages(params),
    placeholderData: keepPreviousData,
  });
}

export function getPackage(name: string): Promise<PackageDetail> {
  return apiFetch<PackageDetail>(`/business-data/packages/${encodeURIComponent(name)}`);
}

export function usePackageDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "package", name],
    queryFn: () => getPackage(name),
  });
}
