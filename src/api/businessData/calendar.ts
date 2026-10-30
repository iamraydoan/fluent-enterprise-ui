import { keepPreviousData, useQuery } from "@tanstack/react-query";
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
