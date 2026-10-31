import type { ReactElement } from "react";
import {
  Bot20Regular,
  PlugConnected20Regular,
  Window20Regular,
} from "@/components/icons";
import { getAdministrationTile } from "./administrationTiles";
import { BUSINESS_DATA_ENTITIES } from "./businessDataEntities";
import { MANUFACTURING_PAGES } from "./manufacturingPages";
import { getNavigationSection, NAVIGATION_SECTIONS } from "./sections";
import type { BreadcrumbItem, RouteTabInfo } from "./types";

export function routeForSection(sectionId: string) {
  return getNavigationSection(sectionId)?.route;
}

export function sectionForRoute(route: string) {
  if (route === "/ai") return getNavigationSection("ai");
  if (route === "/administration" || route.startsWith("/administration/")) {
    return getNavigationSection("administration");
  }
  return NAVIGATION_SECTIONS.find((section) => section.route === route);
}

function normalizeRoute(route: string) {
  if (route.length > 1 && route.endsWith("/")) return route.slice(0, -1);
  return route;
}

function lastPathSegment(decoded: string): string {
  const trimmed = decoded.endsWith("/") ? decoded.slice(0, -1) : decoded;
  const index = trimmed.lastIndexOf("/");
  return index >= 0 ? trimmed.slice(index + 1) : trimmed;
}

export function breadcrumbsForRoute(route: string): BreadcrumbItem[] {
  const path = normalizeRoute(route);
  if (path === "/" || path === "/administration") {
    return [{ labelKey: "nav.sections.administration", label: null, route: "/administration" }];
  }
  if (path === "/ai") return [{ labelKey: "nav.sections.ai", label: null, route: "/ai" }];
  const section = NAVIGATION_SECTIONS.find((candidate) => candidate.route === path);
  if (section) return [{ labelKey: section.labelKey, label: null, route: section.route }];
  if (path.startsWith("/administration/")) {
    const rest = path.slice("/administration/".length);
    const segments = rest.split("/");
    const tile = getAdministrationTile(segments[0]);
    if (!tile) return [];
    if (segments.length === 1) {
      return [
        { labelKey: "nav.sections.administration", label: null, route: "/administration" },
        { labelKey: tile.labelKey, label: null, route: tile.route },
      ];
    }
    if (
      (segments[0] === "ai-agent" ||
        segments[0] === "ai-mcp-server" ||
        segments[0] === "configuration" ||
        segments[0] === "entity-types" ||
        segments[0] === "queries" ||
        segments[0] === "tables") &&
      segments.length === 2 &&
      segments[1].length > 0
    ) {
      const decoded = decodeURIComponent(segments[1]);
      const label = segments[0] === "configuration" ? lastPathSegment(decoded) : decoded;
      return [
        { labelKey: "nav.sections.administration", label: null, route: "/administration" },
        { labelKey: tile.labelKey, label: null, route: tile.route },
        { labelKey: null, label, route: path },
      ];
    }
  }
  if (path === "/business-data") {
    return [{ labelKey: "nav.sections.businessData", label: null, route: "/business-data" }];
  }
  if (path.startsWith("/business-data/")) {
    const rest = path.slice("/business-data/".length);
    const segments = rest.split("/");
    const entity = BUSINESS_DATA_ENTITIES.find((candidate) => candidate.id === segments[0]);
    if (!entity) return [];
    const crumbs: BreadcrumbItem[] = [
      { labelKey: "nav.sections.businessData", label: null, route: "/business-data" },
      { labelKey: entity.labelKey, label: null, route: entity.route },
    ];
    if (segments.length === 2 && segments[1].length > 0) {
      crumbs.push({ labelKey: null, label: decodeURIComponent(segments[1]), route: path });
    }
    return crumbs;
  }
  if (path === "/manufacturing") {
    return [{ labelKey: "nav.sections.manufacturing", label: null, route: "/manufacturing" }];
  }
  if (path.startsWith("/manufacturing/")) {
    const rest = path.slice("/manufacturing/".length);
    const segments = rest.split("/");
    const page = MANUFACTURING_PAGES.find((candidate) => candidate.id === segments[0]);
    if (!page) return [];
    const crumbs: BreadcrumbItem[] = [
      { labelKey: "nav.sections.manufacturing", label: null, route: "/manufacturing" },
      { labelKey: page.labelKey, label: null, route: page.route },
    ];
    if (segments.length === 2 && segments[1].length > 0) {
      crumbs.push({ labelKey: null, label: decodeURIComponent(segments[1]), route: path });
    }
    return crumbs;
  }
  return [];
}

export function tabForRoute(route: string): RouteTabInfo | null {
  const path = normalizeRoute(route);
  const crumbs = breadcrumbsForRoute(path);
  if (crumbs.length === 0) return null;
  const leaf = crumbs[crumbs.length - 1];
  const parentRoute = crumbs.length > 1 ? crumbs[crumbs.length - 2].route : null;
  const id = path === "/administration" || path === "/" ? "administration" : path.slice(1);
  return { id, route: leaf.route, titleKey: leaf.labelKey, title: leaf.label, parentRoute };
}

export function parentRouteForRoute(route: string) {
  return tabForRoute(route)?.parentRoute ?? null;
}

export function iconForRoute(route: string): ReactElement {
  const path = normalizeRoute(route);
  if (path.startsWith("/administration/ai-agent/")) return <Bot20Regular />;
  if (path.startsWith("/administration/ai-mcp-server/")) return <PlugConnected20Regular />;
  if (path.startsWith("/administration/")) {
    const tile = getAdministrationTile(path.slice("/administration/".length).split("/")[0]);
    if (tile) return tile.icon;
  }
  const section = sectionForRoute(path);
  if (section) return section.icon;
  return <Window20Regular />;
}
