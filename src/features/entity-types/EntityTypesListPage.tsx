import { useCallback, useMemo } from "react";
import { useEntityTypes } from "@/api";
import type { EntityTypeRecord } from "@/api";
import {
  createAction,
  DataTableCard,
  downloadLbosAction,
  exportAction,
  ListPage,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
  searchFilter,
  stateFilter,
} from "@/components/common";
import type { DataColumn, DataFilter } from "@/components/common";
import {
  Checkmark20Filled,
  Dismiss20Filled,
  DocumentBulletList20Regular,
} from "@/components/icons";
import { TableCellLayout } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

export function EntityTypesListPage() {
  const { t } = useAppTranslation();
  const renderBoolean = useCallback(
    (value: boolean) => (
      <div style={{ display: "flex", justifyContent: "center" }}>
        {value ? (
          <Checkmark20Filled aria-label={t("common.yes")} />
        ) : (
          <Dismiss20Filled aria-label={t("common.no")} style={{ color: "#8A8A8A" }} />
        )}
      </div>
    ),
    [t],
  );
  const columns = useMemo<DataColumn<EntityTypeRecord>[]>(
    () => [
      {
        field: "name",
        headerName: "entityTypes.columns.name",
        locked: true,
        width: "22%",
        cellRenderer: (row) => <TableCellLayout truncate>{row.name}</TableCellLayout>,
      },
      {
        field: "description",
        headerName: "entityTypes.columns.description",
        width: "22%",
        cellRenderer: (row) => (
          <TableCellLayout truncate title={row.description}>
            {row.description}
          </TableCellLayout>
        ),
      },
      {
        field: "system",
        headerName: "entityTypes.columns.system",
        width: "14%",
        align: "center",
        cellRenderer: (row) => renderBoolean(row.system),
      },
      {
        field: "relation",
        headerName: "entityTypes.columns.relation",
        width: "14%",
        align: "center",
        valueGetter: (row) => row.isRelation,
        cellRenderer: (row) => renderBoolean(row.isRelation),
      },
      {
        field: "versioned",
        headerName: "entityTypes.columns.versioned",
        width: "14%",
        align: "center",
        cellRenderer: (row) => renderBoolean(row.versioned),
      },
      {
        field: "state",
        headerName: "entityTypes.columns.state",
        width: "14%",
        enumOptions: RECORD_STATE_COLUMN_OPTIONS,
      },
    ],
    [renderBoolean],
  );
  const filters = useMemo<DataFilter[]>(() => [stateFilter(), searchFilter()], []);
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
        columns={columns}
        filters={filters}
        useListQuery={useEntityTypes}
        getRowId={(row) => row.id}
      />
    </ListPage>
  );
}
