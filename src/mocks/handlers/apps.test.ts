import { describe, expect, test } from "vitest";
import { queryApps } from "./apps";

describe("queryApps", () => {
  test("paginates with meta totals", () => {
    const result = queryApps({ page: 1, limit: 2 });
    expect(result.data).toHaveLength(2);
    expect(result.meta).toEqual({ page: 1, limit: 2, total: 4 });
    const second = queryApps({ page: 2, limit: 2 });
    expect(second.data.map((row) => row.name)).toEqual(["Maintenance", "Traceability"]);
    expect(second.meta.page).toBe(2);
  });

  test("clamps limit to the spec maximum", () => {
    const result = queryApps({ page: 1, limit: 500 });
    expect(result.meta.limit).toBe(200);
    expect(result.data).toHaveLength(4);
  });

  test("returns an empty page beyond the last page", () => {
    const result = queryApps({ page: 99, limit: 2 });
    expect(result.data).toHaveLength(0);
    expect(result.meta.total).toBe(4);
  });

  test("sorts by name ascending and descending", () => {
    const asc = queryApps({ page: 1, limit: 4, sort: "name" });
    expect(asc.data.map((row) => row.name)).toEqual([
      "Maintenance",
      "Quality",
      "Shop Floor",
      "Traceability",
    ]);
    const desc = queryApps({ page: 1, limit: 4, sort: "-name" });
    expect(desc.data.map((row) => row.name)).toEqual([
      "Traceability",
      "Shop Floor",
      "Quality",
      "Maintenance",
    ]);
  });

  test("sorts by type", () => {
    const result = queryApps({ page: 1, limit: 4, sort: "type" });
    expect(result.data.map((row) => row.type)).toEqual([
      "System",
      "System",
      "System",
      "User defined",
    ]);
  });

  test("ignores unknown sort values", () => {
    const result = queryApps({ page: 1, limit: 4, sort: "nope" });
    expect(result.data.map((row) => row.name)).toEqual([
      "Shop Floor",
      "Quality",
      "Maintenance",
      "Traceability",
    ]);
    expect(result.meta.total).toBe(4);
  });

  test("searches the raw fields case-insensitively", () => {
    const byName = queryApps({ page: 1, limit: 4, q: "sHoP fLoOr" });
    expect(byName.meta.total).toBe(1);
    expect(byName.data[0].name).toBe("Shop Floor");
    const byDescription = queryApps({ page: 1, limit: 4, q: "inspection and ncr" });
    expect(byDescription.meta.total).toBe(1);
    expect(byDescription.data[0].name).toBe("Quality");
    const byType = queryApps({ page: 1, limit: 4, q: "user defined" });
    expect(byType.meta.total).toBe(1);
    expect(byType.data[0].name).toBe("Maintenance");
    const byState = queryApps({ page: 1, limit: 4, q: "active" });
    expect(byState.meta.total).toBe(4);
  });

  test("returns no rows for a query that matches nothing", () => {
    const result = queryApps({ page: 1, limit: 4, q: "zzz-no-such-app" });
    expect(result.data).toHaveLength(0);
    expect(result.meta.total).toBe(0);
  });
});
