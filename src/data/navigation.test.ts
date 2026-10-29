import { describe, expect, it } from "vitest";
import {
  breadcrumbsForRoute,
  parentRouteForRoute,
  routeForSection,
  tabForRoute,
} from "@/data/navigation";

describe("route helpers", () => {
  it("maps section ids to routes", () => {
    expect(routeForSection("administration")).toBe("/administration");
    expect(routeForSection("ai")).toBe("/ai");
    expect(routeForSection("low-code")).toBe("/low-code");
    expect(routeForSection("no-such-section")).toBeUndefined();
  });

  it("maps the hub and chat routes to tabs without parents", () => {
    expect(tabForRoute("/administration")).toEqual({
      id: "administration",
      route: "/administration",
      titleKey: "nav.sections.administration",
      title: null,
      parentRoute: null,
    });
    expect(tabForRoute("/")).toEqual({
      id: "administration",
      route: "/administration",
      titleKey: "nav.sections.administration",
      title: null,
      parentRoute: null,
    });
    expect(tabForRoute("/ai")).toEqual({
      id: "ai",
      route: "/ai",
      titleKey: "nav.sections.ai",
      title: null,
      parentRoute: null,
    });
  });

  it("maps administration lists to tabs with the hub as parent", () => {
    expect(tabForRoute("/administration/entity-types")).toEqual({
      id: "administration/entity-types",
      route: "/administration/entity-types",
      titleKey: "nav.tiles.entityTypes",
      title: null,
      parentRoute: "/administration",
    });
    expect(tabForRoute("/administration/ai-agent")).toEqual({
      id: "administration/ai-agent",
      route: "/administration/ai-agent",
      titleKey: "nav.tiles.aiAgent",
      title: null,
      parentRoute: "/administration",
    });
    expect(tabForRoute("/administration/ai-mcp-server")).toEqual({
      id: "administration/ai-mcp-server",
      route: "/administration/ai-mcp-server",
      titleKey: "nav.tiles.aiMcpServer",
      title: null,
      parentRoute: "/administration",
    });
    expect(tabForRoute("/administration/apps")).toEqual({
      id: "administration/apps",
      route: "/administration/apps",
      titleKey: "nav.tiles.apps",
      title: null,
      parentRoute: "/administration",
    });
    expect(tabForRoute("/administration/configuration")).toEqual({
      id: "administration/configuration",
      route: "/administration/configuration",
      titleKey: "nav.tiles.configuration",
      title: null,
      parentRoute: "/administration",
    });
  });

  it("maps administration details to tabs with their lists as parents", () => {
    expect(tabForRoute("/administration/ai-agent/AnalyticsViewAgent")).toEqual({
      id: "administration/ai-agent/AnalyticsViewAgent",
      route: "/administration/ai-agent/AnalyticsViewAgent",
      titleKey: null,
      title: "AnalyticsViewAgent",
      parentRoute: "/administration/ai-agent",
    });
    expect(tabForRoute("/administration/ai-mcp-server/Cubes")).toEqual({
      id: "administration/ai-mcp-server/Cubes",
      route: "/administration/ai-mcp-server/Cubes",
      titleKey: null,
      title: "Cubes",
      parentRoute: "/administration/ai-mcp-server",
    });
  });

  it("maps other top-level sections to placeholder tabs without parents", () => {
    expect(tabForRoute("/low-code")).toEqual({
      id: "low-code",
      route: "/low-code",
      titleKey: "nav.sections.lowCode",
      title: null,
      parentRoute: null,
    });
  });

  it("returns null for unknown routes", () => {
    expect(tabForRoute("/no-such-page")).toBeNull();
    expect(tabForRoute("/administration/no-such-tile")).toBeNull();
    expect(parentRouteForRoute("/no-such-page")).toBeNull();
  });

  it("builds breadcrumb trails for lists and details", () => {
    expect(breadcrumbsForRoute("/administration/ai-agent/AnalyticsViewAgent")).toEqual([
      { labelKey: "nav.sections.administration", label: null, route: "/administration" },
      { labelKey: "nav.tiles.aiAgent", label: null, route: "/administration/ai-agent" },
      {
        labelKey: null,
        label: "AnalyticsViewAgent",
        route: "/administration/ai-agent/AnalyticsViewAgent",
      },
    ]);
    expect(breadcrumbsForRoute("/administration/entity-types")).toEqual([
      { labelKey: "nav.sections.administration", label: null, route: "/administration" },
      { labelKey: "nav.tiles.entityTypes", label: null, route: "/administration/entity-types" },
    ]);
    expect(breadcrumbsForRoute("/ai")).toEqual([
      { labelKey: "nav.sections.ai", label: null, route: "/ai" },
    ]);
  });
});
