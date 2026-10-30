import { useEntityTypes } from "@/api";
import type { EntityTypeRecord } from "@/api";
import {
  createAction,
  DataListPage,
  downloadLbosAction,
  exportAction,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { DocumentBulletList20Regular } from "@/components/icons";

const COLUMNS: DataColumn<EntityTypeRecord>[] = [
  {
    field: "name",
    headerName: "entityTypes.columns.name",
    locked: true,
    width: "22%",
    truncate: true,
  },
  {
    field: "description",
    headerName: "entityTypes.columns.description",
    width: "22%",
    truncate: true,
  },
  {
    field: "system",
    headerName: "entityTypes.columns.system",
    type: "boolean",
    width: "14%",
    align: "center",
  },
  {
    field: "isRelation",
    headerName: "entityTypes.columns.relation",
    type: "boolean",
    width: "14%",
    align: "center",
  },
  {
    field: "versioned",
    headerName: "entityTypes.columns.versioned",
    type: "boolean",
    width: "14%",
    align: "center",
  },
  {
    field: "state",
    headerName: "entityTypes.columns.state",
    width: "14%",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
  },
];

export function EntityTypesListPage() {
  return (
    <DataListPage
      icon={<DocumentBulletList20Regular />}
      titleKey="entityTypes.pageLabel"
      listTitleKey="entityTypes.title"
      actions={[createAction, refreshAction, exportAction, downloadLbosAction]}
      columns={COLUMNS}
      useListQuery={useEntityTypes}
      getRowId={(row) => row.id}
    />
  );
}
