import { http, HttpResponse } from "msw";
import type { GenericTableRecord, Page } from "@/api";
import { buildGenericTableDetail, buildGenericTableSeeds } from "../seeds/genericTables";

const RECORDS = buildGenericTableSeeds();

export function queryGenericTables(
  page: number,
  limit: number,
  q?: string,
  state?: string,
  kind?: string,
): Page<GenericTableRecord> {
  let rows = RECORDS;
  if (kind !== undefined && kind !== "") {
    rows = rows.filter((record) => record.kind === kind);
  }
  if (q !== undefined && q !== "") {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (record) =>
        record.name.toLowerCase().includes(needle) ||
        record.description.toLowerCase().includes(needle),
    );
  }
  if (state !== undefined && state !== "") {
    const target = state.toLowerCase();
    rows = rows.filter((record) => record.state.toLowerCase() === target);
  }
  const total = rows.length;
  const safeLimit = Math.min(Math.max(limit, 1), 200);
  const safePage = Math.max(page, 1);
  const data = rows.slice((safePage - 1) * safeLimit, safePage * safeLimit);
  return { data, meta: { page: safePage, limit: safeLimit, total } };
}

export const genericTableHandlers = [
  http.get("/generic-tables", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    const kind = params.get("kind");
    return HttpResponse.json(
      queryGenericTables(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
        kind === null || kind === "" ? undefined : kind,
      ),
    );
  }),
  http.get("/generic-tables/:name", ({ params }) => {
    const name = decodeURIComponent(String(params.name));
    return HttpResponse.json(buildGenericTableDetail(name));
  }),
];
