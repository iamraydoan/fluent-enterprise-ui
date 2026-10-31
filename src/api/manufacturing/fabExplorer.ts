import { keepPreviousData, useQuery } from "@tanstack/react-query";
<<<<<<< HEAD
import { apiFetch } from "../client";

export interface FabEnterprise {
  name: string;
  description: string;
}

export interface FabSite {
  name: string;
  description: string;
  enterprise: string;
  isRemote: boolean;
}

export interface FabFacility {
  name: string;
  description: string;
  type: string;
  site: string;
  enterprise: string;
  areaCount: number;
}

export type FabResourceState = "Up" | "Down" | "Maintenance" | "NonScheduled";

export interface FabResourceStateCount {
  up: number;
  down: number;
  maintenance: number;
  nonScheduled: number;
}

export interface FabArea {
  name: string;
  description: string;
  type: string;
  facility: string;
  resources: FabResourceStateCount;
=======
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
>>>>>>> mfg/agent5
}

export interface FabResource {
  name: string;
  description: string;
<<<<<<< HEAD
  type: string;
  area: string;
  facility: string;
  state: FabResourceState;
  stateModelState: string;
  services: string[];
  processedMaterials: number;
  inQueueMaterials: number;
  inProcessMaterials: number;
}

export interface FabStep {
  name: string;
  description: string;
  type: string;
  area: string;
  facility: string;
  materialCount: number;
  resources: string[];
}

export interface FabMaterial {
  name: string;
  quantity: number;
  step: string;
  dueDate: string;
  facility: string;
  isRemote: boolean;
}

export interface FabDashboardKpi {
  label: string;
  value: number;
  unit: string;
  trend: number;
}

export function useFabEnterprises() {
  return useQuery({
    queryKey: ["fabExplorer", "enterprises"],
    queryFn: () => apiFetch<FabEnterprise[]>("/manufacturing/fab-explorer/enterprises"),
  });
}

export function useFabSites(enterprise?: string) {
  return useQuery({
    queryKey: ["fabExplorer", "sites", enterprise],
    queryFn: () => {
      const search = new URLSearchParams();
      if (enterprise) search.set("enterprise", enterprise);
      const qs = search.toString();
      return apiFetch<FabSite[]>(`/manufacturing/fab-explorer/sites${qs ? `?${qs}` : ""}`);
    },
  });
}

export function useFabFacilities(site?: string, enterprise?: string) {
  return useQuery({
    queryKey: ["fabExplorer", "facilities", site, enterprise],
    queryFn: () => {
      const search = new URLSearchParams();
      if (site) search.set("site", site);
      if (enterprise) search.set("enterprise", enterprise);
      const qs = search.toString();
      return apiFetch<FabFacility[]>(`/manufacturing/fab-explorer/facilities${qs ? `?${qs}` : ""}`);
    },
=======
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
>>>>>>> mfg/agent5
    placeholderData: keepPreviousData,
  });
}

<<<<<<< HEAD
export function useFabFacility(name: string) {
  return useQuery({
    queryKey: ["fabExplorer", "facility", name],
    queryFn: () =>
      apiFetch<FabFacility>(`/manufacturing/fab-explorer/facilities/${encodeURIComponent(name)}`),
    enabled: !!name,
  });
}

export function useFabAreas(facility?: string) {
  return useQuery({
    queryKey: ["fabExplorer", "areas", facility],
    queryFn: () => {
      const search = new URLSearchParams();
      if (facility) search.set("facility", facility);
      const qs = search.toString();
      return apiFetch<FabArea[]>(`/manufacturing/fab-explorer/areas${qs ? `?${qs}` : ""}`);
    },
=======
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
>>>>>>> mfg/agent5
    placeholderData: keepPreviousData,
  });
}

<<<<<<< HEAD
export function useFabArea(name: string) {
  return useQuery({
    queryKey: ["fabExplorer", "area", name],
    queryFn: () =>
      apiFetch<FabArea>(`/manufacturing/fab-explorer/areas/${encodeURIComponent(name)}`),
    enabled: !!name,
  });
}

export function useFabResources(area?: string, facility?: string) {
  return useQuery({
    queryKey: ["fabExplorer", "resources", area, facility],
    queryFn: () => {
      const search = new URLSearchParams();
      if (area) search.set("area", area);
      if (facility) search.set("facility", facility);
      const qs = search.toString();
      return apiFetch<FabResource[]>(`/manufacturing/fab-explorer/resources${qs ? `?${qs}` : ""}`);
    },
=======
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
>>>>>>> mfg/agent5
    placeholderData: keepPreviousData,
  });
}

<<<<<<< HEAD
export function useFabSteps(area?: string) {
  return useQuery({
    queryKey: ["fabExplorer", "steps", area],
    queryFn: () => {
      const search = new URLSearchParams();
      if (area) search.set("area", area);
      const qs = search.toString();
      return apiFetch<FabStep[]>(`/manufacturing/fab-explorer/steps${qs ? `?${qs}` : ""}`);
    },
=======
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
>>>>>>> mfg/agent5
    placeholderData: keepPreviousData,
  });
}

<<<<<<< HEAD
export function useFabMaterialsToReceive(facility?: string, remote?: boolean) {
  return useQuery({
    queryKey: ["fabExplorer", "materialsToReceive", facility, remote],
    queryFn: () => {
      const search = new URLSearchParams();
      if (facility) search.set("facility", facility);
      if (remote !== undefined) search.set("remote", String(remote));
      const qs = search.toString();
      return apiFetch<FabMaterial[]>(
        `/manufacturing/fab-explorer/materials-to-receive${qs ? `?${qs}` : ""}`,
      );
    },
    placeholderData: keepPreviousData,
  });
}

export function useFabUndispatchableMaterials(area?: string) {
  return useQuery({
    queryKey: ["fabExplorer", "undispatchableMaterials", area],
    queryFn: () => {
      const search = new URLSearchParams();
      if (area) search.set("area", area);
      const qs = search.toString();
      return apiFetch<FabMaterial[]>(
        `/manufacturing/fab-explorer/undispatchable-materials${qs ? `?${qs}` : ""}`,
      );
    },
    placeholderData: keepPreviousData,
  });
}

export function useFabDashboard(
  facility: string,
  kind: "manufacturing" | "quality" | "maintenance",
) {
  return useQuery({
    queryKey: ["fabExplorer", "dashboard", facility, kind],
    queryFn: () =>
      apiFetch<FabDashboardKpi[]>(
        `/manufacturing/fab-explorer/dashboards/${kind}?facility=${encodeURIComponent(facility)}`,
      ),
    enabled: !!facility,
=======
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
>>>>>>> mfg/agent5
  });
}
