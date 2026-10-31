import { describe, expect, it } from "vitest";
import { toListSearchParams } from "@/lib/listQuery";

describe("toListSearchParams", () => {
  it("serializes page and limit", () => {
    const params = toListSearchParams({ page: 2, limit: 25 });
    expect(params.get("page")).toBe("2");
    expect(params.get("limit")).toBe("25");
  });

  it("omits page and limit when undefined", () => {
    const params = toListSearchParams({ q: "test" });
    expect(params.has("page")).toBe(false);
    expect(params.has("limit")).toBe(false);
    expect(params.get("q")).toBe("test");
  });

  it("serializes sort when present", () => {
    const params = toListSearchParams({ page: 1, limit: 10, sort: "name" });
    expect(params.get("sort")).toBe("name");
  });

  it("serializes filter entries skipping empty values", () => {
    const params = toListSearchParams({
      page: 1,
      limit: 10,
      filters: { state: "active", q: "", status: "all" },
    });
    expect(params.get("state")).toBe("active");
    expect(params.has("q")).toBe(false);
    expect(params.has("status")).toBe(false);
  });

  it("serializes extra top-level keys", () => {
    const params = toListSearchParams({ page: 1, limit: 10, q: "search", state: "up" });
    expect(params.get("q")).toBe("search");
    expect(params.get("state")).toBe("up");
  });

  it("skips empty, null, undefined, false, and all values", () => {
    const params = toListSearchParams({
      q: "",
      state: "all",
      flag: false,
      missing: undefined,
      nothing: null,
    });
    expect(params.toString()).toBe("");
  });

  it("does not duplicate reserved keys from extras", () => {
    const params = toListSearchParams({ page: 3, limit: 20 });
    const entries = Array.from(params.entries()).filter(([k]) => k === "page");
    expect(entries).toHaveLength(1);
    expect(entries[0][1]).toBe("3");
  });
});
