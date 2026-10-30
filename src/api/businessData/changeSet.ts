import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export interface ChangeSetUpsertInput extends Partial<ChangeSetDetail> {
  name: string;
}

function postJson<T>(path: string, method: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function createChangeSetRecord(input: ChangeSetUpsertInput): Promise<ChangeSetDetail> {
  return postJson<ChangeSetDetail>("/business-data/change-sets", "POST", input);
}

export function updateChangeSetRecord(
  name: string,
  input: Partial<ChangeSetDetail>,
): Promise<ChangeSetDetail> {
  return postJson<ChangeSetDetail>(
    `/business-data/change-sets/${encodeURIComponent(name)}`,
    "PUT",
    input,
  );
}

export function setChangeSetRecordState(
  name: string,
  patch: { state?: string; systemState?: string },
): Promise<ChangeSetDetail> {
  return postJson<ChangeSetDetail>(
    `/business-data/change-sets/${encodeURIComponent(name)}/state`,
    "PATCH",
    patch,
  );
}

const CHANGE_SET_QUERY_KEY = ["business-data", "change-sets"];

export function useCreateChangeSet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createChangeSetRecord,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CHANGE_SET_QUERY_KEY });
    },
  });
}

export function useUpdateChangeSet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, input }: { name: string; input: Partial<ChangeSetDetail> }) =>
      updateChangeSetRecord(name, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CHANGE_SET_QUERY_KEY });
    },
  });
}

export function useSetChangeSetState() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      patch,
    }: {
      name: string;
      patch: { state?: string; systemState?: string };
    }) => setChangeSetRecordState(name, patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CHANGE_SET_QUERY_KEY });
    },
  });
}
