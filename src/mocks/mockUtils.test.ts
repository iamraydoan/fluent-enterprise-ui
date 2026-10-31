import { describe, expect, it } from "vitest";
import { filterByQuery, filterByState, paginate } from "@/mocks/mockUtils";

interface Row {
  name: string;
  description: string;
  state: string;
}

const ROWS: Row[] = [
  { name: "Alpha", description: "first item", state: "Active" },
  { name: "Beta", description: "second item", state: "Inactive" },
  { name: "Gamma", description: "third alpha", state: "Active" },
];

describe("paginate", () => {
  it("returns the first page slice with meta", () => {
    const result = paginate(ROWS, 1, 2);
    expect(result.data).toHaveLength(2);
    expect(result.data[0].name).toBe("Alpha");
    expect(result.meta).toEqual({ total: 3, page: 1, limit: 2 });
  });

  it("returns the second page slice", () => {
    const result = paginate(ROWS, 2, 2);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe("Gamma");
  });

  it("returns empty data beyond the last page", () => {
    const result = paginate(ROWS, 5, 10);
    expect(result.data).toHaveLength(0);
    expect(result.meta.total).toBe(3);
  });

  it("handles empty input", () => {
    const result = paginate([], 1, 10);
    expect(result.data).toEqual([]);
    expect(result.meta.total).toBe(0);
  });
});

describe("filterByQuery", () => {
  it("matches case-insensitively across fields", () => {
    const result = filterByQuery(ROWS, "ALPHA", ["name", "description"]);
    expect(result).toHaveLength(2);
  });

  it("matches substrings in any listed field", () => {
    const result = filterByQuery(ROWS, "second", ["name", "description"]);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Beta");
  });

  it("returns all rows for undefined or empty query", () => {
    expect(filterByQuery(ROWS, undefined, ["name"])).toBe(ROWS);
    expect(filterByQuery(ROWS, "", ["name"])).toBe(ROWS);
  });

  it("returns empty when nothing matches", () => {
    expect(filterByQuery(ROWS, "zzz", ["name", "description"])).toEqual([]);
  });
});

describe("filterByState", () => {
  it("matches state case-insensitively", () => {
    const result = filterByState(ROWS, "active");
    expect(result).toHaveLength(2);
  });

  it("returns all rows for undefined, empty, or all", () => {
    expect(filterByState(ROWS, undefined)).toBe(ROWS);
    expect(filterByState(ROWS, "")).toBe(ROWS);
    expect(filterByState(ROWS, "all")).toBe(ROWS);
  });

  it("returns empty when no state matches", () => {
    expect(filterByState(ROWS, "deleted")).toEqual([]);
  });
});
