import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface ProtocolRecord {
  name: string;
  description: string;
  type: string;
  state: string;
  version: string;
}

export interface ProtocolDetail extends ProtocolRecord {
  detailNote?: string;
}

export function listProtocols(params: ListQueryParams): Promise<Page<ProtocolRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<ProtocolRecord>>(`/business-data/protocols?${search.toString()}`);
}

export function useProtocols(params: ListQueryParams) {
  return useQuery({
    queryKey: ["business-data", "protocols", params],
    queryFn: () => listProtocols(params),
    placeholderData: keepPreviousData,
  });
}

export function getProtocol(name: string): Promise<ProtocolDetail> {
  return apiFetch<ProtocolDetail>(`/business-data/protocols/${encodeURIComponent(name)}`);
}

export function useProtocolDetail(name: string) {
  return useQuery({ queryKey: ["business-data", "protocol", name], queryFn: () => getProtocol(name) });
}
