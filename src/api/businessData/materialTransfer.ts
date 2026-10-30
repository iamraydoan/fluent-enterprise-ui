import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface MaterialTransferRecord {
  name: string;
  type: string;
  state: string;
  material: string;
  quantity: string;
  fromFacility: string;
  toFacility: string;
}

export interface MaterialTransferDetail extends MaterialTransferRecord {
  requester: string;
  urgency: string;
}

export function listMaterialTransfers(
  params: ListQueryParams,
): Promise<Page<MaterialTransferRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<MaterialTransferRecord>>(
    `/business-data/material-transfers?${search.toString()}`,
  );
}

export function useMaterialTransfers(params: ListQueryParams) {
  return useQuery({
    queryKey: ["business-data", "material-transfers", params],
    queryFn: () => listMaterialTransfers(params),
    placeholderData: keepPreviousData,
  });
}

export function getMaterialTransfer(name: string): Promise<MaterialTransferDetail> {
  return apiFetch<MaterialTransferDetail>(
    `/business-data/material-transfers/${encodeURIComponent(name)}`,
  );
}

export function useMaterialTransferDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "material-transfer", name],
    queryFn: () => getMaterialTransfer(name),
  });
}
