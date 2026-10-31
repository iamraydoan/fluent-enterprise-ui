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
  Navigation24Regular,
  NumberSymbol24Regular,
  Organization24Regular,
  PlugConnected24Regular,
  Print24Regular,
  QrCode20Regular,
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

export const BUSINESS_DATA_ENTITIES: AdministrationTile[] = [
  {
    id: "area",
    labelKey: "nav.entities.area",
    icon: <Box24Regular />,
    route: "/business-data/area",
  },
  {
    id: "batch",
    labelKey: "nav.entities.batch",
    icon: <Box24Regular />,
    route: "/business-data/batch",
  },
  {
    id: "bom",
    labelKey: "nav.entities.bom",
    icon: <Box24Regular />,
    route: "/business-data/bom",
  },
  {
    id: "bin-converter",
    labelKey: "nav.entities.binConverter",
    icon: <Box24Regular />,
    route: "/business-data/bin-converter",
  },
  {
    id: "business-partner",
    labelKey: "nav.entities.businessPartner",
    icon: <Box24Regular />,
    route: "/business-data/business-partner",
  },
  {
    id: "calendar",
    labelKey: "nav.entities.calendar",
    icon: <Box24Regular />,
    route: "/business-data/calendar",
  },
  {
    id: "certification",
    labelKey: "nav.entities.certification",
    icon: <Box24Regular />,
    route: "/business-data/certification",
  },
  {
    id: "change-set",
    labelKey: "nav.entities.changeSet",
    icon: <Box24Regular />,
    route: "/business-data/change-set",
  },
  {
    id: "chart",
    labelKey: "nav.entities.chart",
    icon: <Box24Regular />,
    route: "/business-data/chart",
  },
  {
    id: "checklist",
    labelKey: "nav.entities.checklist",
    icon: <Box24Regular />,
    route: "/business-data/checklist",
  },
  {
    id: "container",
    labelKey: "nav.entities.container",
    icon: <Box24Regular />,
    route: "/business-data/container",
  },
  {
    id: "data-collection",
    labelKey: "nav.entities.dataCollection",
    icon: <Box24Regular />,
    route: "/business-data/data-collection",
  },
  {
    id: "data-collection-limit-set",
    labelKey: "nav.entities.dataCollectionLimitSet",
    icon: <Box24Regular />,
    route: "/business-data/data-collection-limit-set",
  },
  {
    id: "data-silo",
    labelKey: "nav.entities.dataSilo",
    icon: <Box24Regular />,
    route: "/business-data/data-silo",
  },
  {
    id: "document",
    labelKey: "nav.entities.document",
    icon: <Box24Regular />,
    route: "/business-data/document",
  },
  {
    id: "employee",
    labelKey: "nav.entities.employee",
    icon: <Box24Regular />,
    route: "/business-data/employee",
  },
  {
    id: "enterprise",
    labelKey: "nav.entities.enterprise",
    icon: <Box24Regular />,
    route: "/business-data/enterprise",
  },
  {
    id: "experiment-definition",
    labelKey: "nav.entities.experimentDefinition",
    icon: <Box24Regular />,
    route: "/business-data/experiment-definition",
  },
  {
    id: "facility",
    labelKey: "nav.entities.facility",
    icon: <Box24Regular />,
    route: "/business-data/facility",
  },
  {
    id: "flow",
    labelKey: "nav.entities.flow",
    icon: <Box24Regular />,
    route: "/business-data/flow",
  },
  {
    id: "inspection-plan",
    labelKey: "nav.entities.inspectionPlan",
    icon: <Box24Regular />,
    route: "/business-data/inspection-plan",
  },
  {
    id: "kpi",
    labelKey: "nav.entities.kpi",
    icon: <Box24Regular />,
    route: "/business-data/kpi",
  },
  {
    id: "maintenance-activity-order",
    labelKey: "nav.entities.maintenanceActivityOrder",
    icon: <Box24Regular />,
    route: "/business-data/maintenance-activity-order",
  },
  {
    id: "maintenance-plan",
    labelKey: "nav.entities.maintenancePlan",
    icon: <Box24Regular />,
    route: "/business-data/maintenance-plan",
  },
  {
    id: "map",
    labelKey: "nav.entities.map",
    icon: <Box24Regular />,
    route: "/business-data/map",
  },
  {
    id: "map-definition",
    labelKey: "nav.entities.mapDefinition",
    icon: <Box24Regular />,
    route: "/business-data/map-definition",
  },
  {
    id: "material",
    labelKey: "nav.entities.material",
    icon: <Box24Regular />,
    route: "/business-data/material",
  },
  {
    id: "material-transfer",
    labelKey: "nav.entities.materialTransfer",
    icon: <Box24Regular />,
    route: "/business-data/material-transfer",
  },
  {
    id: "notification",
    labelKey: "nav.entities.notification",
    icon: <Box24Regular />,
    route: "/business-data/notification",
  },
  {
    id: "package",
    labelKey: "nav.entities.package",
    icon: <Box24Regular />,
    route: "/business-data/package",
  },
  {
    id: "parameter",
    labelKey: "nav.entities.parameter",
    icon: <Box24Regular />,
    route: "/business-data/parameter",
  },
  {
    id: "periodic-inventory",
    labelKey: "nav.entities.periodicInventory",
    icon: <Box24Regular />,
    route: "/business-data/periodic-inventory",
  },
  {
    id: "pick-list",
    labelKey: "nav.entities.pickList",
    icon: <Box24Regular />,
    route: "/business-data/pick-list",
  },
  {
    id: "plan",
    labelKey: "nav.entities.plan",
    icon: <Box24Regular />,
    route: "/business-data/plan",
  },
  {
    id: "printable-document",
    labelKey: "nav.entities.printableDocument",
    icon: <Box24Regular />,
    route: "/business-data/printable-document",
  },
  {
    id: "product",
    labelKey: "nav.entities.product",
    icon: <Box24Regular />,
    route: "/business-data/product",
  },
  {
    id: "product-group",
    labelKey: "nav.entities.productGroup",
    icon: <Box24Regular />,
    route: "/business-data/product-group",
  },
  {
    id: "production-order",
    labelKey: "nav.entities.productionOrder",
    icon: <Box24Regular />,
    route: "/business-data/production-order",
  },
  {
    id: "protocol",
    labelKey: "nav.entities.protocol",
    icon: <Box24Regular />,
    route: "/business-data/protocol",
  },
  {
    id: "qualification",
    labelKey: "nav.entities.qualification",
    icon: <Box24Regular />,
    route: "/business-data/qualification",
  },
  {
    id: "qualification-check",
    labelKey: "nav.entities.qualificationCheck",
    icon: <Box24Regular />,
    route: "/business-data/qualification-check",
  },
  {
    id: "reason",
    labelKey: "nav.entities.reason",
    icon: <Box24Regular />,
    route: "/business-data/reason",
  },
  {
    id: "recipe",
    labelKey: "nav.entities.recipe",
    icon: <Box24Regular />,
    route: "/business-data/recipe",
  },
  {
    id: "resource",
    labelKey: "nav.entities.resource",
    icon: <Box24Regular />,
    route: "/business-data/resource",
  },
  {
    id: "resource-job",
    labelKey: "nav.entities.resourceJob",
    icon: <Box24Regular />,
    route: "/business-data/resource-job",
  },
  {
    id: "sampling-pattern",
    labelKey: "nav.entities.samplingPattern",
    icon: <Box24Regular />,
    route: "/business-data/sampling-pattern",
  },
  {
    id: "sampling-plan",
    labelKey: "nav.entities.samplingPlan",
    icon: <Box24Regular />,
    route: "/business-data/sampling-plan",
  },
  {
    id: "schedule",
    labelKey: "nav.entities.schedule",
    icon: <Box24Regular />,
    route: "/business-data/schedule",
  },
  {
    id: "schedule-scenario",
    labelKey: "nav.entities.scheduleScenario",
    icon: <Box24Regular />,
    route: "/business-data/schedule-scenario",
  },
  {
    id: "send-ahead-run",
    labelKey: "nav.entities.sendAheadRun",
    icon: <Box24Regular />,
    route: "/business-data/send-ahead-run",
  },
  {
    id: "service",
    labelKey: "nav.entities.service",
    icon: <Box24Regular />,
    route: "/business-data/service",
  },
  {
    id: "setup-matrix",
    labelKey: "nav.entities.setupMatrix",
    icon: <Box24Regular />,
    route: "/business-data/setup-matrix",
  },
  {
    id: "shift-definition",
    labelKey: "nav.entities.shiftDefinition",
    icon: <Box24Regular />,
    route: "/business-data/shift-definition",
  },
  {
    id: "shift-logbook",
    labelKey: "nav.entities.shiftLogbook",
    icon: <Box24Regular />,
    route: "/business-data/shift-logbook",
  },
  {
    id: "shift-plan",
    labelKey: "nav.entities.shiftPlan",
    icon: <Box24Regular />,
    route: "/business-data/shift-plan",
  },
  {
    id: "site",
    labelKey: "nav.entities.site",
    icon: <Box24Regular />,
    route: "/business-data/site",
  },
  {
    id: "sort-rule-set",
    labelKey: "nav.entities.sortRuleSet",
    icon: <Box24Regular />,
    route: "/business-data/sort-rule-set",
  },
  {
    id: "step",
    labelKey: "nav.entities.step",
    icon: <Box24Regular />,
    route: "/business-data/step",
  },
  {
    id: "substrate-map",
    labelKey: "nav.entities.substrateMap",
    icon: <Box24Regular />,
    route: "/business-data/substrate-map",
  },
  {
    id: "substrate-map-mask",
    labelKey: "nav.entities.substrateMapMask",
    icon: <Box24Regular />,
    route: "/business-data/substrate-map-mask",
  },
  {
    id: "task",
    labelKey: "nav.entities.task",
    icon: <Box24Regular />,
    route: "/business-data/task",
  },
  {
    id: "team",
    labelKey: "nav.entities.team",
    icon: <Box24Regular />,
    route: "/business-data/team",
  },
  {
    id: "transfer-order",
    labelKey: "nav.entities.transferOrder",
    icon: <Box24Regular />,
    route: "/business-data/transfer-order",
  },
  {
    id: "transfer-requirement",
    labelKey: "nav.entities.transferRequirement",
    icon: <Box24Regular />,
    route: "/business-data/transfer-requirement",
  },
  {
    id: "workgroup",
    labelKey: "nav.entities.workgroup",
    icon: <Box24Regular />,
    route: "/business-data/workgroup",
  },
];

export const MANUFACTURING_PAGES: AdministrationTile[] = [
  {
    id: "augmented-reality",
    labelKey: "manufacturing.pages.augmentedReality",
    icon: <Cube24Regular />,
    route: "/manufacturing/augmented-reality",
  },
  {
    id: "barcode-identification",
    labelKey: "manufacturing.pages.barcodeIdentification",
    icon: <QrCode20Regular />,
    route: "/manufacturing/barcode-identification",
  },
  {
    id: "fab-explorer",
    labelKey: "manufacturing.pages.fabExplorer",
    icon: <Navigation24Regular />,
    route: "/manufacturing/fab-explorer",
  },
  {
    id: "fab-lives",
    labelKey: "manufacturing.pages.fabLives",
    icon: <Target24Regular />,
    route: "/manufacturing/fab-lives",
  },
  {
    id: "my-workgroup",
    labelKey: "manufacturing.pages.myWorkgroup",
    icon: <Organization24Regular />,
    route: "/manufacturing/my-workgroup",
  },
];

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
