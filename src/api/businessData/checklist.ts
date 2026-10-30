import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/api/client";
import type { Page } from "@/api/types";
import type { ListQueryParams } from "@/lib/listQuery";

export interface ChecklistRecord {
  name: string;
  description: string;
  scope: string;
  executionMode: string;
  state: string;
}

export interface ChecklistItemParameter {
  name: string;
  optional: boolean;
  source: "Free" | "LookupTable" | "Query";
  dataType: string;
  defaultValue: string;
}

export interface ChecklistItem {
  name: string;
  description: string;
  itemType: string;
  documentationUrl: string;
  activityType: "Manual Task" | "Manual Action" | "Automatic Action" | "Signature";
  trackingType: "Start And End" | "End";
  rule: string;
  timeCategory: string;
  standardDuration: string;
  floating: boolean;
  optional: boolean;
  executedOutOfOrder: boolean;
  group: string;
  instructions: string;
  conditionType: string;
  conditionExpression: string;
  parameters: ChecklistItemParameter[];
}

export type ChecklistInstanceItemState = "Not Started" | "Started" | "Completed" | "Skipped";

export interface ChecklistInstanceItem {
  name: string;
  activityType: string;
  state: ChecklistInstanceItemState;
  optional: boolean;
  floating: boolean;
}

export interface ChecklistInstance {
  name: string;
  state: string;
  executingState: "Executing" | "Paused" | "Closed";
  material: string;
  items: ChecklistInstanceItem[];
  deviations: string[];
}

export interface ChecklistDetail extends ChecklistRecord {
  type: string;
  universalState: string;
  dataGroup: string;
  changeSet: string;
  useAutomaticChangeSet: boolean;
  approvalRole: string;
  makeEffectiveOnApproval: boolean;
  bom: string;
  product: string;
  dataCollection: string;
  dataCollectionLimitSet: string;
  materialDeviationProtocol: string;
  defineStandardTimes: boolean;
  trackExecutionTimes: boolean;
  documentationUrl: string;
  standardDuration: string;
  items: ChecklistItem[];
  instances: ChecklistInstance[];
}

export interface ChecklistUpsertInput {
  name?: string;
  description?: string;
  type?: string;
  changeSet?: string;
  useAutomaticChangeSet?: boolean;
  approvalRole?: string;
  makeEffectiveOnApproval?: boolean;
  scope?: string;
  executionMode?: "Long Running" | "Immediate";
  bom?: string;
  product?: string;
  dataCollection?: string;
  dataCollectionLimitSet?: string;
  materialDeviationProtocol?: string;
  defineStandardTimes?: boolean;
  trackExecutionTimes?: boolean;
  documentationUrl?: string;
  standardDuration?: string;
  items?: ChecklistItem[];
}

export interface ChecklistInstanceInput {
  name?: string;
  material?: string;
}

export function useChecklists(params: ListQueryParams) {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return useQuery<Page<ChecklistRecord>>({
    queryKey: ["business-data", "checklists", params],
    queryFn: () =>
      apiFetch<Page<ChecklistRecord>>(`/business-data/checklists?${search.toString()}`),
    placeholderData: keepPreviousData,
  });
}

export function useChecklistDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "checklists", name],
    queryFn: () =>
      apiFetch<ChecklistDetail>(`/business-data/checklists/${encodeURIComponent(name)}`),
  });
}

function useInvalidateChecklist() {
  const queryClient = useQueryClient();
  return (name: string) => {
    void queryClient.invalidateQueries({ queryKey: ["business-data", "checklists"] });
    void queryClient.invalidateQueries({ queryKey: ["business-data", "checklists", name] });
  };
}

export function useCreateChecklist() {
  const invalidate = useInvalidateChecklist();
  return useMutation({
    mutationFn: (input: ChecklistUpsertInput) =>
      apiFetch<ChecklistDetail>("/business-data/checklists", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: (data) => invalidate(data.name),
  });
}

export function useUpdateChecklist() {
  const invalidate = useInvalidateChecklist();
  return useMutation({
    mutationFn: ({ name, input }: { name: string; input: ChecklistUpsertInput }) =>
      apiFetch<ChecklistDetail>(`/business-data/checklists/${encodeURIComponent(name)}`, {
        method: "PUT",
        body: JSON.stringify(input),
      }),
    onSuccess: (data) => invalidate(data.name),
  });
}

export function useSetChecklistState() {
  const invalidate = useInvalidateChecklist();
  return useMutation({
    mutationFn: ({ name, patch }: { name: string; patch: { state: string } }) =>
      apiFetch<ChecklistDetail>(`/business-data/checklists/${encodeURIComponent(name)}/state`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      }),
    onSuccess: (data) => invalidate(data.name),
  });
}

export function useOpenChecklistInstance() {
  const invalidate = useInvalidateChecklist();
  return useMutation({
    mutationFn: ({ name, input }: { name: string; input: ChecklistInstanceInput }) =>
      apiFetch<ChecklistDetail>(`/business-data/checklists/${encodeURIComponent(name)}/instances`, {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: (data) => invalidate(data.name),
  });
}

export function useUpdateChecklistInstance() {
  const invalidate = useInvalidateChecklist();
  return useMutation({
    mutationFn: ({
      name,
      instance,
      patch,
    }: {
      name: string;
      instance: string;
      patch: Partial<ChecklistInstance>;
    }) =>
      apiFetch<ChecklistDetail>(
        `/business-data/checklists/${encodeURIComponent(name)}/instances/${encodeURIComponent(instance)}`,
        { method: "PATCH", body: JSON.stringify(patch) },
      ),
    onSuccess: (data) => invalidate(data.name),
  });
}

export function usePerformChecklistInstance() {
  const invalidate = useInvalidateChecklist();
  return useMutation({
    mutationFn: ({
      name,
      instance,
      items,
      close,
    }: {
      name: string;
      instance: string;
      items: { name: string; state: ChecklistInstanceItemState }[];
      close?: boolean;
    }) =>
      apiFetch<ChecklistDetail>(
        `/business-data/checklists/${encodeURIComponent(name)}/instances/${encodeURIComponent(instance)}/perform`,
        { method: "POST", body: JSON.stringify({ items, close }) },
      ),
    onSuccess: (data) => invalidate(data.name),
  });
}

export function useOpenMaterialDeviation() {
  const invalidate = useInvalidateChecklist();
  return useMutation({
    mutationFn: ({
      name,
      instance,
      deviation,
    }: {
      name: string;
      instance: string;
      deviation: {
        itemName: string;
        deviationType: string;
        product?: string;
        quantity?: number;
        units?: string;
        color?: string;
        comment?: string;
      };
    }) =>
      apiFetch<ChecklistDetail>(
        `/business-data/checklists/${encodeURIComponent(name)}/instances/${encodeURIComponent(instance)}/deviations`,
        { method: "POST", body: JSON.stringify(deviation) },
      ),
    onSuccess: (data) => invalidate(data.name),
  });
}
