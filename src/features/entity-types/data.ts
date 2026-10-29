import type {
  EntityColumn,
  EntityColumnKey,
  EntityState,
  EntityType,
  VisibleColumn,
} from "./types";

type SpecialEntityTypeRow = [string, string, number, number, number, EntityState];

const SPECIAL_ENTITY_TYPE_ROWS: SpecialEntityTypeRow[] = [
  ["AIAgent", "This object represents an AI Agent Definition", 1, 0, 0, "Active"],
  [
    "AIAgentMCPServer",
    "This object represents the relationship between an AI Agent and an MCP Server",
    1,
    1,
    0,
    "Active",
  ],
  ["AIMCPServer", "This object represents MCP Server configuration", 1, 0, 0, "Active"],
  ["AnalyticsView", "This object represents a unique Analytics View", 1, 0, 0, "Active"],
  ["App", "Represents an App, either system app or user defined app", 1, 0, 0, "Active"],
  ["Area", "Area Object", 1, 0, 0, "Active"],
  ["AreaSupplyArea", "AreaSupplyArea Object", 1, 0, 0, "Active"],
  ["AreaTransferRequirementType", "AreaTransferRequirementType Object", 1, 0, 0, "Active"],
  ["Asset", "This object represents a unique Asset", 1, 0, 0, "Terminated"],
  [
    "AssetAssetTemplate",
    "This object belongs to an Asset and categorizes it by template",
    1,
    1,
    0,
    "Terminated",
  ],
  ["AssetDashboard", "Relation that maps an Asset to an UI Page dashboard", 1, 1, 0, "Terminated"],
  [
    "AssetDirectory",
    "This object represents an independent directory of assets",
    1,
    0,
    0,
    "Terminated",
  ],
  ["AssetEvent", "This object represents the property value change event", 1, 0, 0, "Terminated"],
  ["AssetProperty", "This object represents the property value of an asset", 1, 0, 0, "Terminated"],
  [
    "AssetPropertyDefinition",
    "This object represents a property definition for assets",
    1,
    0,
    0,
    "Terminated",
  ],
];
const NAME_PREFIXES = [
  "Batch",
  "Bill",
  "Calendar",
  "Carrier",
  "Catalog",
  "Contact",
  "Contract",
  "Customer",
  "Dashboard",
  "Document",
  "Equipment",
  "Event",
  "Facility",
  "Inventory",
  "Invoice",
  "Item",
  "Job",
  "Location",
  "Material",
  "Order",
  "Party",
  "Payment",
  "Plant",
  "Product",
  "Project",
  "Report",
  "Resource",
  "Route",
  "Schedule",
  "Shipment",
  "Site",
  "Supplier",
  "Task",
  "User",
  "Vendor",
  "Warehouse",
  "Workflow",
  "Area",
  "Asset",
];
const NAME_SUFFIXES = [
  "",
  "Type",
  "Template",
  "Group",
  "Property",
  "PropertyDefinition",
  "Event",
  "Directory",
  "Status",
  "Category",
  "Setting",
  "Assignment",
  "Requirement",
];
const hashString = (input: string): number => {
  let hash = 7;
  for (const char of input) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash;
};

function buildEntityTypes(): EntityType[] {
  const taken = new Set(SPECIAL_ENTITY_TYPE_ROWS.map((row) => row[0]));
  const pool: string[] = [];
  for (const prefix of NAME_PREFIXES)
    for (const suffix of NAME_SUFFIXES) {
      const generatedName = prefix + suffix;
      if (!taken.has(generatedName) && !pool.includes(generatedName)) pool.push(generatedName);
    }
  pool.sort();
  const need = 393 - SPECIAL_ENTITY_TYPE_ROWS.length;
  const picked = Array.from(
    { length: need },
    (_, index) => pool[Math.floor((index * pool.length) / need)],
  );
  const gen = [...new Set(picked)].map((generatedName) => {
    const nameHash = hashString(generatedName);
    return [
      generatedName,
      `This object represents ${generatedName.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase()} data managed by the platform`,
      nameHash % 10 !== 0 ? 1 : 0,
      nameHash % 4 === 0 ? 1 : 0,
      nameHash % 7 === 0 ? 1 : 0,
      generatedName.startsWith("Asset") || nameHash % 9 === 0 ? "Terminated" : "Active",
    ] as SpecialEntityTypeRow;
  });
  return [...SPECIAL_ENTITY_TYPE_ROWS, ...gen]
    .sort((first, second) => first[0].localeCompare(second[0], "en", { sensitivity: "base" }))
    .slice(0, 393)
    .map(([name, description, system, relation, versioned, state], index) => ({
      id: index,
      name,
      description,
      system: !!system,
      relation: !!relation,
      versioned: !!versioned,
      state,
    }));
}
export const ENTITY_TYPES: EntityType[] = buildEntityTypes();

const ENTITY_TYPE_COLUMNS: EntityColumn[] = [
  {
    key: "name",
    labelKey: "entityTypes.columns.name",
    chooserLabelKey: "entityTypes.columnNames.name",
    width: "22%",
    locked: true,
  },
  {
    key: "description",
    labelKey: "entityTypes.columns.description",
    chooserLabelKey: "entityTypes.columnNames.description",
    width: "22%",
  },
  {
    key: "system",
    labelKey: "entityTypes.columns.system",
    chooserLabelKey: "entityTypes.columnNames.system",
    width: "14%",
    isCentered: true,
    isBoolean: true,
  },
  {
    key: "relation",
    labelKey: "entityTypes.columns.relation",
    chooserLabelKey: "entityTypes.columnNames.relation",
    width: "14%",
    isCentered: true,
    isBoolean: true,
  },
  {
    key: "versioned",
    labelKey: "entityTypes.columns.versioned",
    chooserLabelKey: "entityTypes.columnNames.versioned",
    width: "14%",
    isCentered: true,
    isBoolean: true,
  },
  {
    key: "state",
    labelKey: "entityTypes.columns.state",
    chooserLabelKey: "entityTypes.columnNames.state",
    width: "14%",
  },
];
export const DEFAULT_VISIBLE_COLUMNS: VisibleColumn[] = ENTITY_TYPE_COLUMNS.map((column) => ({
  key: column.key,
  visible: true,
}));
export const ENTITY_COLUMN_BY_KEY: Record<EntityColumnKey, EntityColumn> = Object.fromEntries(
  ENTITY_TYPE_COLUMNS.map((column) => [column.key, column]),
) as Record<EntityColumnKey, EntityColumn>;
