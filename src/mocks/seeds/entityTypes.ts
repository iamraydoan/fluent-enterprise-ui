import type { EntityTypeRecord } from "@/api";

type SeedState = "Active" | "Terminated";

type SpecialEntityTypeRow = [string, string, number, number, number, SeedState];

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

interface RawEntityTypeRow {
  name: string;
  description: string;
  system: boolean;
  relation: boolean;
  versioned: boolean;
  state: SeedState;
}

function buildRawRows(): RawEntityTypeRow[] {
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
    .map(([name, description, system, relation, versioned, state]) => ({
      name,
      description,
      system: !!system,
      relation: !!relation,
      versioned: !!versioned,
      state,
    }));
}

const LOCK_TYPES = ["LOCK_NONE", "LOCK_SOURCE", "LOCK_TARGET", "LOCK_SOURCE_AND_TARGET"];

const pickLockType = (index: number): string => {
  if (index % 23 === 0) return LOCK_TYPES[3];
  if (index % 11 === 0) return LOCK_TYPES[2];
  if (index % 5 === 0) return LOCK_TYPES[1];
  return LOCK_TYPES[0];
};

const DAY_MS = 86400000;
const BASE_TIME = Date.UTC(2023, 0, 2);

export function buildEntityTypeSeeds(): EntityTypeRecord[] {
  return buildRawRows().map((row, index) => {
    const createdAt = new Date(BASE_TIME + index * DAY_MS).toISOString();
    const updatedAt = new Date(BASE_TIME + index * DAY_MS + (index % 7) * DAY_MS).toISOString();
    return {
      id: `11111111-1111-4111-8111-${index.toString(16).padStart(12, "0")}`,
      name: row.name,
      description: row.description,
      system: row.system,
      versioned: row.versioned,
      isRelation: row.relation,
      state: row.state,
      lockType: pickLockType(index),
      createdAt,
      updatedAt,
    };
  });
}
