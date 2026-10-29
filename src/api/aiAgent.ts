import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "./client";
import type { Page } from "./types";

export interface AiAgentRecord {
  name: string;
  description: string;
  mcpServers: number;
  state: RecordState;
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

export type AiAgentListParams = ListQueryParams;

export function listAiAgents(params: AiAgentListParams): Promise<Page<AiAgentRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.sort) search.set("sort", params.sort);
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
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
