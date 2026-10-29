import { describe, expect, test } from "vitest";
import { queryEntityTypes } from "./entityTypes";

describe("queryEntityTypes", () => {
  test("paginates with meta totals", () => {
    const result = queryEntityTypes({ page: 1, limit: 25 });
    expect(result.data).toHaveLength(25);
    expect(result.meta).toEqual({ page: 1, limit: 25, total: 393 });
    const second = queryEntityTypes({ page: 2, limit: 25 });
    expect(second.data[0].id).not.toBe(result.data[0].id);
    expect(second.meta.page).toBe(2);
  });

  test("clamps limit to the spec maximum", () => {
    const result = queryEntityTypes({ page: 1, limit: 500 });
    expect(result.meta.limit).toBe(200);
    expect(result.data).toHaveLength(200);
  });

  test("returns an empty page beyond the last page", () => {
    const result = queryEntityTypes({ page: 99, limit: 25 });
    expect(result.data).toHaveLength(0);
    expect(result.meta.total).toBe(393);
  });

  test("sorts by name ascending and descending", () => {
    const asc = queryEntityTypes({ page: 1, limit: 200, sort: "name" });
    expect(asc.data[0].name).toBe("AIAgent");
    const names = asc.data.map((row) => row.name);
    const sorted = [...names].sort((first, second) =>
      first.localeCompare(second, "en", { sensitivity: "base" }),
    );
    expect(names).toEqual(sorted);
    const desc = queryEntityTypes({ page: 1, limit: 200, sort: "-name" });
    const descNames = desc.data.map((row) => row.name);
    const descSorted = [...descNames].sort((first, second) =>
      second.localeCompare(first, "en", { sensitivity: "base" }),
    );
    expect(descNames).toEqual(descSorted);
  });

  test("sorts by createdAt", () => {
    const result = queryEntityTypes({ page: 1, limit: 393, sort: "createdAt" });
    const stamps = result.data.map((row) => row.createdAt);
    expect([...stamps].sort()).toEqual(stamps);
  });

  test("ignores unknown sort values", () => {
    const result = queryEntityTypes({ page: 1, limit: 5, sort: "nope" });
    expect(result.data).toHaveLength(5);
    expect(result.meta.total).toBe(393);
  });

  test("searches names case-insensitively", () => {
    const result = queryEntityTypes({ page: 1, limit: 393, q: "aIaGeNt" });
    expect(result.meta.total).toBeGreaterThan(0);
    expect(result.data.every((row) => row.name.toLowerCase().includes("aiagent"))).toBe(true);
  });

  test("filters relations", () => {
    const relations = queryEntityTypes({ page: 1, limit: 393, isRelation: true });
    expect(relations.meta.total).toBeGreaterThan(0);
    expect(relations.data.every((row) => row.isRelation)).toBe(true);
    const nonRelations = queryEntityTypes({ page: 1, limit: 393, isRelation: false });
    expect(nonRelations.data.every((row) => !row.isRelation)).toBe(true);
    expect(relations.meta.total + nonRelations.meta.total).toBe(393);
  });

  test("filters lock types", () => {
    const result = queryEntityTypes({ page: 1, limit: 393, lockType: ["LOCK_SOURCE"] });
    expect(result.meta.total).toBeGreaterThan(0);
    expect(result.data.every((row) => row.lockType === "LOCK_SOURCE")).toBe(true);
  });

  test("filters states", () => {
    const active = queryEntityTypes({ page: 1, limit: 393, state: "active" });
    expect(active.data.every((row) => row.state === "Active")).toBe(true);
    const terminated = queryEntityTypes({ page: 1, limit: 393, state: "terminated" });
    expect(terminated.data.every((row) => row.state === "Terminated")).toBe(true);
    expect(active.meta.total + terminated.meta.total).toBe(393);
  });

  test("filters by date ranges", () => {
    const middle = queryEntityTypes({ page: 1, limit: 393 });
    const pivot = middle.data[100].createdAt;
    const gte = queryEntityTypes({ page: 1, limit: 393, createdAtGte: pivot });
    expect(gte.data.every((row) => row.createdAt >= pivot)).toBe(true);
    const lte = queryEntityTypes({ page: 1, limit: 393, createdAtLte: pivot });
    expect(lte.data.every((row) => row.createdAt <= pivot)).toBe(true);
    expect(gte.meta.total + lte.meta.total).toBeGreaterThanOrEqual(393);
  });
});
