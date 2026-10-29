import { http, HttpResponse } from "msw";
import type { AppRecord, Page } from "@/api";
import { buildAppSeeds } from "../seeds/apps";

const RECORDS = buildAppSeeds();

export interface AppListQuery {
  page: number;
  limit: number;
  sort?: string;
  q?: string;
}

const SORT_FIELDS: Record<string, (record: AppRecord) => string> = {
  name: (record) => record.name,
  description: (record) => record.description,
  type: (record) => record.type,
  state: (record) => record.state,
};

const MAX_LIMIT = 200;

export function queryApps(query: AppListQuery): Page<AppRecord> {
  let rows = RECORDS;
  if (query.q !== undefined && query.q !== "") {
    const needle = query.q.toLowerCase();
    rows = rows.filter((record) =>
      `${record.name} ${record.description} ${record.type} ${record.state}`
        .toLowerCase()
        .includes(needle),
    );
  }
  const sortKey = query.sort?.startsWith("-") ? query.sort.slice(1) : query.sort;
  const descending = query.sort?.startsWith("-") ?? false;
  const sortField = sortKey === undefined ? undefined : SORT_FIELDS[sortKey];
  if (sortField !== undefined) {
    rows = [...rows].sort((first, second) => {
      const comparison = sortField(first).localeCompare(sortField(second), "en", {
        sensitivity: "base",
      });
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

export const appHandlers = [
  http.get("/apps", ({ request }) => {
    const params = new URL(request.url).searchParams;
    return HttpResponse.json(
      queryApps({
        page: Number(params.get("page") ?? 1),
        limit: Number(params.get("limit") ?? 20),
        sort: readParam(params, "sort"),
        q: readParam(params, "q"),
      }),
    );
  }),
];
