import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/api/client";
import type { Page } from "@/api/types";
import type { ListQueryParams } from "@/lib/listQuery";

export interface DataCollectionRecord {
  name: string;
  description: string;
  scope: string;
  state: string;
}

export interface DataCollectionParameter {
  parameter: string;
  dataType: string;
  isOptional: boolean;
  minimumSamples: number;
  maximumSamples: number;
  minimumSampleReadings: number;
  maximumSampleReadings: number;
  limitChecking: string;
}

export interface DataCollectionLimitSetRef {
  name: string;
}

export interface DataCollectionInstance {
  name: string;
  state: string;
  description: string;
  limitSet: string;
  material: string;
  postedData: { parameter: string; value: string }[];
}

export interface DataCollectionDetail extends DataCollectionRecord {
  type: string;
  universalState: string;
  dataGroup: string;
  changeSet: string;
  userInterface: string;
  spcMode: string;
  limitCheckingMode: string;
  parameters: DataCollectionParameter[];
  limitSets: DataCollectionLimitSetRef[];
  instances: DataCollectionInstance[];
}

export interface DataCollectionUpsertInput {
  name?: string;
  description?: string;
  type?: string;
  scope?: string;
  dataGroup?: string;
  changeSet?: string;
  useAutomaticChangeSet?: boolean;
  approvalRole?: string;
  makeEffectiveOnApproval?: boolean;
  spcMode?: string;
  userInterface?: string;
  parameters?: DataCollectionParameter[];
}

export interface OpenDataCollectionInstanceInput {
  instanceName?: string;
  description?: string;
  limitSet?: string;
  material?: string;
  comment?: string;
}

export interface PerformImmediateInput extends OpenDataCollectionInstanceInput {
  adHoc?: boolean;
  parameters?: DataCollectionParameter[];
  values?: { parameter: string; value: string }[];
}

function postJson<T>(path: string, method: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function createDataCollectionRecord(
  input: DataCollectionUpsertInput,
): Promise<DataCollectionDetail> {
  return postJson<DataCollectionDetail>("/business-data/data-collections", "POST", input);
}

export function updateDataCollectionRecord(
  name: string,
  input: DataCollectionUpsertInput,
): Promise<DataCollectionDetail> {
  return postJson<DataCollectionDetail>(
    `/business-data/data-collections/${encodeURIComponent(name)}`,
    "PUT",
    input,
  );
}

export function setDataCollectionRecordState(
  name: string,
  state: "Active" | "Terminated",
): Promise<DataCollectionDetail> {
  return postJson<DataCollectionDetail>(
    `/business-data/data-collections/${encodeURIComponent(name)}/state`,
    "PATCH",
    { state },
  );
}

export function manageDataCollectionParameters(
  name: string,
  parameters: DataCollectionParameter[],
): Promise<DataCollectionDetail> {
  return postJson<DataCollectionDetail>(
    `/business-data/data-collections/${encodeURIComponent(name)}/parameters`,
    "POST",
    { parameters },
  );
}

export function openDataCollectionInstance(
  name: string,
  input: OpenDataCollectionInstanceInput,
): Promise<DataCollectionDetail> {
  return postJson<DataCollectionDetail>(
    `/business-data/data-collections/${encodeURIComponent(name)}/instances`,
    "POST",
    input,
  );
}

export function performImmediateDataCollection(
  name: string,
  input: PerformImmediateInput,
): Promise<DataCollectionDetail> {
  return postJson<DataCollectionDetail>(
    `/business-data/data-collections/${encodeURIComponent(name)}/instances/immediate`,
    "POST",
    input,
  );
}

export function updateDataCollectionInstance(
  name: string,
  instance: string,
  patch: { state: string },
): Promise<DataCollectionDetail> {
  return postJson<DataCollectionDetail>(
    `/business-data/data-collections/${encodeURIComponent(name)}/instances/${encodeURIComponent(instance)}`,
    "PATCH",
    patch,
  );
}

export function postDataCollectionInstance(
  name: string,
  instance: string,
  values: { parameter: string; value: string }[],
  comment?: string,
): Promise<DataCollectionDetail> {
  return postJson<DataCollectionDetail>(
    `/business-data/data-collections/${encodeURIComponent(name)}/instances/${encodeURIComponent(instance)}/post`,
    "POST",
    { values, comment },
  );
}

export function correctDataCollectionInstance(
  name: string,
  instance: string,
  values: { parameter: string; value: string }[],
): Promise<DataCollectionDetail> {
  return postJson<DataCollectionDetail>(
    `/business-data/data-collections/${encodeURIComponent(name)}/instances/${encodeURIComponent(instance)}/correct`,
    "POST",
    { values },
  );
}

export function resetDataCollectionInstance(
  name: string,
  instance: string,
): Promise<DataCollectionDetail> {
  return postJson<DataCollectionDetail>(
    `/business-data/data-collections/${encodeURIComponent(name)}/instances/${encodeURIComponent(instance)}/reset`,
    "POST",
    {},
  );
}

function useInvalidateDataCollections() {
  const queryClient = useQueryClient();
  return () =>
    void queryClient.invalidateQueries({ queryKey: ["business-data", "data-collections"] });
}

export function useCreateDataCollection() {
  const invalidate = useInvalidateDataCollections();
  return useMutation({ mutationFn: createDataCollectionRecord, onSuccess: invalidate });
}

export function useUpdateDataCollection() {
  const invalidate = useInvalidateDataCollections();
  return useMutation({
    mutationFn: ({ name, input }: { name: string; input: DataCollectionUpsertInput }) =>
      updateDataCollectionRecord(name, input),
    onSuccess: invalidate,
  });
}

export function useSetDataCollectionState() {
  const invalidate = useInvalidateDataCollections();
  return useMutation({
    mutationFn: ({ name, state }: { name: string; state: "Active" | "Terminated" }) =>
      setDataCollectionRecordState(name, state),
    onSuccess: invalidate,
  });
}

export function useManageDataCollectionParameters() {
  const invalidate = useInvalidateDataCollections();
  return useMutation({
    mutationFn: ({ name, parameters }: { name: string; parameters: DataCollectionParameter[] }) =>
      manageDataCollectionParameters(name, parameters),
    onSuccess: invalidate,
  });
}

export function useOpenDataCollectionInstance() {
  const invalidate = useInvalidateDataCollections();
  return useMutation({
    mutationFn: ({ name, input }: { name: string; input: OpenDataCollectionInstanceInput }) =>
      openDataCollectionInstance(name, input),
    onSuccess: invalidate,
  });
}

export function usePerformImmediateDataCollection() {
  const invalidate = useInvalidateDataCollections();
  return useMutation({
    mutationFn: ({ name, input }: { name: string; input: PerformImmediateInput }) =>
      performImmediateDataCollection(name, input),
    onSuccess: invalidate,
  });
}

export function useUpdateDataCollectionInstance() {
  const invalidate = useInvalidateDataCollections();
  return useMutation({
    mutationFn: ({
      name,
      instance,
      patch,
    }: {
      name: string;
      instance: string;
      patch: { state: string };
    }) => updateDataCollectionInstance(name, instance, patch),
    onSuccess: invalidate,
  });
}

export function usePostDataCollectionInstance() {
  const invalidate = useInvalidateDataCollections();
  return useMutation({
    mutationFn: ({
      name,
      instance,
      values,
      comment,
    }: {
      name: string;
      instance: string;
      values: { parameter: string; value: string }[];
      comment?: string;
    }) => postDataCollectionInstance(name, instance, values, comment),
    onSuccess: invalidate,
  });
}

export function useCorrectDataCollectionInstance() {
  const invalidate = useInvalidateDataCollections();
  return useMutation({
    mutationFn: ({
      name,
      instance,
      values,
    }: {
      name: string;
      instance: string;
      values: { parameter: string; value: string }[];
    }) => correctDataCollectionInstance(name, instance, values),
    onSuccess: invalidate,
  });
}

export function useResetDataCollectionInstance() {
  const invalidate = useInvalidateDataCollections();
  return useMutation({
    mutationFn: ({ name, instance }: { name: string; instance: string }) =>
      resetDataCollectionInstance(name, instance),
    onSuccess: invalidate,
  });
}

export function useDataCollections(params: ListQueryParams) {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return useQuery<Page<DataCollectionRecord>>({
    queryKey: ["business-data", "data-collections", params],
    queryFn: () =>
      apiFetch<Page<DataCollectionRecord>>(`/business-data/data-collections?${search.toString()}`),
    placeholderData: keepPreviousData,
  });
}

export function useDataCollectionDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "data-collections", name],
    queryFn: () =>
      apiFetch<DataCollectionDetail>(`/business-data/data-collections/${encodeURIComponent(name)}`),
  });
}

export function useDataCollectionParameters(name: string | undefined): DataCollectionParameter[] {
  const query = useQuery({
    queryKey: ["business-data", "data-collections", name ?? "", "parameters"],
    queryFn: () =>
      apiFetch<DataCollectionDetail>(
        `/business-data/data-collections/${encodeURIComponent(name ?? "")}`,
      ).then((detail) => detail.parameters),
    enabled: !!name,
  });
  return query.data ?? [];
}
