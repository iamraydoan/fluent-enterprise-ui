import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { toListSearchParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface MapRecord {
  name: string;
  description: string;
  mapDefinition: string;
  state: RecordState;
}

export interface MapLayer {
  name: string;
  type: string;
  units: string;
}

export interface MapDetail extends MapRecord {
  step: string;
  resource: string;
  material: string;
  layers: MapLayer[];
}

export function listMaps(params: ListQueryParams): Promise<Page<MapRecord>> {
  return apiFetch<Page<MapRecord>>(`/maps?${toListSearchParams(params)}`);
}

export function useMaps(params: ListQueryParams) {
  return useQuery({
    queryKey: ["maps", params],
    queryFn: () => listMaps(params),
    placeholderData: keepPreviousData,
  });
}

export function getMap(name: string): Promise<MapDetail> {
  return apiFetch<MapDetail>(`/maps/${encodeURIComponent(name)}`);
}

export function useMapDetail(name: string) {
  return useQuery({ queryKey: ["map", name], queryFn: () => getMap(name) });
}
