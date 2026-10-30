import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/api/client";
import type { Page } from "@/api/types";
import type { ListQueryParams } from "@/lib/listQuery";

export interface AreaRecord {
  name: string;
  description: string;
  facility: string;
  type: string;
  state: string;
}

export interface AreaDetail extends AreaRecord {
  universalState: string;
  dataGroup: string;
  displayOrder: number;
  areaType: string;
  calendar: string;
  schedule: string;
  costCenter: string;
  enableShiftLogbook: boolean;
  steps: string[];
  resources: string[];
  subAreas: string[];
}

export function listAreas(params: ListQueryParams): Promise<Page<AreaRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<AreaRecord>>(`/business-data/areas?${search.toString()}`);
}

export function useAreas(params: ListQueryParams) {
  return useQuery({
    queryKey: ["business-data", "areas", params],
    queryFn: () => listAreas(params),
    placeholderData: keepPreviousData,
  });
}

export function getArea(name: string): Promise<AreaDetail> {
  return apiFetch<AreaDetail>(`/business-data/areas/${encodeURIComponent(name)}`);
}

export function useAreaDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "areas", name],
    queryFn: () => getArea(name),
  });
}

export interface AreaUpsertInput extends Partial<AreaDetail> {
  name: string;
}

function postJson<T>(path: string, method: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function createAreaRecord(input: AreaUpsertInput): Promise<AreaDetail> {
  return postJson<AreaDetail>("/business-data/areas", "POST", input);
}

export function updateAreaRecord(name: string, input: Partial<AreaDetail>): Promise<AreaDetail> {
  return postJson<AreaDetail>(`/business-data/areas/${encodeURIComponent(name)}`, "PUT", input);
}

export function setAreaRecordState(
  name: string,
  state: "Active" | "Terminated",
): Promise<AreaDetail> {
  return postJson<AreaDetail>(`/business-data/areas/${encodeURIComponent(name)}/state`, "PATCH", {
    state,
  });
}

export function useCreateArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAreaRecord,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["business-data", "areas"] });
    },
  });
}

export function useUpdateArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, input }: { name: string; input: Partial<AreaDetail> }) =>
      updateAreaRecord(name, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["business-data", "areas"] });
    },
  });
}

export function useSetAreaState() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, state }: { name: string; state: "Active" | "Terminated" }) =>
      setAreaRecordState(name, state),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["business-data", "areas"] });
    },
  });
}
