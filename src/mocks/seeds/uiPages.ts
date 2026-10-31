import type { UIPageFolder, UIPageRecord } from "@/api";
import { RecordState } from "@/api";

export const UI_PAGE_FOLDERS: UIPageFolder[] = [
  { name: "Dashboards", path: "Dashboards" },
  { name: "Reports", path: "Reports" },
  { name: "Wizards", path: "Wizards" },
];

const PAGES: UIPageRecord[] = [
  {
    name: "jm_uipage_001",
    description: "Test UI Page",
    type: "Page",
    scope: "General",
    folder: "Dashboards",
    section: "Manufacturing",
    entityType: "",
    isSystem: false,
    state: RecordState.Active,
  },
  {
    name: "UIPageTest01",
    description: "Test UI Page 01",
    type: "Page",
    scope: "General",
    folder: "Dashboards",
    section: "Manufacturing",
    entityType: "",
    isSystem: false,
    state: RecordState.Active,
  },
  {
    name: "UIPageTest2",
    description: "Test UI Page 2",
    type: "Wizard",
    scope: "General",
    folder: "Wizards",
    section: "Quality",
    entityType: "",
    isSystem: false,
    state: RecordState.Active,
  },
  {
    name: "MaterialDetails",
    description: "Material details page",
    type: "Page",
    scope: "EntityType",
    folder: "Dashboards",
    section: "Business Data",
    entityType: "Material",
    isSystem: true,
    state: RecordState.Active,
  },
  {
    name: "ResourceOverview",
    description: "Resource overview cluster",
    type: "Cluster",
    scope: "General",
    folder: "Dashboards",
    section: "Manufacturing",
    entityType: "",
    isSystem: true,
    state: RecordState.Active,
  },
  {
    name: "OldReport",
    description: "Deprecated report page",
    type: "Page",
    scope: "General",
    folder: "Reports",
    section: "Business Intelligence",
    entityType: "",
    isSystem: false,
    state: RecordState.Terminated,
  },
];

export interface UIPageQuery {
  folder?: string;
  scope?: string;
  section?: string;
  entityType?: string;
  q?: string;
  showTerminated?: boolean;
  showSystemItems?: boolean;
}

export function queryUIPages(query: UIPageQuery): UIPageRecord[] {
  let rows = PAGES;
  if (query.folder !== undefined && query.folder !== "" && query.folder !== "all") {
    rows = rows.filter((page) => page.folder === query.folder);
  }
  if (query.scope !== undefined && query.scope !== "" && query.scope !== "all") {
    rows = rows.filter((page) => page.scope === query.scope);
  }
  if (query.section !== undefined && query.section !== "" && query.section !== "all") {
    rows = rows.filter((page) => page.section === query.section);
  }
  if (query.entityType !== undefined && query.entityType !== "") {
    const needle = query.entityType.toLowerCase();
    rows = rows.filter((page) => page.entityType.toLowerCase().includes(needle));
  }
  if (query.q !== undefined && query.q !== "") {
    const needle = query.q.toLowerCase();
    rows = rows.filter(
      (page) =>
        page.name.toLowerCase().includes(needle) || page.description.toLowerCase().includes(needle),
    );
  }
  if (!query.showTerminated) {
    rows = rows.filter((page) => page.state !== RecordState.Terminated);
  }
  if (!query.showSystemItems) {
    rows = rows.filter((page) => !page.isSystem);
  }
  return rows;
}
