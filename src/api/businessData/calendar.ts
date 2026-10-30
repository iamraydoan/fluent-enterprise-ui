import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/api/client";
import type { Page } from "@/api/types";
import type { ListQueryParams } from "@/lib/listQuery";

export interface CalendarRecord {
  name: string;
  description: string;
  state: string;
}

export interface WeekDay {
  day: string;
  shiftDefinition: string;
  costOvertimeFactor: number;
}

export interface CalendarDetail extends CalendarRecord {
  universalState: string;
  dataGroup: string;
  timeZone: string;
  clockInEarlyStartMinutes: number;
  enterpriseWideReportingDimension: boolean;
  fiscalStartDay: number;
  fiscalStartMonth: string;
  weekStartDay: string;
  dayStartTime: string;
  weekDefinition: WeekDay[];
}

export function useCalendars(params: ListQueryParams) {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return useQuery<Page<CalendarRecord>>({
    queryKey: ["business-data", "calendars", params],
    queryFn: () => apiFetch<Page<CalendarRecord>>(`/business-data/calendars?${search.toString()}`),
    placeholderData: keepPreviousData,
  });
}

export function useCalendarDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "calendars", name],
    queryFn: () => apiFetch<CalendarDetail>(`/business-data/calendars/${encodeURIComponent(name)}`),
  });
}

export interface CalendarUpsertInput extends Partial<CalendarDetail> {
  name: string;
}

function postJson<T>(path: string, method: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function createCalendarRecord(input: CalendarUpsertInput): Promise<CalendarDetail> {
  return postJson<CalendarDetail>("/business-data/calendars", "POST", input);
}

export function updateCalendarRecord(
  name: string,
  input: Partial<CalendarDetail>,
): Promise<CalendarDetail> {
  return postJson<CalendarDetail>(
    `/business-data/calendars/${encodeURIComponent(name)}`,
    "PUT",
    input,
  );
}

export function setCalendarRecordState(name: string, state: string): Promise<CalendarDetail> {
  return postJson<CalendarDetail>(
    `/business-data/calendars/${encodeURIComponent(name)}/state`,
    "PATCH",
    { state },
  );
}

const CALENDAR_QUERY_KEY = ["business-data", "calendars"];

export function useCreateCalendar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCalendarRecord,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CALENDAR_QUERY_KEY });
    },
  });
}

export function useUpdateCalendar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, input }: { name: string; input: Partial<CalendarDetail> }) =>
      updateCalendarRecord(name, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CALENDAR_QUERY_KEY });
    },
  });
}

export function useSetCalendarState() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, state }: { name: string; state: string }) =>
      setCalendarRecordState(name, state),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CALENDAR_QUERY_KEY });
    },
  });
}
