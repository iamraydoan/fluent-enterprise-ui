import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { toListSearchParams } from "@/lib/listQuery";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface PrintableDocumentRecord {
  name: string;
  description: string;
  documentType: string;
  state: string;
  version: string;
}

export interface PrintableDocumentDetail extends PrintableDocumentRecord {
  detailNote?: string;
}

export function listPrintableDocuments(
  params: ListQueryParams,
): Promise<Page<PrintableDocumentRecord>> {
  const search = toListSearchParams(params);
  return apiFetch<Page<PrintableDocumentRecord>>(
    `/business-data/printable-documents?${search.toString()}`,
  );
}

export function usePrintableDocuments(params: ListQueryParams) {
  return useQuery({
    queryKey: ["business-data", "printable-documents", params],
    queryFn: () => listPrintableDocuments(params),
    placeholderData: keepPreviousData,
  });
}

export function getPrintableDocument(name: string): Promise<PrintableDocumentDetail> {
  return apiFetch<PrintableDocumentDetail>(
    `/business-data/printable-documents/${encodeURIComponent(name)}`,
  );
}

export function usePrintableDocumentDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "printable-document", name],
    queryFn: () => getPrintableDocument(name),
  });
}
