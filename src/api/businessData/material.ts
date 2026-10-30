import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface MaterialRecord {
  name: string;
  description: string;
  type: string;
  product: string;
  step: string;
  primaryQuantity: string;
  state: string;
}

export interface MaterialDetail extends MaterialRecord {
  form: string;
  facility: string;
  productDescription: string;
  productGroup: string;
  universalState: string;
  systemState: string;
  flow: string;
  flowPath: string;
  secondaryQuantity: string;
  subMaterialCount: number;
}

export function listMaterials(params: ListQueryParams): Promise<Page<MaterialRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<MaterialRecord>>(`/business-data/materials?${search.toString()}`);
}

export function useMaterials(params: ListQueryParams) {
  return useQuery({
    queryKey: ["business-data", "materials", params],
    queryFn: () => listMaterials(params),
    placeholderData: keepPreviousData,
  });
}

export function getMaterial(name: string): Promise<MaterialDetail> {
  return apiFetch<MaterialDetail>(`/business-data/materials/${encodeURIComponent(name)}`);
}

export function useMaterialDetail(name: string) {
  return useQuery({ queryKey: ["business-data", "material", name], queryFn: () => getMaterial(name) });
}
