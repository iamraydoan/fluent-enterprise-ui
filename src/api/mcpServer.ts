import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "./client";
import type { Page } from "./types";

export interface McpServerRecord {
  name: string;
  description: string;
  url: string;
  state: RecordState;
}

export interface McpServerAuthentication {
  mode: string;
  clientId: string;
  authUrl: string;
  tokenUrl: string;
  scope: string;
}

export interface McpServerDetail {
  description: string;
  url: string;
  sync: string;
  protocol: string;
  isSystem: boolean;
  init: number;
  req: number;
  auth: McpServerAuthentication;
  lastSync: string;
  tools: string[][];
}

export type McpServerListParams = ListQueryParams;

export function listMcpServers(params: McpServerListParams): Promise<Page<McpServerRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.sort) search.set("sort", params.sort);
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<McpServerRecord>>(`/mcp-servers?${search.toString()}`);
}

export function useMcpServers(params: McpServerListParams) {
  return useQuery({
    queryKey: ["mcp-servers", params],
    queryFn: () => listMcpServers(params),
    placeholderData: keepPreviousData,
  });
}

export function getMcpServer(name: string): Promise<McpServerDetail> {
  return apiFetch<McpServerDetail>(`/mcp-servers/${encodeURIComponent(name)}`);
}

export function useMcpServer(name: string) {
  return useQuery({
    queryKey: ["mcp-servers", name],
    queryFn: () => getMcpServer(name),
    placeholderData: keepPreviousData,
  });
}
