import type { EntityColumn, EntityColumnKey, VisibleColumn } from "./types";

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
