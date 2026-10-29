import { http, HttpResponse } from "msw";
import type { AiAgentRecord, Page } from "@/api";
import { buildAiAgentDetail, buildAiAgentSeeds } from "../seeds/aiAgent";

const RECORDS = buildAiAgentSeeds();

export interface AiAgentListQuery {
  page: number;
  limit: number;
  sort?: string;
  q?: string;
}

type SortValue = string | number;

const SORT_FIELDS: Record<string, (record: AiAgentRecord) => SortValue> = {
  name: (record) => record.name,
  description: (record) => record.description,
  mcpServers: (record) => record.mcpServers,
  state: (record) => record.state,
};

const MAX_LIMIT = 200;

export function queryAiAgents(query: AiAgentListQuery): Page<AiAgentRecord> {
  let rows = RECORDS;
  if (query.q !== undefined && query.q !== "") {
    const needle = query.q.toLowerCase();
    rows = rows.filter((record) =>
      `${record.name} ${record.description} ${record.mcpServers} ${record.state}`
        .toLowerCase()
        .includes(needle),
    );
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

export const aiAgentHandlers = [
  http.get("/ai-agents", ({ request }) => {
    const params = new URL(request.url).searchParams;
    return HttpResponse.json(
      queryAiAgents({
        page: Number(params.get("page") ?? 1),
        limit: Number(params.get("limit") ?? 20),
        sort: readParam(params, "sort"),
        q: readParam(params, "q"),
      }),
    );
  }),
  http.get("/ai-agents/:name", ({ params }) =>
    HttpResponse.json(buildAiAgentDetail(String(params.name))),
  ),
];
