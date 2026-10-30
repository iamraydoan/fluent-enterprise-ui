import { describe, expect, test } from "vitest";
import { buildConfigurationSeeds } from "../seeds/configuration";
import { listConfigurationTree, queryConfigurations } from "./configuration";

const SEED_COUNT = buildConfigurationSeeds().length;

describe("queryConfigurations", () => {
  test("paginates with meta totals", () => {
    const result = queryConfigurations({ page: 1, limit: 2 });
    expect(result.data).toHaveLength(2);
    expect(result.meta).toEqual({ page: 1, limit: 2, total: SEED_COUNT });
    const second = queryConfigurations({ page: 2, limit: 2 });
    expect(second.data).toHaveLength(2);
    expect(second.data[0].path).not.toBe(result.data[0].path);
    expect(second.meta.page).toBe(2);
  });

  test("clamps limit to the spec maximum", () => {
    const result = queryConfigurations({ page: 1, limit: 500 });
    expect(result.meta.limit).toBe(200);
    expect(result.data).toHaveLength(Math.min(200, SEED_COUNT));
  });

  test("returns an empty page beyond the last page", () => {
    const result = queryConfigurations({ page: 9999, limit: 25 });
    expect(result.data).toHaveLength(0);
    expect(result.meta.total).toBe(SEED_COUNT);
  });

  test("defaults to latest changes first", () => {
    const result = queryConfigurations({ page: 1, limit: SEED_COUNT });
    const times = result.data.map((row) => row.modifiedOn);
    expect([...times].sort((a, b) => b - a)).toEqual(times);
  });

  test("displayBy path sorts by path ascending", () => {
    const result = queryConfigurations({ page: 1, limit: SEED_COUNT, displayBy: "path" });
    const paths = result.data.map((row) => row.path);
    for (let i = 1; i < paths.length; i++) {
      expect(paths[i - 1].localeCompare(paths[i])).toBeLessThanOrEqual(0);
    }
  });

  test("sorts by column ascending and descending", () => {
    const comparePath = (a: string, b: string) => a.localeCompare(b, "en", { sensitivity: "base" });
    const asc = queryConfigurations({ page: 1, limit: SEED_COUNT, sort: "path" });
    const paths = asc.data.map((row) => row.path);
    for (let i = 1; i < paths.length; i++) {
      expect(comparePath(paths[i - 1], paths[i])).toBeLessThanOrEqual(0);
    }
    const desc = queryConfigurations({ page: 1, limit: SEED_COUNT, sort: "-path" });
    const descPaths = desc.data.map((row) => row.path);
    for (let i = 1; i < descPaths.length; i++) {
      expect(comparePath(descPaths[i - 1], descPaths[i])).toBeGreaterThanOrEqual(0);
    }
  });

  test("explicit sort wins over displayBy", () => {
    const result = queryConfigurations({
      page: 1,
      limit: SEED_COUNT,
      sort: "type",
      displayBy: "path",
    });
    const types = result.data.map((row) => row.type);
    for (let i = 1; i < types.length; i++) {
      expect(
        types[i - 1].localeCompare(types[i], "en", { sensitivity: "base" }),
      ).toBeLessThanOrEqual(0);
    }
  });

  test("ignores unknown sort values", () => {
    const result = queryConfigurations({ page: 1, limit: 25, sort: "nope" });
    expect(result.data).toHaveLength(25);
    expect(result.meta.total).toBe(SEED_COUNT);
  });

  test("filters by type", () => {
    const result = queryConfigurations({ page: 1, limit: SEED_COUNT, type: "Boolean" });
    expect(result.meta.total).toBeGreaterThan(0);
    expect(result.data.every((row) => row.type === "Boolean")).toBe(true);
  });

  test("userConfigs=false hides user entries", () => {
    const all = queryConfigurations({ page: 1, limit: SEED_COUNT });
    const filtered = queryConfigurations({ page: 1, limit: SEED_COUNT, userConfigs: "false" });
    expect(filtered.meta.total).toBeLessThan(all.meta.total);
    expect(filtered.data.every((row) => !row.userConfig)).toBe(true);
  });

  test("searches case-insensitively across all fields by default", () => {
    const result = queryConfigurations({ page: 1, limit: 25, q: "MASTERDATALOADDATE" });
    expect(result.meta.total).toBe(1);
    expect(result.data[0].path).toBe("/Cmf/Custom/MasterDataLoadDate/");
  });

  test("searchFields limits the searched field", () => {
    const byName = queryConfigurations({
      page: 1,
      limit: SEED_COUNT,
      q: "autolocktimeout",
      searchFields: "name",
    });
    expect(byName.meta.total).toBe(1);
    const byPathOnly = queryConfigurations({
      page: 1,
      limit: SEED_COUNT,
      q: "autolocktimeout",
      searchFields: "path",
    });
    expect(byPathOnly.meta.total).toBe(1);
    const byValue = queryConfigurations({
      page: 1,
      limit: SEED_COUNT,
      q: "autolocktimeout",
      searchFields: "value",
    });
    expect(byValue.meta.total).toBe(0);
  });

  test("returns no rows for an unmatched search", () => {
    const result = queryConfigurations({ page: 1, limit: 25, q: "no-such-entry" });
    expect(result.data).toHaveLength(0);
    expect(result.meta.total).toBe(0);
  });
});

describe("listConfigurationTree", () => {
  test("returns only paths that have children", () => {
    const branches = listConfigurationTree();
    const paths = new Set(buildConfigurationSeeds().map((entry) => entry.path));
    expect(branches.length).toBeGreaterThan(0);
    for (const branch of branches) {
      expect(paths.has(branch)).toBe(true);
      expect([...paths].some((other) => other !== branch && other.startsWith(branch))).toBe(true);
    }
    expect(branches).toContain("/Cmf/");
  });
});
