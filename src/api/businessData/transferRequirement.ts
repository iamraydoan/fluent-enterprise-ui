import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { toListSearchParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface TransferRequirementRecord {
  name: string;
  description: string;
  sourceLocation: string;
  destinationLocation: string;
  requirementState: string;
  state: RecordState;
}

export interface TransferRequirementItem {
  product: string;
  quantity: number;
  releasedQuantity: number;
}

export interface TransferRequirementDetail extends TransferRequirementRecord {
  dataGroup: string;
  items: TransferRequirementItem[];
}

export type TransferRequirementListParams = ListQueryParams;

export function listTransferRequirements(
  params: TransferRequirementListParams,
): Promise<Page<TransferRequirementRecord>> {
  const search = toListSearchParams(params);
  return apiFetch<Page<TransferRequirementRecord>>(
    `/business-data/transfer-requirements?${search.toString()}`,
  );
}

export function useTransferRequirements(params: TransferRequirementListParams) {
  return useQuery({
    queryKey: ["business-data", "transfer-requirements", params],
    queryFn: () => listTransferRequirements(params),
    placeholderData: keepPreviousData,
  });
}

export function getTransferRequirement(name: string): Promise<TransferRequirementDetail> {
  return apiFetch<TransferRequirementDetail>(
    `/business-data/transfer-requirements/${encodeURIComponent(name)}`,
  );
}

export function useTransferRequirementDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "transfer-requirement", name],
    queryFn: () => getTransferRequirement(name),
  });
}
