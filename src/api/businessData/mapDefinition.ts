import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface MapDefinitionRecord {
  name: string;
  description: string;
  type: string;
  state: RecordState;
}

export interface MapDefinitionLayer {
  name: string;
  layerType: string;
  dataType: string;
  isDefault: boolean;
}

export interface MapDefinitionDetail extends MapDefinitionRecord {
  layoutType: string;
  height: number;
  width: number;
  dimensionUnits: string;
  rows: number;
  columns: number;
  maskFile: string;
  backgroundFile: string;
  emptyUnitsColor: string;
  gridLinesColor: string;
  showGridLinesByDefault: boolean;
  rulerMode: string;
  showRulerByDefault: boolean;
  notch: string;
  defaultRotation: string;
  materialUnits: string;
  layers: MapDefinitionLayer[];
}

export function listMapDefinitions(params: ListQueryParams): Promise<Page<MapDefinitionRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<MapDefinitionRecord>>(`/map-definitions?${search.toString()}`);
}

export function useMapDefinitions(params: ListQueryParams) {
  return useQuery({
    queryKey: ["map-definitions", params],
    queryFn: () => listMapDefinitions(params),
    placeholderData: keepPreviousData,
  });
}

export function getMapDefinition(name: string): Promise<MapDefinitionDetail> {
  return apiFetch<MapDefinitionDetail>(`/map-definitions/${encodeURIComponent(name)}`);
}

export function useMapDefinitionDetail(name: string) {
  return useQuery({
    queryKey: ["map-definition", name],
    queryFn: () => getMapDefinition(name),
  });
}
