import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/api/client";
import type { Page } from "@/api/types";
import type { ListQueryParams } from "@/lib/listQuery";

export interface ChangeSetRecord {
  name: string;
  description: string;
  type: string;
  state: string;
  systemState: string;
}

export interface ChangeSetItem {
  name: string;
  type: string;
  approvalRole: string;
  approver: string;
  approvalDate: string;
}

export interface ChangeSetSubscriber {
  name: string;
}

export interface ChangeSetDetail extends ChangeSetRecord {
  universalState: string;
  dataGroup: string;
  sendEmailToApprovers: boolean;
  sendEmailToRequester: boolean;
  category: string;
  urgency: string;
  owner: string;
  reasonForChange: string;
  descriptionOfChange: string;
  requiresApproval: boolean;
  approvalRole: string;
  makeItemsEffectiveOnApproval: boolean;
  items: ChangeSetItem[];
  subscribers: ChangeSetSubscriber[];
}

export function useChangeSets(params: ListQueryParams) {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return useQuery<Page<ChangeSetRecord>>({
    queryKey: ["business-data", "change-sets", params],
    queryFn: () => apiFetch<Page<ChangeSetRecord>>(`/business-data/change-sets?${search.toString()}`),
    placeholderData: keepPreviousData,
  });
}

export function useChangeSetDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "change-sets", name],
    queryFn: () => apiFetch<ChangeSetDetail>(`/business-data/change-sets/${encodeURIComponent(name)}`),
  });
}
