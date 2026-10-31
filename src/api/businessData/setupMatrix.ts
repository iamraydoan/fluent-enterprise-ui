import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { toListSearchParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";

export interface SetupMatrixRecord {
  name: string;
  description: string;
  timeScale: string;
  state: RecordState;
}

export interface SetupMatrixDetail extends SetupMatrixRecord {
  useZeroInDiagonal: boolean;
}

export interface SetupMatrixListParams {
  q?: string;
  state?: string;
}

export function listSetupMatrices(params: SetupMatrixListParams): Promise<SetupMatrixRecord[]> {
  return apiFetch<SetupMatrixRecord[]>(
    `/business-data/setup-matrices?${toListSearchParams(params)}`,
  );
}

export function useSetupMatrices(params: SetupMatrixListParams) {
  return useQuery({
    queryKey: ["business-data", "setup-matrices", params],
    queryFn: () => listSetupMatrices(params),
    placeholderData: keepPreviousData,
  });
}

export function getSetupMatrix(name: string): Promise<SetupMatrixDetail> {
  return apiFetch<SetupMatrixDetail>(`/business-data/setup-matrices/${encodeURIComponent(name)}`);
}

export function useSetupMatrixDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "setup-matrix", name],
    queryFn: () => getSetupMatrix(name),
  });
}
