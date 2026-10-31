import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/api/client";
import type { Page } from "@/api/types";
import type { ListQueryParams } from "@/lib/listQuery";

export interface FabMaterial {
  name: string;
  qty: number;
  units: string;
  product: string;
  flow: string;
  step: string;
  priority: number;
  state: string;
  inOffFlow: boolean;
  subMaterialCount: number;
}

export interface FabResource {
  name: string;
  description: string;
  processingType: string;
  group: string;
  systemState: string;
  state: string;
}

export interface FabResourceDetail extends FabResource {
  dispatchCount: number;
  materialsCount: number;
  loadPortCount: number;
  subResourceCount: number;
  consumableCount: number;
  durableCount: number;
  recipe: string;
  upcomingMaintenanceCount: number;
  alertCount: number;
}

export interface StepSummary {
  name: string;
  state: string;
  materialCount: number;
  resourceCount: number;
}

function toSearch(params: ListQueryParams): string {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  if (params.filters?.product) search.set("product", params.filters.product);
  if (params.filters?.flow) search.set("flow", params.filters.flow);
  if (params.filters?.processingType) search.set("processingType", params.filters.processingType);
  if (params.filters?.systemState) search.set("systemState", params.filters.systemState);
  return search.toString();
}

export function listStepMaterials(
  step: string,
  params: ListQueryParams,
): Promise<Page<FabMaterial>> {
  return apiFetch<Page<FabMaterial>>(
    `/manufacturing/fab-explorer/steps/${encodeURIComponent(step)}/materials?${toSearch(params)}`,
  );
}

export function useStepMaterials(step: string, params: ListQueryParams) {
  return useQuery({
    queryKey: ["manufacturing", "fab-explorer", "steps", step, "materials", params],
    queryFn: () => listStepMaterials(step, params),
    placeholderData: keepPreviousData,
  });
}

export function listStepResources(
  step: string,
  params: ListQueryParams,
): Promise<Page<FabResource>> {
  return apiFetch<Page<FabResource>>(
    `/manufacturing/fab-explorer/steps/${encodeURIComponent(step)}/resources?${toSearch(params)}`,
  );
}

export function useStepResources(step: string, params: ListQueryParams) {
  return useQuery({
    queryKey: ["manufacturing", "fab-explorer", "steps", step, "resources", params],
    queryFn: () => listStepResources(step, params),
    placeholderData: keepPreviousData,
  });
}

export function listResourceMaterials(
  resource: string,
  params: ListQueryParams,
): Promise<Page<FabMaterial>> {
  return apiFetch<Page<FabMaterial>>(
    `/manufacturing/fab-explorer/resources/${encodeURIComponent(resource)}/materials?${toSearch(params)}`,
  );
}

export function useResourceMaterials(resource: string, params: ListQueryParams) {
  return useQuery({
    queryKey: ["manufacturing", "fab-explorer", "resources", resource, "materials", params],
    queryFn: () => listResourceMaterials(resource, params),
    placeholderData: keepPreviousData,
  });
}

export function listDispatchList(
  resource: string,
  params: ListQueryParams,
): Promise<Page<FabMaterial>> {
  return apiFetch<Page<FabMaterial>>(
    `/manufacturing/fab-explorer/resources/${encodeURIComponent(resource)}/dispatch-list?${toSearch(params)}`,
  );
}

export function useDispatchList(resource: string, params: ListQueryParams) {
  return useQuery({
    queryKey: ["manufacturing", "fab-explorer", "resources", resource, "dispatch-list", params],
    queryFn: () => listDispatchList(resource, params),
    placeholderData: keepPreviousData,
  });
}

export function getFabResourceDetail(name: string): Promise<FabResourceDetail> {
  return apiFetch<FabResourceDetail>(
    `/manufacturing/fab-explorer/resources/${encodeURIComponent(name)}`,
  );
}

export function useFabResourceDetail(name: string) {
  return useQuery({
    queryKey: ["manufacturing", "fab-explorer", "resources", name],
    queryFn: () => getFabResourceDetail(name),
  });
}

export function getStepSummary(name: string): Promise<StepSummary> {
  return apiFetch<StepSummary>(`/manufacturing/fab-explorer/steps/${encodeURIComponent(name)}`);
}

export function useStepSummary(name: string) {
  return useQuery({
    queryKey: ["manufacturing", "fab-explorer", "steps", name],
    queryFn: () => getStepSummary(name),
  });
}

export interface FabOperationInput {
  materials: string[];
  resource?: string;
  comment?: string;
  [key: string]: unknown;
}

export function postFabOperation(
  operation: string,
  input: FabOperationInput,
): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`/manufacturing/fab-explorer/operations/${operation}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}
