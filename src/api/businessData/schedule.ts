import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";

export interface ScheduleRecord {
  name: string;
  description: string;
  state: RecordState;
}

export interface ScheduleDetail extends ScheduleRecord {
  defaultView: string;
  defaultFrozenPeriod: number;
  timeQuantum: number;
}

export interface ScheduleListParams {
  q?: string;
  state?: string;
}

export function listSchedules(params: ScheduleListParams): Promise<ScheduleRecord[]> {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.state) search.set("state", params.state);
  return apiFetch<ScheduleRecord[]>(`/business-data/schedules?${search.toString()}`);
}

export function useSchedules(params: ScheduleListParams) {
  return useQuery({
    queryKey: ["business-data", "schedules", params],
    queryFn: () => listSchedules(params),
    placeholderData: keepPreviousData,
  });
}

export function getSchedule(name: string): Promise<ScheduleDetail> {
  return apiFetch<ScheduleDetail>(
    `/business-data/schedules/${encodeURIComponent(name)}`,
  );
}

export function useScheduleDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "schedule", name],
    queryFn: () => getSchedule(name),
  });
}
