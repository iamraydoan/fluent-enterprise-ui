import { http, HttpResponse } from "msw";
import type { ConfigurationEntry, Page } from "@/api";
import { buildConfigurationSeeds } from "../seeds/configuration";

const RECORDS = buildConfigurationSeeds();

export interface ConfigurationListQuery {
  page: number;
  limit: number;
  sort?: string;
  q?: string;
  searchFields?: string;
  type?: string;
  userConfigs?: string;
  displayBy?: string;
}

type SortValue = string | number;

const entryName = (entry: ConfigurationEntry): string => {
  const trimmed = entry.path.endsWith("/") ? entry.path.slice(0, -1) : entry.path;
  const segment = trimmed.slice(trimmed.lastIndexOf("/") + 1);
  return segment === "" ? "Root" : segment;
};

const maskedValue = (entry: ConfigurationEntry): string =>
  entry.confidential && entry.value !== "" ? "*******" : entry.value;

const SORT_FIELDS: Record<string, (entry: ConfigurationEntry) => SortValue> = {
  path: (entry) => entry.path,
  name: (entry) => entryName(entry),
  value: (entry) => maskedValue(entry),
  type: (entry) => entry.type,
  description: (entry) => entry.description,
  modifiedOn: (entry) => entry.modifiedOn,
  modifiedBy: (entry) => entry.modifiedBy,
  createdOn: (entry) => entry.createdOn,
  createdBy: (entry) => entry.createdBy,
};

const MAX_LIMIT = 200;

function matchesSearch(entry: ConfigurationEntry, needle: string, fields: string): boolean {
  const haystacks: Record<string, string> = {
    path: entry.path,
    name: entryName(entry),
    value: maskedValue(entry),
  };
  if (fields === "path" || fields === "name" || fields === "value") {
    return haystacks[fields].toLowerCase().includes(needle);
  }
  return Object.values(haystacks).join(" ").toLowerCase().includes(needle);
}

export function queryConfigurations(query: ConfigurationListQuery): Page<ConfigurationEntry> {
  let rows = RECORDS;
  if (query.userConfigs === "false") {
    rows = rows.filter((entry) => !entry.userConfig);
  }
  if (query.type !== undefined && query.type !== "") {
    rows = rows.filter((entry) => entry.type === query.type);
  }
  if (query.q !== undefined && query.q !== "") {
    const needle = query.q.toLowerCase();
    const fields = query.searchFields ?? "all";
    rows = rows.filter((entry) => matchesSearch(entry, needle, fields));
  }
  const sortKey = query.sort?.startsWith("-") ? query.sort.slice(1) : query.sort;
  const descending = query.sort?.startsWith("-") ?? false;
  const sortField = sortKey === undefined ? undefined : SORT_FIELDS[sortKey];
  const ordered = [...rows];
  if (sortField !== undefined) {
    ordered.sort((first, second) => {
      const x = sortField(first);
      const y = sortField(second);
      const comparison =
        typeof x === "number" && typeof y === "number"
          ? x - y
          : String(x).localeCompare(String(y), "en", { sensitivity: "base" });
      return descending ? -comparison : comparison;
    });
  } else if (query.displayBy === "path") {
    ordered.sort((first, second) => first.path.localeCompare(second.path));
  } else if (query.displayBy === "name") {
    ordered.sort((first, second) =>
      entryName(first).localeCompare(entryName(second), "en", { sensitivity: "base" }),
    );
  } else {
    ordered.sort((first, second) => second.modifiedOn - first.modifiedOn);
  }
  const total = ordered.length;
  const limit = Math.min(Math.max(query.limit, 1), MAX_LIMIT);
  const page = Math.max(query.page, 1);
  const data = ordered.slice((page - 1) * limit, page * limit);
  return { data, meta: { page, limit, total } };
}

export function listConfigurationTree(): string[] {
  const paths = RECORDS.map((entry) => entry.path);
  return paths.filter((path) => paths.some((other) => other !== path && other.startsWith(path)));
}

const readParam = (params: URLSearchParams, name: string): string | undefined => {
  const value = params.get(name);
  return value === null || value === "" ? undefined : value;
};

export const configurationHandlers = [
  http.get("/configurations/tree", () => HttpResponse.json(listConfigurationTree())),
  http.get("/configurations/:path", ({ params }) => {
    const path = decodeURIComponent(String(params.path));
    const entry = RECORDS.find((candidate) => candidate.path === path);
    if (!entry) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(entry);
  }),
  http.get("/configurations", ({ request }) => {
    const params = new URL(request.url).searchParams;
    return HttpResponse.json(
      queryConfigurations({
        page: Number(params.get("page") ?? 1),
        limit: Number(params.get("limit") ?? 20),
        sort: readParam(params, "sort"),
        q: readParam(params, "q"),
        searchFields: readParam(params, "searchFields"),
        type: readParam(params, "type"),
        userConfigs: readParam(params, "userConfigs"),
        displayBy: readParam(params, "displayBy"),
      }),
    );
  }),
];
