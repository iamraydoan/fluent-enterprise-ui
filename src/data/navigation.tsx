import type { ReactElement } from "react";
import {
  Apps20Regular,
  ArrowDownload24Regular,
  ArrowExportUp24Regular,
  Bot20Regular,
  Chat20Regular,
  Checkmark20Filled,
  ColumnTriple20Regular,
  DataBarVertical20Regular,
  Database20Regular,
  DocumentBulletList20Regular,
  Eye20Filled,
  Flow20Regular,
  Globe20Regular,
  PlugConnected20Regular,
  Search20Regular,
  Settings20Regular,
  Sparkle20Filled,
  Target20Regular,
  Window20Regular,
  Wrench20Regular,
} from "@/components/icons";

export interface NavigationSection {
  id: string;
  label: string;
  icon: ReactElement;
  route: string;
}

export interface AdministrationTile {
  id: string;
  label: string;
  icon: ReactElement;
  route: string;
}

export const NAVIGATION_SECTIONS: NavigationSection[] = [
  { id: "ai", label: "AI", icon: <Sparkle20Filled style={{ color: "#4F8CFF" }} />, route: "/ai" },
  {
    id: "administration",
    label: "Administration",
    icon: <Settings20Regular />,
    route: "/administration",
  },
  { id: "low-code", label: "Low Code", icon: <Flow20Regular />, route: "/low-code" },
  {
    id: "business-data",
    label: "Business Data",
    icon: <Database20Regular />,
    route: "/business-data",
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    icon: <Wrench20Regular />,
    route: "/manufacturing",
  },
  { id: "maintenance", label: "Maintenance", icon: <Target20Regular />, route: "/maintenance" },
  { id: "quality", label: "Quality", icon: <Checkmark20Filled />, route: "/quality" },
  {
    id: "planning-and-logistics",
    label: "Planning and Logistics",
    icon: <Globe20Regular />,
    route: "/planning-and-logistics",
  },
  {
    id: "business-intelligence",
    label: "Business Intelligence",
    icon: <DataBarVertical20Regular />,
    route: "/business-intelligence",
  },
  { id: "automation", label: "Automation", icon: <Bot20Regular />, route: "/automation" },
  {
    id: "data-platform",
    label: "Data Platform",
    icon: <ColumnTriple20Regular />,
    route: "/data-platform",
  },
  { id: "apps", label: "Apps", icon: <Apps20Regular />, route: "/apps" },
];

export const ADMINISTRATION_TILES: AdministrationTile[] = [
  { id: "ai-agent", label: "AI Agent", icon: <Bot20Regular />, route: "/administration/ai-agent" },
  {
    id: "ai-mcp-server",
    label: "AI MCP Server",
    icon: <PlugConnected20Regular />,
    route: "/administration/ai-mcp-server",
  },
  { id: "apps", label: "Apps", icon: <Apps20Regular />, route: "/administration/apps" },
  {
    id: "augmented-reality",
    label: "Augmented Reality",
    icon: <Eye20Filled />,
    route: "/administration/augmented-reality",
  },
  {
    id: "change-package",
    label: "Change Package",
    icon: <Window20Regular />,
    route: "/administration/change-package",
  },
  {
    id: "configuration",
    label: "Configuration",
    icon: <Settings20Regular />,
    route: "/administration/configuration",
  },
  {
    id: "data-orchestrator",
    label: "Data Orchestrator",
    icon: <Flow20Regular />,
    route: "/administration/data-orchestrator",
  },
  {
    id: "dee-actions",
    label: "DEE Actions",
    icon: <Wrench20Regular />,
    route: "/administration/dee-actions",
  },
  {
    id: "entity-types",
    label: "Entity Types",
    icon: <Database20Regular />,
    route: "/administration/entity-types",
  },
  {
    id: "event-rules",
    label: "Event Rules",
    icon: <Checkmark20Filled />,
    route: "/administration/event-rules",
  },
  {
    id: "fablives",
    label: "FabLives",
    icon: <Globe20Regular />,
    route: "/administration/fablives",
  },
  {
    id: "global-shortcuts",
    label: "Global Shortcuts",
    icon: <Window20Regular />,
    route: "/administration/global-shortcuts",
  },
  {
    id: "licenses",
    label: "Licenses",
    icon: <DocumentBulletList20Regular />,
    route: "/administration/licenses",
  },
  {
    id: "localized-messages",
    label: "Localized Messages",
    icon: <Chat20Regular />,
    route: "/administration/localized-messages",
  },
  {
    id: "master-data-export",
    label: "Master Data Export",
    icon: <ArrowExportUp24Regular />,
    route: "/administration/master-data-export",
  },
  {
    id: "master-data-package",
    label: "Master Data Package",
    icon: <ArrowDownload24Regular />,
    route: "/administration/master-data-package",
  },
  {
    id: "message-bus",
    label: "Message Bus",
    icon: <Chat20Regular />,
    route: "/administration/message-bus",
  },
  {
    id: "multimedia",
    label: "Multimedia",
    icon: <Eye20Filled />,
    route: "/administration/multimedia",
  },
  {
    id: "name-generators",
    label: "Name Generators",
    icon: <DocumentBulletList20Regular />,
    route: "/administration/name-generators",
  },
  {
    id: "printing-integration",
    label: "Printing Integration",
    icon: <Window20Regular />,
    route: "/administration/printing-integration",
  },
  { id: "queries", label: "Queries", icon: <Search20Regular />, route: "/administration/queries" },
  { id: "rules", label: "Rules", icon: <Checkmark20Filled />, route: "/administration/rules" },
  {
    id: "security",
    label: "Security",
    icon: <Window20Regular />,
    route: "/administration/security",
  },
  {
    id: "state-models",
    label: "State Models",
    icon: <Flow20Regular />,
    route: "/administration/state-models",
  },
  {
    id: "system-integrations",
    label: "System Integrations",
    icon: <PlugConnected20Regular />,
    route: "/administration/system-integrations",
  },
  {
    id: "system-monitoring",
    label: "System Monitoring",
    icon: <DataBarVertical20Regular />,
    route: "/administration/system-monitoring",
  },
  {
    id: "tables",
    label: "Tables",
    icon: <ColumnTriple20Regular />,
    route: "/administration/tables",
  },
  { id: "timers", label: "Timers", icon: <Window20Regular />, route: "/administration/timers" },
  { id: "uipages", label: "UIPages", icon: <Window20Regular />, route: "/administration/uipages" },
];

export function getNavigationSection(sectionId: string) {
  return NAVIGATION_SECTIONS.find((section) => section.id === sectionId);
}

export function getAdministrationTile(tileId: string) {
  return ADMINISTRATION_TILES.find((tile) => tile.id === tileId);
}

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

export interface BreadcrumbItem {
  label: string;
  route: string;
}

export interface RouteTabInfo {
  id: string;
  route: string;
  title: string;
  parentRoute: string | null;
}

function normalizeRoute(route: string) {
  if (route.length > 1 && route.endsWith("/")) return route.slice(0, -1);
  return route;
}

export function breadcrumbsForRoute(route: string): BreadcrumbItem[] {
  const path = normalizeRoute(route);
  if (path === "/" || path === "/administration") {
    return [{ label: "Administration", route: "/administration" }];
  }
  if (path === "/ai") return [{ label: "AI", route: "/ai" }];
  const section = NAVIGATION_SECTIONS.find((candidate) => candidate.route === path);
  if (section) return [{ label: section.label, route: section.route }];
  if (path.startsWith("/administration/")) {
    const rest = path.slice("/administration/".length);
    const segments = rest.split("/");
    const tile = getAdministrationTile(segments[0]);
    if (!tile) return [];
    if (segments.length === 1) {
      return [
        { label: "Administration", route: "/administration" },
        { label: tile.label, route: tile.route },
      ];
    }
    if (
      (segments[0] === "ai-agent" || segments[0] === "ai-mcp-server") &&
      segments.length === 2 &&
      segments[1].length > 0
    ) {
      return [
        { label: "Administration", route: "/administration" },
        { label: tile.label, route: tile.route },
        { label: decodeURIComponent(segments[1]), route: path },
      ];
    }
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
  return { id, route: leaf.route, title: leaf.label, parentRoute };
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
