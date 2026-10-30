import type { QueryDetail, QueryFolder, QueryRecord } from "@/api";

export const QUERY_FOLDERS: QueryFolder[] = [
  { name: "Queries", path: "Queries" },
  { name: "Printing", path: "Printing" },
];

const QUERIES: QueryRecord[] = [
  {
    name: "EDCParameters",
    description: "",
    entityType: "Parameter",
    folder: "Queries",
    isPrivate: false,
    isSystem: true,
    modifiedBy: "System",
    modifiedOn: 1787950080000,
  },
  {
    name: "GetAllMaterials",
    description: "",
    entityType: "Material",
    folder: "Queries",
    isPrivate: false,
    isSystem: false,
    modifiedBy: "admin",
    modifiedOn: 1788185880000,
  },
  {
    name: "PrintableDocumentGetFacilityQuery",
    description: "Query Used on PrintableDocument Templates for Facility",
    entityType: "Facility",
    folder: "Printing",
    isPrivate: false,
    isSystem: false,
    modifiedBy: "admin",
    modifiedOn: 1788189240000,
  },
  {
    name: "ResourcesWithSubs",
    description: "",
    entityType: "Resource",
    folder: "Queries",
    isPrivate: false,
    isSystem: false,
    modifiedBy: "admin",
    modifiedOn: 1788177780000,
  },
  {
    name: "Standalone Workflows",
    description: "Standalone Workflows",
    entityType: "AutomationWorkflow",
    folder: "Queries",
    isPrivate: false,
    isSystem: true,
    modifiedBy: "System",
    modifiedOn: 1787950020000,
  },
];

export interface QuerySearch {
  folder?: string;
  q?: string;
  showSystemItems?: boolean;
}

export function queryQueries(search: QuerySearch): QueryRecord[] {
  let rows = QUERIES;
  if (search.folder !== undefined && search.folder !== "" && search.folder !== "all") {
    rows = rows.filter((record) => record.folder === search.folder);
  }
  if (search.q !== undefined && search.q !== "") {
    const needle = search.q.toLowerCase();
    rows = rows.filter(
      (record) =>
        record.name.toLowerCase().includes(needle) ||
        record.description.toLowerCase().includes(needle) ||
        record.entityType.toLowerCase().includes(needle),
    );
  }
  if (!search.showSystemItems) {
    rows = rows.filter((record) => !record.isSystem);
  }
  return rows;
}

export function buildQueryDetail(name: string): QueryDetail {
  const record = QUERIES.find((query) => query.name === name);
  const base: QueryRecord = record ?? {
    name,
    description: "",
    entityType: "Material",
    folder: "Queries",
    isPrivate: false,
    isSystem: false,
    modifiedBy: "admin",
    modifiedOn: 1788185880000,
  };
  if (name === "GetAllMaterials") {
    return {
      ...base,
      filters: [
        {
          property: "UniversalState",
          operator: "is equal to",
          value: "Active",
          isParameter: true,
          isOptional: false,
        },
      ],
      columns: ["NAME"],
      results: [{ NAME: "MAT-0001" }, { NAME: "MAT-0002" }, { NAME: "MAT-0003" }],
    };
  }
  return { ...base, filters: [], columns: ["NAME"], results: [] };
}
