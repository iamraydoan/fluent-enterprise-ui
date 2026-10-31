import type { Page } from "@/api";

export function paginate<T>(rows: T[], page: number, limit: number): Page<T> {
  const start = (page - 1) * limit;
  return {
    data: rows.slice(start, start + limit),
    meta: { total: rows.length, page, limit },
  };
}

export function filterByQuery<T>(rows: T[], q: string | undefined, fields: (keyof T)[]): T[] {
  if (q === undefined || q === "") {
    return rows;
  }
  const needle = q.toLowerCase();
  return rows.filter((row) =>
    fields.some((field) => {
      const value = row[field];
      return typeof value === "string" && value.toLowerCase().includes(needle);
    }),
  );
}

export function filterByState<T extends { state: string }>(
  rows: T[],
  state: string | undefined,
): T[] {
  if (state === undefined || state === "" || state === "all") {
    return rows;
  }
  const target = state.toLowerCase();
  return rows.filter((row) => row.state.toLowerCase() === target);
}
