import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type { Page } from "./types";

export interface AiAgentRecord {
  name: string;
  description: string;
  mcpServers: number;
  state: string;
}

export interface AiAgentDetail {
  name: string;
  description: string;
  provider: string;
  model: string;
  runtime: string;
  publish: boolean;
  sync: string;
  instructions: string;
  history: string[][];
}

export interface AiAgentListParams {
  page: number;
  limit: number;
  sort?: string;
  q?: string;
}

export function listAiAgents(params: AiAgentListParams): Promise<Page<AiAgentRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.sort) search.set("sort", params.sort);
  if (params.q) search.set("q", params.q);
  return apiFetch<Page<AiAgentRecord>>(`/ai-agents?${search.toString()}`);
}

export function useAiAgents(params: AiAgentListParams) {
  return useQuery({
    queryKey: ["ai-agents", params],
    queryFn: () => listAiAgents(params),
    placeholderData: keepPreviousData,
  });
}

export function getAiAgent(name: string): Promise<AiAgentDetail> {
  return apiFetch<AiAgentDetail>(`/ai-agents/${encodeURIComponent(name)}`);
}

export function useAiAgent(name: string) {
  return useQuery({
    queryKey: ["ai-agent", name],
    queryFn: () => getAiAgent(name),
  });
}
