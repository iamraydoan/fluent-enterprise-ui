import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface ShiftLogbookRecord {
  name: string;
  area: string;
  shiftDefinition: string;
  shift: string;
  state: RecordState;
  systemState: string;
  createdOn: string;
}

export interface ShiftLogbookEntry {
  title: string;
  category: string;
  severity: string;
  resource: string;
  description: string;
  author: string;
  createdOn: string;
}

export interface ShiftLogbookDetail extends ShiftLogbookRecord {
  dataGroup: string;
  calendarDay: string;
  team: string;
  entries: ShiftLogbookEntry[];
}

export type ShiftLogbookListParams = ListQueryParams;

export function listShiftLogbooks(
  params: ShiftLogbookListParams,
): Promise<Page<ShiftLogbookRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<ShiftLogbookRecord>>(`/business-data/shift-logbooks?${search.toString()}`);
}

export function useShiftLogbooks(params: ShiftLogbookListParams) {
  return useQuery({
    queryKey: ["business-data", "shift-logbooks", params],
    queryFn: () => listShiftLogbooks(params),
    placeholderData: keepPreviousData,
  });
}

export function getShiftLogbook(name: string): Promise<ShiftLogbookDetail> {
  return apiFetch<ShiftLogbookDetail>(`/business-data/shift-logbooks/${encodeURIComponent(name)}`);
}

export function useShiftLogbookDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "shift-logbook", name],
    queryFn: () => getShiftLogbook(name),
  });
}
