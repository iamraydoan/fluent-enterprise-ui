import { useCallback, useMemo } from "react";
import { RecordState, useEntityTypes } from "@/api";
import type { EntityTypeRecord } from "@/api";
import { DataTableCard, ListPageHeader, RECORD_STATE_LABELS } from "@/components/common";
import type { DataColumn, DataFilter } from "@/components/common";
import {
  Add24Regular,
  ArrowDownload24Regular,
  ArrowExportUp24Regular,
  ArrowSync24Regular,
  Checkmark20Filled,
  Dismiss20Filled,
  DocumentBulletList20Regular,
} from "@/components/icons";
import { TableCellLayout } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { enumOptions } from "@/lib/enum";

export function EntityTypesPage() {
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
        key: "name",
        labelKey: "entityTypes.columns.name",
        locked: true,
        width: "22%",
        render: (row) => <TableCellLayout truncate>{row.name}</TableCellLayout>,
      },
      {
        key: "description",
        labelKey: "entityTypes.columns.description",
        width: "22%",
        render: (row) => (
          <TableCellLayout truncate title={row.description}>
            {row.description}
          </TableCellLayout>
        ),
      },
      {
        key: "system",
        labelKey: "entityTypes.columns.system",
        width: "14%",
        align: "center",
        render: (row) => renderBoolean(row.system),
      },
      {
        key: "relation",
        labelKey: "entityTypes.columns.relation",
        width: "14%",
        align: "center",
        getValue: (row) => row.isRelation,
        render: (row) => renderBoolean(row.isRelation),
      },
      {
        key: "versioned",
        labelKey: "entityTypes.columns.versioned",
        width: "14%",
        align: "center",
        render: (row) => renderBoolean(row.versioned),
      },
      {
        key: "state",
        labelKey: "entityTypes.columns.state",
        width: "14%",
        render: (row) => t(RECORD_STATE_LABELS[row.state]),
      },
    ],
    [t, renderBoolean],
  );
  const filters = useMemo<DataFilter[]>(
    () => [
      {
        type: "select",
        param: "state",
        labelKey: "common.stateFilterLabel",
        includeAll: true,
        options: enumOptions([RecordState.Active, RecordState.Terminated], RECORD_STATE_LABELS),
      },
      { type: "search", param: "q" },
    ],
    [],
  );
  return (
    <>
      <ListPageHeader
        icon={<DocumentBulletList20Regular />}
        title={t("entityTypes.pageLabel")}
        actions={[
          { icon: <Add24Regular />, label: t("actionBar.create") },
          { icon: <ArrowSync24Regular />, label: t("actionBar.refresh") },
          {
            icon: <ArrowExportUp24Regular style={{ transform: "rotate(180deg)" }} />,
            label: t("actionBar.export"),
          },
          { icon: <ArrowDownload24Regular />, label: t("actionBar.downloadLbos") },
        ]}
      />

      <DataTableCard
        title={(count) => t("entityTypes.title", { count })}
        ariaLabel={t("entityTypes.pageLabel")}
        columns={columns}
        filters={filters}
        useListQuery={useEntityTypes}
        getRowId={(row) => row.id}
      />
    </>
  );
}
