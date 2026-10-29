import type { ReactElement } from "react";
import {
  ArrowDownload24Regular,
  Flow24Regular,
  Globe24Regular,
  Target24Regular,
  Window24Regular,
  ArrowSync24Regular,
  Bot24Regular,
  Box24Regular,
  Braces24Regular,
  Certificate24Regular,
  Code20Regular,
  Cube24Regular,
  Diamond24Filled,
  DocumentBulletList24Regular,
  DocumentSearch24Regular,
  Flash24Regular,
  HeartPulse24Regular,
  Image24Regular,
  Keyboard24Regular,
  LocalLanguage24Regular,
  LockClosed24Filled,
  NumberSymbol24Regular,
  Organization24Regular,
  PlugConnected24Regular,
  Print24Regular,
  Server20Regular,
  ShieldCheckmark20Regular,
  Table24Regular,
  TableSimple24Regular,
  Timer24Regular,
  Toolbox20Regular,
  Wrench24Regular,
  Bot20Regular,
  DataBarVertical20Regular,
  Database20Regular,
  Flow20Regular,
  PlugConnected20Regular,
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
    icon: <Wrench20Regular />,
    route: "/administration",
  },
  { id: "low-code", label: "Low Code", icon: <Code20Regular />, route: "/low-code" },
  {
    id: "business-data",
    label: "Business Data",
    icon: <Database20Regular />,
    route: "/business-data",
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    icon: <Settings20Regular />,
    route: "/manufacturing",
  },
  { id: "maintenance", label: "Maintenance", icon: <Toolbox20Regular />, route: "/maintenance" },
  { id: "quality", label: "Quality", icon: <ShieldCheckmark20Regular />, route: "/quality" },
  {
    id: "planning-and-logistics",
    label: "Planning and Logistics",
    icon: <Flow20Regular />,
    route: "/planning-and-logistics",
  },
  {
    id: "business-intelligence",
    label: "Business Intelligence",
    icon: <DataBarVertical20Regular />,
    route: "/business-intelligence",
  },
  { id: "automation", label: "Automation", icon: <Target20Regular />, route: "/automation" },
  {
    id: "data-platform",
    label: "Data Platform",
    icon: <Server20Regular />,
    route: "/data-platform",
  },
  { id: "apps", label: "Apps", icon: <Window20Regular />, route: "/apps" },
];

export const ADMINISTRATION_TILES: AdministrationTile[] = [
  { id: "ai-agent", label: "AI Agent", icon: <Bot24Regular />, route: "/administration/ai-agent" },
  {
    id: "ai-mcp-server",
    label: "AI MCP Server",
    icon: <PlugConnected24Regular />,
    route: "/administration/ai-mcp-server",
  },
  { id: "apps", label: "Apps", icon: <Window24Regular />, route: "/administration/apps" },
  {
    id: "augmented-reality",
    label: "Augmented Reality",
    icon: <Cube24Regular />,
    route: "/administration/augmented-reality",
  },
  {
    id: "change-package",
    label: "Change Package",
    icon: <Box24Regular />,
    route: "/administration/change-package",
  },
  {
    id: "configuration",
    label: "Configuration",
    icon: <Wrench24Regular />,
    route: "/administration/configuration",
  },
  {
    id: "data-orchestrator",
    label: "Data Orchestrator",
    icon: <Flow24Regular />,
    route: "/administration/data-orchestrator",
  },
  {
    id: "dee-actions",
    label: "DEE Actions",
    icon: <Braces24Regular />,
    route: "/administration/dee-actions",
  },
  {
    id: "entity-types",
    label: "Entity Types",
    icon: <DocumentBulletList24Regular />,
    route: "/administration/entity-types",
  },
  {
    id: "event-rules",
    label: "Event Rules",
    icon: <Flash24Regular />,
    route: "/administration/event-rules",
  },
  {
    id: "fablives",
    label: "FabLives",
    icon: <Target24Regular />,
    route: "/administration/fablives",
  },
  {
    id: "global-shortcuts",
    label: "Global Shortcuts",
    icon: <Keyboard24Regular />,
    route: "/administration/global-shortcuts",
  },
  {
    id: "licenses",
    label: "Licenses",
    icon: <Certificate24Regular />,
    route: "/administration/licenses",
  },
  {
    id: "localized-messages",
    label: "Localized Messages",
    icon: <LocalLanguage24Regular />,
    route: "/administration/localized-messages",
  },
  {
    id: "master-data-export",
    label: "Master Data Export",
    icon: <ArrowDownload24Regular />,
    route: "/administration/master-data-export",
  },
  {
    id: "master-data-package",
    label: "Master Data Package",
    icon: <Box24Regular />,
    route: "/administration/master-data-package",
  },
  {
    id: "message-bus",
    label: "Message Bus",
    icon: <Organization24Regular />,
    route: "/administration/message-bus",
  },
  {
    id: "multimedia",
    label: "Multimedia",
    icon: <Image24Regular />,
    route: "/administration/multimedia",
  },
  {
    id: "name-generators",
    label: "Name Generators",
    icon: <NumberSymbol24Regular />,
    route: "/administration/name-generators",
  },
  {
    id: "printing-integration",
    label: "Printing Integration",
    icon: <Print24Regular />,
    route: "/administration/printing-integration",
  },
  {
    id: "queries",
    label: "Queries",
    icon: <DocumentSearch24Regular />,
    route: "/administration/queries",
  },
  { id: "rules", label: "Rules", icon: <Diamond24Filled />, route: "/administration/rules" },
  {
    id: "security",
    label: "Security",
    icon: <LockClosed24Filled />,
    route: "/administration/security",
  },
  {
    id: "state-models",
    label: "State Models",
    icon: <ArrowSync24Regular />,
    route: "/administration/state-models",
  },
  {
    id: "system-integrations",
    label: "System Integrations",
    icon: <Globe24Regular />,
    route: "/administration/system-integrations",
  },
  {
    id: "system-monitoring",
    label: "System Monitoring",
    icon: <HeartPulse24Regular />,
    route: "/administration/system-monitoring",
  },
  {
    id: "tables",
    label: "Tables",
    icon: <Table24Regular />,
    route: "/administration/tables",
  },
  { id: "timers", label: "Timers", icon: <Timer24Regular />, route: "/administration/timers" },
  {
    id: "uipages",
    label: "UIPages",
    icon: <TableSimple24Regular />,
    route: "/administration/uipages",
  },
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
