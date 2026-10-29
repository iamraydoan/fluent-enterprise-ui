import type { ReactElement } from "react";
import {
  Apps20Regular,
  DataBarVertical20Regular,
  Database20Regular,
  Flow20Regular,
  Globe20Regular,
  Settings20Regular,
  Sparkle20Filled,
  Target20Regular,
  Window20Regular,
  Wrench20Regular,
} from "@/components/icons";

export interface NavigationItem {
  id: string;
  label: string;
  icon: ReactElement;
  opens?: "detail";
  columns?: string[];
  tableRows?: string[][];
}

export const DETAIL_TITLE_BY_NAME: Record<string, string> = { AIAgent: "CM MES Agent" };

export function getNavigationItem(navigationId: string) {
  return NAVIGATION_ITEMS.find((item) => item.id === navigationId);
}

export function routeForNav(navigationId: string) {
  return navigationId === "entities" ? "/entity-types" : `/modules/${navigationId}`;
}

export function routeForTab(tab: { id: string; type: string; nav: string }) {
  if (tab.type === "list") return "/entity-types";
  if (tab.type === "page") return `/modules/${tab.nav}`;
  return `/detail/${encodeURIComponent(tab.id.slice(2))}`;
}

export type RouteTab =
  | { kind: "list" }
  | { kind: "page"; nav: string }
  | { kind: "detail"; name: string }
  | { kind: "none" };

export function tabFromPath(pathname: string): RouteTab {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  if (path === "/" || path === "/entity-types") return { kind: "list" };
  if (path.startsWith("/modules/")) {
    const nav = decodeURIComponent(path.slice("/modules/".length));
    return nav ? { kind: "page", nav } : { kind: "none" };
  }
  if (path.startsWith("/detail/")) {
    const name = decodeURIComponent(path.slice("/detail/".length));
    return name ? { kind: "detail", name } : { kind: "none" };
  }
  return { kind: "none" };
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: "ai",
    label: "AI Agents",
    icon: <Sparkle20Filled style={{ color: "#4F8CFF" }} />,
    opens: "detail",
    columns: ["AGENT", "DESCRIPTION", "MCP SERVERS", "STATE"],
    tableRows: [
      ["CM MES Agent", "Answers questions about MES documents and entity revisions", "2", "Active"],
      ["Quality Assistant", "Helps review non-conformance reports", "1", "Active"],
      ["Document Summarizer", "Summarizes attachments and documents", "1", "Active"],
      ["Maintenance Planner", "Suggests maintenance schedules", "0", "Draft"],
    ],
  },
  {
    id: "tools",
    label: "Tools",
    icon: <Wrench20Regular />,
    columns: ["TOOL", "TYPE", "OWNER", "STATE"],
    tableRows: [
      ["Label Printer", "Integration", "Operations", "Active"],
      ["Barcode Scanner", "Device", "Warehouse", "Active"],
      ["Report Exporter", "Utility", "IT", "Active"],
      ["Data Importer", "Utility", "IT", "Terminated"],
    ],
  },
  {
    id: "apps",
    label: "Apps",
    icon: <Apps20Regular />,
    columns: ["APP", "DESCRIPTION", "TYPE", "STATE"],
    tableRows: [
      ["Shop Floor", "Operator console for work orders", "System", "Active"],
      ["Quality", "Inspection and NCR handling", "System", "Active"],
      ["Maintenance", "Equipment maintenance app", "User defined", "Active"],
      ["Traceability", "Genealogy and lot tracking", "System", "Active"],
    ],
  },
  { id: "entities", label: "Entity Types", icon: <Database20Regular /> },
  {
    id: "settings",
    label: "Configuration",
    icon: <Settings20Regular />,
    columns: ["SETTING", "VALUE", "SCOPE", "MODIFIED"],
    tableRows: [
      ["Default language", "English", "Global", "12/10/2026"],
      ["Time zone", "UTC+07:00", "Global", "12/10/2026"],
      ["Session timeout", "30 min", "Security", "03/09/2026"],
      ["Audit logging", "Enabled", "Security", "03/09/2026"],
    ],
  },
  {
    id: "targets",
    label: "Targets",
    icon: <Target20Regular />,
    columns: ["TARGET", "METRIC", "VALUE", "PERIOD"],
    tableRows: [
      ["Yield", "First pass yield", "98.5%", "Monthly"],
      ["OEE", "Overall equipment effectiveness", "82%", "Monthly"],
      ["Scrap rate", "Scrap per 1000 units", "1.2", "Weekly"],
      ["On-time delivery", "Orders shipped on time", "96%", "Quarterly"],
    ],
  },
  {
    id: "flow",
    label: "Workflows",
    icon: <Flow20Regular />,
    columns: ["WORKFLOW", "TRIGGER", "STEPS", "STATE"],
    tableRows: [
      ["Release work order", "Manual", "6", "Active"],
      ["NCR approval", "On create", "4", "Active"],
      ["Document sign-off", "On submit", "5", "Active"],
      ["Lot hold", "On inspection fail", "3", "Draft"],
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: <DataBarVertical20Regular />,
    columns: ["REPORT", "CATEGORY", "LAST RUN", "OWNER"],
    tableRows: [
      ["Production summary", "Operations", "28/10/2026", "Operations"],
      ["Quality trends", "Quality", "27/10/2026", "Quality"],
      ["Downtime analysis", "Maintenance", "25/10/2026", "Maintenance"],
      ["Inventory aging", "Warehouse", "20/10/2026", "Warehouse"],
    ],
  },
  {
    id: "web",
    label: "Portal",
    icon: <Globe20Regular />,
    columns: ["PORTAL", "URL", "AUDIENCE", "STATE"],
    tableRows: [
      ["Supplier portal", "/portal/suppliers", "External", "Active"],
      ["Customer portal", "/portal/customers", "External", "Active"],
      ["Employee portal", "/portal/employees", "Internal", "Active"],
    ],
  },
  {
    id: "win",
    label: "Windows",
    icon: <Window20Regular />,
    columns: ["WINDOW", "DESCRIPTION", "MODULE", "STATE"],
    tableRows: [
      ["Work Order Entry", "Create and edit work orders", "Shop Floor", "Active"],
      ["Inspection Form", "Record inspection results", "Quality", "Active"],
      ["Material Receipt", "Receive materials into stock", "Warehouse", "Active"],
    ],
  },
];
