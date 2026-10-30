import { useEntityTypes } from "@/api";
import type { EntityTypeRecord } from "@/api";
import {
  createAction,
  DataTableCard,
  defaultListFilters,
  downloadLbosAction,
  exportAction,
  ListPage,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { DocumentBulletList20Regular } from "@/components/icons";
import { useAppTranslation } from "@/i18n";

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
  const { t } = useAppTranslation();
  return (
    <ListPage
      header={{
        icon: <DocumentBulletList20Regular />,
        title: t("entityTypes.pageLabel"),
        actions: [createAction, refreshAction, exportAction, downloadLbosAction],
      }}
    >
      <DataTableCard
        title={(count) => t("entityTypes.title", { count })}
        ariaLabel={t("entityTypes.pageLabel")}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useEntityTypes}
        getRowId={(row) => row.id}
      />
    </ListPage>
  );
}
