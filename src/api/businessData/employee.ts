import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface EmployeeRecord {
  name: string;
  description: string;
  user: string;
  number: string;
  team: string;
  state: RecordState;
}

export interface EmployeeDetail extends EmployeeRecord {
  type: string;
  dataGroup: string;
  requireClockIn: boolean;
  enableAutomaticClockIn: boolean;
  lastClockInDate: number | null;
  clockedState: string;
  automaticClockOutAtEndOfShift: boolean;
  area: string;
  calendar: string;
  manager: string;
  position: string;
  workgroup: string;
  shiftplan: string;
  costCenter: string;
  costPerHour: number;
}

export function listEmployees(params: ListQueryParams): Promise<Page<EmployeeRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<EmployeeRecord>>(`/employees?${search.toString()}`);
}

export function useEmployees(params: ListQueryParams) {
  return useQuery({
    queryKey: ["employees", params],
    queryFn: () => listEmployees(params),
    placeholderData: keepPreviousData,
  });
}

export function getEmployee(name: string): Promise<EmployeeDetail> {
  return apiFetch<EmployeeDetail>(`/employees/${encodeURIComponent(name)}`);
}

export function useEmployeeDetail(name: string) {
  return useQuery({ queryKey: ["employee", name], queryFn: () => getEmployee(name) });
}
