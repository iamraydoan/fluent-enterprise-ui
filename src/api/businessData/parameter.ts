import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface ParameterRecord {
  name: string;
  description: string;
  dataType: string;
  value: string;
  state: string;
}

export interface ParameterDetail extends ParameterRecord {
  detailNote?: string;
}

export function listParameters(params: ListQueryParams): Promise<Page<ParameterRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<ParameterRecord>>(`/business-data/parameters?${search.toString()}`);
}

export function useParameters(params: ListQueryParams) {
  return useQuery({
    queryKey: ["business-data", "parameters", params],
    queryFn: () => listParameters(params),
    placeholderData: keepPreviousData,
  });
}

export function getParameter(name: string): Promise<ParameterDetail> {
  return apiFetch<ParameterDetail>(`/business-data/parameters/${encodeURIComponent(name)}`);
}

export function useParameterDetail(name: string) {
  return useQuery({ queryKey: ["business-data", "parameter", name], queryFn: () => getParameter(name) });
}
