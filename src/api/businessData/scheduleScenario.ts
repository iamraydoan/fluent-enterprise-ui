import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { toListSearchParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";

export interface ScheduleScenarioRecord {
  name: string;
  description: string;
  schedule: string;
  state: RecordState;
}

export interface ScheduleScenarioDetail extends ScheduleScenarioRecord {
  generationType: string;
  scenarioState: string;
}

export interface ScheduleScenarioListParams {
  q?: string;
  state?: string;
}

export function listScheduleScenarios(
  params: ScheduleScenarioListParams,
): Promise<ScheduleScenarioRecord[]> {
  const search = toListSearchParams(params);
  return apiFetch<ScheduleScenarioRecord[]>(
    `/business-data/schedule-scenarios?${search.toString()}`,
  );
}

export function useScheduleScenarios(params: ScheduleScenarioListParams) {
  return useQuery({
    queryKey: ["business-data", "schedule-scenarios", params],
    queryFn: () => listScheduleScenarios(params),
    placeholderData: keepPreviousData,
  });
}

export function getScheduleScenario(name: string): Promise<ScheduleScenarioDetail> {
  return apiFetch<ScheduleScenarioDetail>(
    `/business-data/schedule-scenarios/${encodeURIComponent(name)}`,
  );
}

export function useScheduleScenarioDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "schedule-scenario", name],
    queryFn: () => getScheduleScenario(name),
  });
}
