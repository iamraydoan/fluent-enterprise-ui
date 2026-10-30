import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface EnterpriseRecord {
  name: string;
  description: string;
  dataGroup: string;
  state: RecordState;
}

export interface EnterpriseDetail extends EnterpriseRecord {
  sites: { name: string; state: RecordState }[];
}

export function listEnterprises(params: ListQueryParams): Promise<Page<EnterpriseRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<EnterpriseRecord>>(`/enterprises?${search.toString()}`);
}

export function useEnterprises(params: ListQueryParams) {
  return useQuery({
    queryKey: ["enterprises", params],
    queryFn: () => listEnterprises(params),
    placeholderData: keepPreviousData,
  });
}

export function getEnterprise(name: string): Promise<EnterpriseDetail> {
  return apiFetch<EnterpriseDetail>(`/enterprises/${encodeURIComponent(name)}`);
}

export function useEnterpriseDetail(name: string) {
  return useQuery({ queryKey: ["enterprise", name], queryFn: () => getEnterprise(name) });
}
