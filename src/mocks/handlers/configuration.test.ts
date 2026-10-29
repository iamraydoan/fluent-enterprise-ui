import { describe, expect, test } from "vitest";
import { queryConfigurations } from "./configuration";

describe("queryConfigurations", () => {
  test("paginates with meta totals", () => {
    const result = queryConfigurations({ page: 1, limit: 2 });
    expect(result.data).toHaveLength(2);
    expect(result.meta).toEqual({ page: 1, limit: 2, total: 4 });
    const second = queryConfigurations({ page: 2, limit: 2 });
    expect(second.data).toHaveLength(2);
    expect(second.data[0].setting).not.toBe(result.data[0].setting);
    expect(second.meta.page).toBe(2);
  });

  test("clamps limit to the spec maximum", () => {
    const result = queryConfigurations({ page: 1, limit: 500 });
    expect(result.meta.limit).toBe(200);
    expect(result.data).toHaveLength(4);
  });

  test("returns an empty page beyond the last page", () => {
    const result = queryConfigurations({ page: 99, limit: 25 });
    expect(result.data).toHaveLength(0);
    expect(result.meta.total).toBe(4);
  });

  test("sorts by setting ascending and descending", () => {
    const asc = queryConfigurations({ page: 1, limit: 25, sort: "setting" });
    const settings = asc.data.map((row) => row.setting);
    expect(settings).toEqual(["Audit logging", "Default language", "Session timeout", "Time zone"]);
    const desc = queryConfigurations({ page: 1, limit: 25, sort: "-setting" });
    const descSettings = desc.data.map((row) => row.setting);
    expect(descSettings).toEqual([...settings].reverse());
  });

  test("sorts by scope", () => {
    const result = queryConfigurations({ page: 1, limit: 25, sort: "scope" });
    const scopes = result.data.map((row) => row.scope);
    expect(scopes).toEqual(["Global", "Global", "Security", "Security"]);
  });

  test("ignores unknown sort values", () => {
    const result = queryConfigurations({ page: 1, limit: 25, sort: "nope" });
    expect(result.data).toHaveLength(4);
    expect(result.meta.total).toBe(4);
  });

  test("searches English text case-insensitively", () => {
    const result = queryConfigurations({ page: 1, limit: 25, q: "TIME ZONE" });
    expect(result.meta.total).toBe(1);
    expect(result.data[0].setting).toBe("Time zone");
  });

  test("searches across value, scope and modified", () => {
    const byValue = queryConfigurations({ page: 1, limit: 25, q: "english" });
    expect(byValue.meta.total).toBe(1);
    expect(byValue.data[0].setting).toBe("Default language");
    const byValueText = queryConfigurations({ page: 1, limit: 25, q: "UTC+07:00" });
    expect(byValueText.meta.total).toBe(1);
    expect(byValueText.data[0].setting).toBe("Time zone");
    const byScope = queryConfigurations({ page: 1, limit: 25, q: "security" });
    expect(byScope.meta.total).toBe(2);
    expect(byScope.data.every((row) => row.scope === "Security")).toBe(true);
    const byModified = queryConfigurations({ page: 1, limit: 25, q: "12/10/2026" });
    expect(byModified.meta.total).toBe(2);
  });

  test("returns no rows for an unmatched search", () => {
    const result = queryConfigurations({ page: 1, limit: 25, q: "no-such-setting" });
    expect(result.data).toHaveLength(0);
    expect(result.meta.total).toBe(0);
  });
});
