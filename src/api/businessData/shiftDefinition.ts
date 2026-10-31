import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { toListSearchParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface ShiftDefinitionRecord {
  name: string;
  description: string;
  calendar: string;
  startTime: string;
  state: RecordState;
}

export interface ShiftDefinitionShift {
  name: string;
  startTime: string;
  endTime: string;
  code: string;
  costOvertimeFactor: number;
  teamPattern: string;
}

export interface ShiftDefinitionDetail extends ShiftDefinitionRecord {
  dataGroup: string;
  shifts: ShiftDefinitionShift[];
}

export type ShiftDefinitionListParams = ListQueryParams;

export function listShiftDefinitions(
  params: ShiftDefinitionListParams,
): Promise<Page<ShiftDefinitionRecord>> {
  const search = toListSearchParams(params);
  return apiFetch<Page<ShiftDefinitionRecord>>(
    `/business-data/shift-definitions?${search.toString()}`,
  );
}

export function useShiftDefinitions(params: ShiftDefinitionListParams) {
  return useQuery({
    queryKey: ["business-data", "shift-definitions", params],
    queryFn: () => listShiftDefinitions(params),
    placeholderData: keepPreviousData,
  });
}

export function getShiftDefinition(name: string): Promise<ShiftDefinitionDetail> {
  return apiFetch<ShiftDefinitionDetail>(
    `/business-data/shift-definitions/${encodeURIComponent(name)}`,
  );
}

export function useShiftDefinitionDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "shift-definition", name],
    queryFn: () => getShiftDefinition(name),
  });
}
