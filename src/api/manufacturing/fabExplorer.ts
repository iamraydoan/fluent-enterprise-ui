import { keepPreviousData, useQuery } from "@tanstack/react-query";
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
}

export interface FabResource {
  name: string;
  description: string;
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
    placeholderData: keepPreviousData,
  });
}

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
    placeholderData: keepPreviousData,
  });
}

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
    placeholderData: keepPreviousData,
  });
}

export function useFabSteps(area?: string) {
  return useQuery({
    queryKey: ["fabExplorer", "steps", area],
    queryFn: () => {
      const search = new URLSearchParams();
      if (area) search.set("area", area);
      const qs = search.toString();
      return apiFetch<FabStep[]>(`/manufacturing/fab-explorer/steps${qs ? `?${qs}` : ""}`);
    },
    placeholderData: keepPreviousData,
  });
}

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
  });
}
