import { describe, expect, it } from "vitest";
import { routeForNav, routeForTab, tabFromPath } from "@/data/navigation";

describe("route helpers", () => {
  it("maps navigation ids to routes", () => {
    expect(routeForNav("entities")).toBe("/entity-types");
    expect(routeForNav("tools")).toBe("/modules/tools");
  });

  it("maps tabs to routes", () => {
    expect(routeForTab({ id: "list", type: "list", nav: "entities" })).toBe("/entity-types");
    expect(routeForTab({ id: "p:tools", type: "page", nav: "tools" })).toBe("/modules/tools");
    expect(routeForTab({ id: "d:AIAgent", type: "detail", nav: "entities" })).toBe(
      "/detail/AIAgent",
    );
  });

  it("parses list, module, and detail paths", () => {
    expect(tabFromPath("/")).toEqual({ kind: "list" });
    expect(tabFromPath("/entity-types")).toEqual({ kind: "list" });
    expect(tabFromPath("/modules/tools")).toEqual({ kind: "page", nav: "tools" });
    expect(tabFromPath("/detail/AIAgent")).toEqual({ kind: "detail", name: "AIAgent" });
  });

  it("returns none for unknown paths", () => {
    expect(tabFromPath("/no-such-page")).toEqual({ kind: "none" });
    expect(tabFromPath("/modules/")).toEqual({ kind: "none" });
  });
});
