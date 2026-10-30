import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/api/client";
import type { Page } from "@/api/types";
import type { ListQueryParams } from "@/lib/listQuery";

export interface ContainerRecord {
  name: string;
  description: string;
  type: string;
  systemState: string;
  state: string;
}

export interface ContainerMaterial {
  position: number;
  material: string;
  product: string;
  step: string;
  quantity: string;
}

export interface ContainerPosition {
  position: number;
  material: string;
  product: string;
  step: string;
  quantity: number;
  unit: string;
}

export interface ContainerDetail extends ContainerRecord {
  universalState: string;
  dataGroup: string;
  facility: string;
  parent: string;
  onHold: boolean;
  positionUnitType: string;
  allowMixedTypes: boolean;
  usedPositions: number;
  totalPositions: number;
  capacityValidationMode: string;
  capacityForm: string;
  capacityUnit: string;
  capacityPerPosition: number;
  positionSorting: string;
  vendor: string;
  vendorId: string;
  autoGeneratePositions: boolean;
  orientation: string;
  materials: ContainerMaterial[];
  positions: ContainerPosition[];
}

export interface ContainerUpsertInput {
  name?: string;
  description?: string;
  type?: string;
  dataGroup?: string;
  facility?: string;
  vendor?: string;
  vendorId?: string;
  positionUnitType?: string;
  autoGeneratePositions?: boolean;
  totalPositions?: number;
  capacityValidationMode?: string;
  capacityForm?: string;
  capacityUnit?: string;
  capacityPerPosition?: number;
  allowMixedTypes?: boolean;
  orientation?: string;
  positionSorting?: string;
}

export type ContainerOperationType =
  | "add-container"
  | "dock"
  | "empty"
  | "make-available"
  | "make-unavailable"
  | "manage-positions"
  | "remove-container"
  | "retrieve"
  | "store"
  | "transfer-container"
  | "transfer-material"
  | "undock";

function postJson<T>(path: string, method: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function createContainerRecord(input: ContainerUpsertInput): Promise<ContainerDetail> {
  return postJson<ContainerDetail>("/business-data/containers", "POST", input);
}

export function updateContainerRecord(
  name: string,
  input: ContainerUpsertInput,
): Promise<ContainerDetail> {
  return postJson<ContainerDetail>(
    `/business-data/containers/${encodeURIComponent(name)}`,
    "PUT",
    input,
  );
}

export function setContainerRecordState(
  name: string,
  state: "Active" | "Terminated",
): Promise<ContainerDetail> {
  return postJson<ContainerDetail>(
    `/business-data/containers/${encodeURIComponent(name)}/state`,
    "PATCH",
    {
      state,
    },
  );
}

export function performContainerOperation(
  name: string,
  operation: ContainerOperationType,
  payload: Record<string, unknown>,
): Promise<ContainerDetail> {
  return postJson<ContainerDetail>(
    `/business-data/containers/${encodeURIComponent(name)}/operations`,
    "POST",
    {
      operation,
      ...payload,
    },
  );
}

export function useCreateContainer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createContainerRecord,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["business-data", "containers"] });
    },
  });
}

export function useUpdateContainer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, input }: { name: string; input: ContainerUpsertInput }) =>
      updateContainerRecord(name, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["business-data", "containers"] });
    },
  });
}

export function useSetContainerState() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, state }: { name: string; state: "Active" | "Terminated" }) =>
      setContainerRecordState(name, state),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["business-data", "containers"] });
    },
  });
}

export function useContainerOperation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      operation,
      payload,
    }: {
      name: string;
      operation: ContainerOperationType;
      payload: Record<string, unknown>;
    }) => performContainerOperation(name, operation, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["business-data", "containers"] });
    },
  });
}

export function useContainers(params: ListQueryParams) {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return useQuery<Page<ContainerRecord>>({
    queryKey: ["business-data", "containers", params],
    queryFn: () =>
      apiFetch<Page<ContainerRecord>>(`/business-data/containers?${search.toString()}`),
    placeholderData: keepPreviousData,
  });
}

export function useContainerDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "containers", name],
    queryFn: () =>
      apiFetch<ContainerDetail>(`/business-data/containers/${encodeURIComponent(name)}`),
  });
}
