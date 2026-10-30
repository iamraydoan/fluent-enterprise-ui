import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface FacilityRecord {
  name: string;
  description: string;
  type: string;
  site: string;
  state: RecordState;
}

export interface FacilityDetail extends FacilityRecord {
  dataGroup: string;
  displayOrder: number;
  defaultCalendar: string;
  remote: boolean;
  terminateOnShipToThisFacility: boolean;
}

export function listFacilities(params: ListQueryParams): Promise<Page<FacilityRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<FacilityRecord>>(`/facilities?${search.toString()}`);
}

export function useFacilities(params: ListQueryParams) {
  return useQuery({
    queryKey: ["facilities", params],
    queryFn: () => listFacilities(params),
    placeholderData: keepPreviousData,
  });
}

export function getFacility(name: string): Promise<FacilityDetail> {
  return apiFetch<FacilityDetail>(`/facilities/${encodeURIComponent(name)}`);
}

export function useFacilityDetail(name: string) {
  return useQuery({ queryKey: ["facility", name], queryFn: () => getFacility(name) });
}
