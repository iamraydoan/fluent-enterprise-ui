import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { toListSearchParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface DocumentRecord {
  name: string;
  description: string;
  type: string;
  author: string;
  creationDate: number;
  state: RecordState;
}

export interface DocumentTrackingEntry {
  employee: string;
  readAndUnderstoodDate: number;
}

export interface DocumentDetail extends DocumentRecord {
  dataGroup: string;
  source: string;
  file: string;
  changeDescription: string;
  requireSignature: boolean;
  expirationDays: string;
  folder: string;
  ownerRole: string;
  group: string;
  link: string;
  versionLink: string;
  keywords: string;
  distributionNewVersion: string;
  distributionNewEffectiveVersion: string;
  tracking: DocumentTrackingEntry[];
}

export function listDocuments(params: ListQueryParams): Promise<Page<DocumentRecord>> {
  return apiFetch<Page<DocumentRecord>>(`/documents?${toListSearchParams(params)}`);
}

export function useDocuments(params: ListQueryParams) {
  return useQuery({
    queryKey: ["documents", params],
    queryFn: () => listDocuments(params),
    placeholderData: keepPreviousData,
  });
}

export function getDocument(name: string): Promise<DocumentDetail> {
  return apiFetch<DocumentDetail>(`/documents/${encodeURIComponent(name)}`);
}

export function useDocumentDetail(name: string) {
  return useQuery({ queryKey: ["document", name], queryFn: () => getDocument(name) });
}
