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
import type { TranslationKey } from "@/i18n";

export interface NavigationSection {
  id: string;
  labelKey: TranslationKey;
  icon: ReactElement;
  route: string;
}

export interface AdministrationTile {
  id: string;
  labelKey: TranslationKey;
  icon: ReactElement;
  route: string;
}

export const NAVIGATION_SECTIONS: NavigationSection[] = [
  {
    id: "ai",
    labelKey: "nav.sections.ai",
    icon: <Sparkle20Filled style={{ color: "#4F8CFF" }} />,
    route: "/ai",
  },
  {
    id: "administration",
    labelKey: "nav.sections.administration",
    icon: <Wrench20Regular />,
    route: "/administration",
  },
  { id: "low-code", labelKey: "nav.sections.lowCode", icon: <Code20Regular />, route: "/low-code" },
  {
    id: "business-data",
    labelKey: "nav.sections.businessData",
    icon: <Database20Regular />,
    route: "/business-data",
  },
  {
    id: "manufacturing",
    labelKey: "nav.sections.manufacturing",
    icon: <Settings20Regular />,
    route: "/manufacturing",
  },
  {
    id: "maintenance",
    labelKey: "nav.sections.maintenance",
    icon: <Toolbox20Regular />,
    route: "/maintenance",
  },
  {
    id: "quality",
    labelKey: "nav.sections.quality",
    icon: <ShieldCheckmark20Regular />,
    route: "/quality",
  },
  {
    id: "planning-and-logistics",
    labelKey: "nav.sections.planningAndLogistics",
    icon: <Flow20Regular />,
    route: "/planning-and-logistics",
  },
  {
    id: "business-intelligence",
    labelKey: "nav.sections.businessIntelligence",
    icon: <DataBarVertical20Regular />,
    route: "/business-intelligence",
  },
  {
    id: "automation",
    labelKey: "nav.sections.automation",
    icon: <Target20Regular />,
    route: "/automation",
  },
  {
    id: "data-platform",
    labelKey: "nav.sections.dataPlatform",
    icon: <Server20Regular />,
    route: "/data-platform",
  },
  { id: "apps", labelKey: "nav.sections.apps", icon: <Window20Regular />, route: "/apps" },
];

export const ADMINISTRATION_TILES: AdministrationTile[] = [
  {
    id: "ai-agent",
    labelKey: "nav.tiles.aiAgent",
    icon: <Bot24Regular />,
    route: "/administration/ai-agent",
  },
  {
    id: "ai-mcp-server",
    labelKey: "nav.tiles.aiMcpServer",
    icon: <PlugConnected24Regular />,
    route: "/administration/ai-mcp-server",
  },
  {
    id: "apps",
    labelKey: "nav.tiles.apps",
    icon: <Window24Regular />,
    route: "/administration/apps",
  },
  {
    id: "augmented-reality",
    labelKey: "nav.tiles.augmentedReality",
    icon: <Cube24Regular />,
    route: "/administration/augmented-reality",
  },
  {
    id: "change-package",
    labelKey: "nav.tiles.changePackage",
    icon: <Box24Regular />,
    route: "/administration/change-package",
  },
  {
    id: "configuration",
    labelKey: "nav.tiles.configuration",
    icon: <Wrench24Regular />,
    route: "/administration/configuration",
  },
  {
    id: "data-orchestrator",
    labelKey: "nav.tiles.dataOrchestrator",
    icon: <Flow24Regular />,
    route: "/administration/data-orchestrator",
  },
  {
    id: "dee-actions",
    labelKey: "nav.tiles.deeActions",
    icon: <Braces24Regular />,
    route: "/administration/dee-actions",
  },
  {
    id: "entity-types",
    labelKey: "nav.tiles.entityTypes",
    icon: <DocumentBulletList24Regular />,
    route: "/administration/entity-types",
  },
  {
    id: "event-rules",
    labelKey: "nav.tiles.eventRules",
    icon: <Flash24Regular />,
    route: "/administration/event-rules",
  },
  {
    id: "fablives",
    labelKey: "nav.tiles.fabLives",
    icon: <Target24Regular />,
    route: "/administration/fablives",
  },
  {
    id: "global-shortcuts",
    labelKey: "nav.tiles.globalShortcuts",
    icon: <Keyboard24Regular />,
    route: "/administration/global-shortcuts",
  },
  {
    id: "licenses",
    labelKey: "nav.tiles.licenses",
    icon: <Certificate24Regular />,
    route: "/administration/licenses",
  },
  {
    id: "localized-messages",
    labelKey: "nav.tiles.localizedMessages",
    icon: <LocalLanguage24Regular />,
    route: "/administration/localized-messages",
  },
  {
    id: "master-data-export",
    labelKey: "nav.tiles.masterDataExport",
    icon: <ArrowDownload24Regular />,
    route: "/administration/master-data-export",
  },
  {
    id: "master-data-package",
    labelKey: "nav.tiles.masterDataPackage",
    icon: <Box24Regular />,
    route: "/administration/master-data-package",
  },
  {
    id: "message-bus",
    labelKey: "nav.tiles.messageBus",
    icon: <Organization24Regular />,
    route: "/administration/message-bus",
  },
  {
    id: "multimedia",
    labelKey: "nav.tiles.multimedia",
    icon: <Image24Regular />,
    route: "/administration/multimedia",
  },
  {
    id: "name-generators",
    labelKey: "nav.tiles.nameGenerators",
    icon: <NumberSymbol24Regular />,
    route: "/administration/name-generators",
  },
  {
    id: "printing-integration",
    labelKey: "nav.tiles.printingIntegration",
    icon: <Print24Regular />,
    route: "/administration/printing-integration",
  },
  {
    id: "queries",
    labelKey: "nav.tiles.queries",
    icon: <DocumentSearch24Regular />,
    route: "/administration/queries",
  },
  {
    id: "rules",
    labelKey: "nav.tiles.rules",
    icon: <Diamond24Filled />,
    route: "/administration/rules",
  },
  {
    id: "security",
    labelKey: "nav.tiles.security",
    icon: <LockClosed24Filled />,
    route: "/administration/security",
  },
  {
    id: "state-models",
    labelKey: "nav.tiles.stateModels",
    icon: <ArrowSync24Regular />,
    route: "/administration/state-models",
  },
  {
    id: "system-integrations",
    labelKey: "nav.tiles.systemIntegrations",
    icon: <Globe24Regular />,
    route: "/administration/system-integrations",
  },
  {
    id: "system-monitoring",
    labelKey: "nav.tiles.systemMonitoring",
    icon: <HeartPulse24Regular />,
    route: "/administration/system-monitoring",
  },
  {
    id: "tables",
    labelKey: "nav.tiles.tables",
    icon: <Table24Regular />,
    route: "/administration/tables",
  },
  {
    id: "timers",
    labelKey: "nav.tiles.timers",
    icon: <Timer24Regular />,
    route: "/administration/timers",
  },
  {
    id: "uipages",
    labelKey: "nav.tiles.uipages",
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
  labelKey: TranslationKey | null;
  label: string | null;
  route: string;
}

export interface RouteTabInfo {
  id: string;
  route: string;
  titleKey: TranslationKey | null;
  title: string | null;
  parentRoute: string | null;
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
        segments[0] === "configuration") &&
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
