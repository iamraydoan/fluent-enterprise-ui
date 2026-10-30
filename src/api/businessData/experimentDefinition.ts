import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface ExperimentDefinitionRecord {
  name: string;
  description: string;
  type: string;
  product: string;
  state: RecordState;
}

export interface ExperimentDefinitionDetail extends ExperimentDefinitionRecord {
  dataGroup: string;
  ignoreInSamplingPlans: boolean;
  ignoreInSpcCharts: boolean;
  closeExperimentAutomatically: boolean;
  ownerRole: string;
  purpose: string;
  note: string;
  result: string;
  conclusions: string;
  productGroup: string;
  maximumNumberOfMaterials: number;
  requiredMaterialType: string;
  requiredMaterialForm: string;
  mode: string;
  requiredSubMaterialsForm: string;
  requiredSubMaterialsCount: number;
  plannedStartDate: number;
  plannedEndDate: number;
  flow: string;
  firstStep: string;
  firstStepFlowPath: string;
  lastStep: string;
  lastStepFlowPath: string;
}

export function listExperimentDefinitions(
  params: ListQueryParams,
): Promise<Page<ExperimentDefinitionRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<ExperimentDefinitionRecord>>(`/experiment-definitions?${search.toString()}`);
}

export function useExperimentDefinitions(params: ListQueryParams) {
  return useQuery({
    queryKey: ["experiment-definitions", params],
    queryFn: () => listExperimentDefinitions(params),
    placeholderData: keepPreviousData,
  });
}

export function getExperimentDefinition(name: string): Promise<ExperimentDefinitionDetail> {
  return apiFetch<ExperimentDefinitionDetail>(
    `/experiment-definitions/${encodeURIComponent(name)}`,
  );
}

export function useExperimentDefinitionDetail(name: string) {
  return useQuery({
    queryKey: ["experiment-definition", name],
    queryFn: () => getExperimentDefinition(name),
  });
}
