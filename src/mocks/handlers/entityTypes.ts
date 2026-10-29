import { http, HttpResponse } from "msw";
import type { EntityTypeRecord, Page } from "@/api";
import { buildEntityTypeSeeds } from "../seeds/entityTypes";

const RECORDS = buildEntityTypeSeeds();

export interface EntityTypeListQuery {
  page: number;
  limit: number;
  sort?: string;
  q?: string;
  isRelation?: boolean;
  lockType?: string[];
  state?: string;
  createdAtGte?: string;
  createdAtLte?: string;
  updatedAtGte?: string;
  updatedAtLte?: string;
}

type SortValue = string | number | boolean;

const SORT_FIELDS: Record<string, (record: EntityTypeRecord) => SortValue> = {
  id: (record) => record.id,
  name: (record) => record.name,
  description: (record) => record.description,
  system: (record) => Number(record.system),
  relation: (record) => Number(record.isRelation),
  versioned: (record) => Number(record.versioned),
  state: (record) => record.state,
  createdAt: (record) => record.createdAt,
  updatedAt: (record) => record.updatedAt,
};

const MAX_LIMIT = 200;

export function queryEntityTypes(query: EntityTypeListQuery): Page<EntityTypeRecord> {
  let rows = RECORDS;
  if (query.q !== undefined && query.q !== "") {
    const needle = query.q.toLowerCase();
    rows = rows.filter((record) => record.name.toLowerCase().includes(needle));
  }
  if (query.isRelation !== undefined) {
    rows = rows.filter((record) => record.isRelation === query.isRelation);
  }
  if (query.lockType !== undefined && query.lockType.length > 0) {
    rows = rows.filter((record) => query.lockType?.includes(record.lockType) ?? false);
  }
  if (query.state !== undefined && query.state !== "") {
    const state = query.state.toLowerCase();
    rows = rows.filter((record) => record.state.toLowerCase() === state);
  }
  if (query.createdAtGte !== undefined && query.createdAtGte !== "") {
    rows = rows.filter((record) => record.createdAt >= (query.createdAtGte as string));
  }
  if (query.createdAtLte !== undefined && query.createdAtLte !== "") {
    rows = rows.filter((record) => record.createdAt <= (query.createdAtLte as string));
  }
  if (query.updatedAtGte !== undefined && query.updatedAtGte !== "") {
    rows = rows.filter((record) => record.updatedAt >= (query.updatedAtGte as string));
  }
  if (query.updatedAtLte !== undefined && query.updatedAtLte !== "") {
    rows = rows.filter((record) => record.updatedAt <= (query.updatedAtLte as string));
  }
  const sortKey = query.sort?.startsWith("-") ? query.sort.slice(1) : query.sort;
  const descending = query.sort?.startsWith("-") ?? false;
  const sortField = sortKey === undefined ? undefined : SORT_FIELDS[sortKey];
  if (sortField !== undefined) {
    rows = [...rows].sort((first, second) => {
      const x = sortField(first);
      const y = sortField(second);
      const comparison =
        typeof x === "number" && typeof y === "number"
          ? x - y
          : String(x).localeCompare(String(y), "en", { sensitivity: "base" });
      return descending ? -comparison : comparison;
    });
  }
  const total = rows.length;
  const limit = Math.min(Math.max(query.limit, 1), MAX_LIMIT);
  const page = Math.max(query.page, 1);
  const data = rows.slice((page - 1) * limit, page * limit);
  return { data, meta: { page, limit, total } };
}

const readParam = (params: URLSearchParams, name: string): string | undefined => {
  const value = params.get(name);
  return value === null || value === "" ? undefined : value;
};

export const entityTypeHandlers = [
  http.get("/entity-types", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const isRelationParam = params.get("isRelation");
    const lockTypeParam = params.get("lockType");
    return HttpResponse.json(
      queryEntityTypes({
        page: Number(params.get("page") ?? 1),
        limit: Number(params.get("limit") ?? 20),
        sort: readParam(params, "sort"),
        q: readParam(params, "q"),
        isRelation: isRelationParam === null ? undefined : isRelationParam === "true",
        lockType:
          lockTypeParam === null || lockTypeParam === "" ? undefined : lockTypeParam.split(","),
        state: readParam(params, "state"),
        createdAtGte: readParam(params, "createdAt[gte]"),
        createdAtLte: readParam(params, "createdAt[lte]"),
        updatedAtGte: readParam(params, "updatedAt[gte]"),
        updatedAtLte: readParam(params, "updatedAt[lte]"),
      }),
    );
  }),
];
