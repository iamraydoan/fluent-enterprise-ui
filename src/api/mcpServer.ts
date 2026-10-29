import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type { Page } from "./types";

export interface McpServerRecord {
  name: string;
  description: string;
  url: string;
  state: string;
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

export interface McpServerListParams {
  page: number;
  limit: number;
  sort?: string;
  q?: string;
}

export function listMcpServers(params: McpServerListParams): Promise<Page<McpServerRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.sort) search.set("sort", params.sort);
  if (params.q) search.set("q", params.q);
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
