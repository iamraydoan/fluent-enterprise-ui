import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface TeamRecord {
  name: string;
  description: string;
  calendar: string;
  state: RecordState;
}

export interface TeamDetail extends TeamRecord {
  dataGroup: string;
  employees: string[];
  calendarDays: string[];
}

export type TeamListParams = ListQueryParams;

export function listTeams(params: TeamListParams): Promise<Page<TeamRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<TeamRecord>>(`/business-data/teams?${search.toString()}`);
}

export function useTeams(params: TeamListParams) {
  return useQuery({
    queryKey: ["business-data", "teams", params],
    queryFn: () => listTeams(params),
    placeholderData: keepPreviousData,
  });
}

export function getTeam(name: string): Promise<TeamDetail> {
  return apiFetch<TeamDetail>(`/business-data/teams/${encodeURIComponent(name)}`);
}

export function useTeamDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "team", name],
    queryFn: () => getTeam(name),
  });
}
