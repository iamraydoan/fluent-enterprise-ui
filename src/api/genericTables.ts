import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { toListSearchParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "./client";
import type { Page } from "./types";

export type GenericTableKind = "generic" | "lookup" | "smart";

export interface GenericTableRecord {
  name: string;
  description: string;
  isSystem: boolean;
  state: RecordState;
  kind: GenericTableKind;
}

export type GenericTableColumnType = "string" | "boolean" | "number";

export interface GenericTableColumnDef {
  name: string;
  dataType: GenericTableColumnType;
  isKey: boolean;
}

export interface GenericTableDetail extends GenericTableRecord {
  dataGroup: string;
  enableHistory: boolean;
  historyDaysDefault: number;
  localizedMessageKey: string;
  columns: GenericTableColumnDef[];
  rows: Record<string, unknown>[];
}

export function listGenericTables(
  params: ListQueryParams & { kind?: GenericTableKind },
): Promise<Page<GenericTableRecord>> {
  const search = toListSearchParams(params);
  return apiFetch<Page<GenericTableRecord>>(`/generic-tables?${search.toString()}`);
}

export function useGenericTables(params: ListQueryParams & { kind?: GenericTableKind }) {
  return useQuery({
    queryKey: ["generic-tables", params],
    queryFn: () => listGenericTables(params),
    placeholderData: keepPreviousData,
  });
}

export function getGenericTable(name: string): Promise<GenericTableDetail> {
  return apiFetch<GenericTableDetail>(`/generic-tables/${encodeURIComponent(name)}`);
}

export function useGenericTable(name: string) {
  return useQuery({ queryKey: ["generic-table", name], queryFn: () => getGenericTable(name) });
}
