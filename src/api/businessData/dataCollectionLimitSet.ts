import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/api/client";
import type { Page } from "@/api/types";
import type { ListQueryParams } from "@/lib/listQuery";

export interface DataCollectionLimitSetRecord {
  name: string;
  description: string;
  dataCollection: string;
  state: string;
}

export interface SampleLimit {
  sampleId: string;
  lowerErrorLimit: string;
  lowerWarningLimit: string;
  target: string;
  upperWarningLimit: string;
  upperErrorLimit: string;
}

export interface ParameterLimit {
  parameter: string;
  overrideParameter: boolean;
  includeSampleLimits: boolean;
  minValue: string;
  maxValue: string;
  limitType: string;
  lowerErrorLimit: string;
  lowerWarningLimit: string;
  target: string;
  upperWarningLimit: string;
  upperErrorLimit: string;
  sampleLimits: SampleLimit[];
}

export interface DataCollectionLimitSetDetail extends DataCollectionLimitSetRecord {
  type: string;
  universalState: string;
  dataGroup: string;
  changeSet: string;
  parameterLimits: ParameterLimit[];
}

export interface DataCollectionLimitSetUpsertInput {
  name?: string;
  description?: string;
  type?: string;
  dataCollection?: string;
  revision?: string;
  changeSet?: string;
  useAutomaticChangeSet?: boolean;
  approvalRole?: string;
  parameterLimits?: ParameterLimit[];
}

export interface ManageLimitSetParametersInput {
  parameterLimits: ParameterLimit[];
  comment?: string;
}

export interface CopyDataCollectionLimitSetsInput {
  changeSet?: string;
  useAutomaticChangeSet?: boolean;
  approvalRole?: string;
  targetDataCollection: string;
  copies: { source: string; name: string }[];
}

export function useDataCollectionLimitSets(params: ListQueryParams) {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return useQuery<Page<DataCollectionLimitSetRecord>>({
    queryKey: ["business-data", "data-collection-limit-sets", params],
    queryFn: () =>
      apiFetch<Page<DataCollectionLimitSetRecord>>(
        `/business-data/data-collection-limit-sets?${search.toString()}`,
      ),
    placeholderData: keepPreviousData,
  });
}

export function useDataCollectionLimitSetDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "data-collection-limit-sets", name],
    queryFn: () =>
      apiFetch<DataCollectionLimitSetDetail>(
        `/business-data/data-collection-limit-sets/${encodeURIComponent(name)}`,
      ),
  });
}

function invalidateLimitSets(queryClient: {
  invalidateQueries: (filters: { queryKey: string[] }) => void;
}) {
  queryClient.invalidateQueries({ queryKey: ["business-data", "data-collection-limit-sets"] });
}

export function useCreateDataCollectionLimitSet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: DataCollectionLimitSetUpsertInput) =>
      apiFetch<DataCollectionLimitSetDetail>("/business-data/data-collection-limit-sets", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => invalidateLimitSets(queryClient),
  });
}

export function useUpdateDataCollectionLimitSet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, input }: { name: string; input: DataCollectionLimitSetUpsertInput }) =>
      apiFetch<DataCollectionLimitSetDetail>(
        `/business-data/data-collection-limit-sets/${encodeURIComponent(name)}`,
        {
          method: "PUT",
          body: JSON.stringify(input),
        },
      ),
    onSuccess: () => invalidateLimitSets(queryClient),
  });
}

export function useSetDataCollectionLimitSetState() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, state }: { name: string; state: string }) =>
      apiFetch<DataCollectionLimitSetDetail>(
        `/business-data/data-collection-limit-sets/${encodeURIComponent(name)}/state`,
        {
          method: "PATCH",
          body: JSON.stringify({ state }),
        },
      ),
    onSuccess: () => invalidateLimitSets(queryClient),
  });
}

export function useManageDataCollectionLimitSetParameters() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, input }: { name: string; input: ManageLimitSetParametersInput }) =>
      apiFetch<DataCollectionLimitSetDetail>(
        `/business-data/data-collection-limit-sets/${encodeURIComponent(name)}/parameters`,
        {
          method: "POST",
          body: JSON.stringify(input),
        },
      ),
    onSuccess: () => invalidateLimitSets(queryClient),
  });
}

export function useCopyDataCollectionLimitSets() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CopyDataCollectionLimitSetsInput) =>
      apiFetch<DataCollectionLimitSetDetail[]>("/business-data/data-collection-limit-sets/copy", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => invalidateLimitSets(queryClient),
  });
}

export function useDataCollectionLimitSetSourceParameters(source: string): ParameterLimit[] {
  const query = useQuery({
    queryKey: ["business-data", "data-collection-limit-sets", source, "source-parameters"],
    queryFn: () =>
      apiFetch<DataCollectionLimitSetDetail>(
        `/business-data/data-collection-limit-sets/${encodeURIComponent(source)}`,
      ).then((detail) => detail.parameterLimits),
    enabled: source !== "",
  });
  return query.data ?? [];
}
