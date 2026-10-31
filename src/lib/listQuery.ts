export interface ListQueryParams {
  page: number;
  limit: number;
  sort?: string;
  filters?: Record<string, string>;
}

export interface ListQueryResult<TRow> {
  data?: { data: TRow[]; meta: { total: number } };
  isLoading: boolean;
  refetch?: () => void;
}

const RESERVED_KEYS = new Set(["page", "limit", "sort", "filters"]);

function shouldSkipValue(value: unknown): boolean {
  return (
    value === undefined || value === null || value === "" || value === "all" || value === false
  );
}

export function toListSearchParams<T extends object>(query: T): URLSearchParams;
export function toListSearchParams(query: Partial<ListQueryParams>): URLSearchParams {
  const search = new URLSearchParams();
  if (query.page !== undefined) {
    search.set("page", String(query.page));
  }
  if (query.limit !== undefined) {
    search.set("limit", String(query.limit));
  }
  if (query.sort) {
    search.set("sort", query.sort);
  }
  for (const [key, value] of Object.entries(query.filters ?? {})) {
    if (!shouldSkipValue(value)) {
      search.set(key, value);
    }
  }
  const extra = query as unknown as Record<string, unknown>;
  for (const [key, value] of Object.entries(extra)) {
    if (RESERVED_KEYS.has(key) || shouldSkipValue(value)) {
      continue;
    }
    search.set(key, String(value));
  }
  return search;
}
