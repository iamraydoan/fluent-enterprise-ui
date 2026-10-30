import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface SortRuleSetRecord {
  name: string;
  description: string;
  scope: string;
  state: RecordState;
}

export interface SortRule {
  rule: string;
  description: string;
  sorting: string;
}

export interface SortRuleSetDetail extends SortRuleSetRecord {
  dataGroup: string;
  rules: SortRule[];
}

export type SortRuleSetListParams = ListQueryParams;

export function listSortRuleSets(params: SortRuleSetListParams): Promise<Page<SortRuleSetRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<SortRuleSetRecord>>(`/business-data/sort-rule-sets?${search.toString()}`);
}

export function useSortRuleSets(params: SortRuleSetListParams) {
  return useQuery({
    queryKey: ["business-data", "sort-rule-sets", params],
    queryFn: () => listSortRuleSets(params),
    placeholderData: keepPreviousData,
  });
}

export function getSortRuleSet(name: string): Promise<SortRuleSetDetail> {
  return apiFetch<SortRuleSetDetail>(`/business-data/sort-rule-sets/${encodeURIComponent(name)}`);
}

export function useSortRuleSetDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "sort-rule-set", name],
    queryFn: () => getSortRuleSet(name),
  });
}
