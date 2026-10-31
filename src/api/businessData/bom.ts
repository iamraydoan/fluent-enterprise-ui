import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, postJson } from "@/api/client";
import type { Page } from "@/api/types";
import type { ListQueryParams } from "@/lib/listQuery";
import { toListSearchParams } from "@/lib/listQuery";

export interface BomRecord {
  name: string;
  description: string;
  product: string;
  version: string;
  state: string;
}

export interface BomItem {
  item: number;
  product: string;
  quantity: number;
  units: string;
  position: number;
  source: string;
}

export interface BomDetail extends BomRecord {
  type: string;
  universalState: string;
  dataGroup: string;
  changeSet: string;
  scope: string;
  baseQuantity: number;
  units: string;
  useTolerances: boolean;
  useMixedAssembly: boolean;
  items: BomItem[];
}

export function listBoms(params: ListQueryParams): Promise<Page<BomRecord>> {
  return apiFetch<Page<BomRecord>>(`/business-data/boms?${toListSearchParams(params)}`);
}

export function useBoms(params: ListQueryParams) {
  return useQuery({
    queryKey: ["business-data", "boms", params],
    queryFn: () => listBoms(params),
    placeholderData: keepPreviousData,
  });
}

export function getBom(name: string): Promise<BomDetail> {
  return apiFetch<BomDetail>(`/business-data/boms/${encodeURIComponent(name)}`);
}

export function useBomDetail(name: string) {
  return useQuery({ queryKey: ["business-data", "boms", name], queryFn: () => getBom(name) });
}

export interface BomUpsertInput extends Partial<BomDetail> {
  name: string;
}

export function createBomRecord(input: BomUpsertInput): Promise<BomDetail> {
  return postJson<BomDetail>("/business-data/boms", "POST", input);
}

export function updateBomRecord(name: string, input: Partial<BomDetail>): Promise<BomDetail> {
  return postJson<BomDetail>(`/business-data/boms/${encodeURIComponent(name)}`, "PUT", input);
}

export function setBomRecordState(name: string, state: string): Promise<BomDetail> {
  return postJson<BomDetail>(`/business-data/boms/${encodeURIComponent(name)}/state`, "PATCH", {
    state,
  });
}

const BOM_QUERY_KEY = ["business-data", "boms"];

export function useCreateBom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBomRecord,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: BOM_QUERY_KEY });
    },
  });
}

export function useUpdateBom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, input }: { name: string; input: Partial<BomDetail> }) =>
      updateBomRecord(name, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: BOM_QUERY_KEY });
    },
  });
}

export function useSetBomState() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, state }: { name: string; state: string }) =>
      setBomRecordState(name, state),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: BOM_QUERY_KEY });
    },
  });
}
