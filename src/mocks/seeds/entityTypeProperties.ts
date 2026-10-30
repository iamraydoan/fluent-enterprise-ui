import type { EntityTypeProperty } from "@/api";

const SYSTEM_PROPERTIES: EntityTypeProperty[] = [
  {
    name: "Name",
    description: "The name of the object.",
    kind: "Native",
    referenceType: "None",
    scalarType: "NVarchar",
    size: 256,
    searchable: true,
    searchType: "StartsWith",
    enabled: true,
    isSystem: true,
  },
  {
    name: "Description",
    description: "The description of the object.",
    kind: "Native",
    referenceType: "None",
    scalarType: "NVarchar",
    size: 512,
    searchable: false,
    enabled: true,
    isSystem: true,
  },
  {
    name: "CreatedBy",
    description: "The user that created the object.",
    kind: "Native",
    referenceType: "User",
    scalarType: "NVarchar",
    size: 256,
    searchable: false,
    enabled: true,
    isSystem: true,
  },
  {
    name: "CreatedOn",
    description: "The date the object was created.",
    kind: "Native",
    referenceType: "None",
    scalarType: "DateTime",
    searchable: false,
    enabled: true,
    isSystem: true,
  },
];

const CUSTOM_TEMPLATES: Array<{
  name: string;
  description: string;
  scalarType: string;
  size?: number;
  searchable?: boolean;
  searchType?: "Contains" | "StartsWith";
}> = [
  {
    name: "ExternalId",
    description: "The identifier of the object in the external system.",
    scalarType: "Varchar",
    size: 128,
    searchable: true,
    searchType: "StartsWith",
  },
  {
    name: "Notes",
    description: "Free text notes about the object.",
    scalarType: "NVarchar",
    size: 512,
  },
  {
    name: "Priority",
    description: "The priority level of the object.",
    scalarType: "Int",
  },
  {
    name: "IsActive",
    description: "Whether the object is active.",
    scalarType: "Bit",
  },
];

export function buildEntityTypeProperties(entityName: string): EntityTypeProperty[] {
  let hash = 0;
  for (const char of entityName) hash = (hash * 31 + char.charCodeAt(0)) % 997;
  const extra = CUSTOM_TEMPLATES.filter((_, index) => (hash + index) % 3 !== 0);
  return [
    ...SYSTEM_PROPERTIES,
    ...extra.map((template) => ({
      name: template.name,
      description: template.description,
      kind: "Custom" as const,
      referenceType: "None",
      scalarType: template.scalarType,
      size: template.size,
      searchable: template.searchable ?? false,
      searchType: template.searchType,
      enabled: true,
      isSystem: false,
    })),
  ];
}
