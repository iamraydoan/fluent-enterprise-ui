import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";

export interface SendAheadRunRecord {
  name: string;
  description: string;
  state: RecordState;
}

export interface SendAheadRunDetail extends SendAheadRunRecord {
  dataGroup: string;
  resultsCaptureMode: string;
}

export interface SendAheadRunListParams {
  q?: string;
  state?: string;
}

export function listSendAheadRuns(params: SendAheadRunListParams): Promise<SendAheadRunRecord[]> {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.state) search.set("state", params.state);
  return apiFetch<SendAheadRunRecord[]>(`/business-data/send-ahead-runs?${search.toString()}`);
}

export function useSendAheadRuns(params: SendAheadRunListParams) {
  return useQuery({
    queryKey: ["business-data", "send-ahead-runs", params],
    queryFn: () => listSendAheadRuns(params),
    placeholderData: keepPreviousData,
  });
}

export function getSendAheadRun(name: string): Promise<SendAheadRunDetail> {
  return apiFetch<SendAheadRunDetail>(`/business-data/send-ahead-runs/${encodeURIComponent(name)}`);
}

export function useSendAheadRunDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "send-ahead-run", name],
    queryFn: () => getSendAheadRun(name),
  });
}
