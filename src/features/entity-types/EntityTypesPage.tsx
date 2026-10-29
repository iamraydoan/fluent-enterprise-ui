import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { useEntityTypes } from "@/api";
import type { EntityTypeRecord } from "@/api";
import { ActionBar, DataTableCard, PageHeader, RibbonButton } from "@/components/common";
import {
  Add24Regular,
  ArrowDownload24Regular,
  ArrowExportUp24Regular,
  ArrowSync24Regular,
  Checkmark20Filled,
  Dismiss20Filled,
  DocumentBulletList20Regular,
} from "@/components/icons";
import { TableCellLayout, Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const columnHelper = createColumnHelper<EntityTypeRecord>();

const STATE_OPTIONS = ["all", "active", "terminated"];

export function EntityTypesPage() {
  const sharedStyles = useSharedStyles();
  const { t } = useAppTranslation();
  const [actionBarCollapsed, setActionBarCollapsed] = useState(false);
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
  const columns = useMemo<ColumnDef<EntityTypeRecord>[]>(
    () => [
      columnHelper.accessor("name", {
        header: () => t("entityTypes.columns.name"),
        cell: (info) => <TableCellLayout truncate>{info.getValue()}</TableCellLayout>,
        meta: { labelKey: "entityTypes.columns.name", locked: true, width: "22%" },
      }),
      columnHelper.accessor("description", {
        header: () => t("entityTypes.columns.description"),
        cell: (info) => (
          <TableCellLayout truncate title={info.getValue()}>
            {info.getValue()}
          </TableCellLayout>
        ),
        meta: { labelKey: "entityTypes.columns.description", width: "22%" },
      }),
      columnHelper.accessor("system", {
        header: () => t("entityTypes.columns.system"),
        cell: (info) => renderBoolean(info.getValue()),
        meta: { labelKey: "entityTypes.columns.system", width: "14%", centered: true },
      }),
      columnHelper.accessor((row) => row.isRelation, {
        id: "relation",
        header: () => t("entityTypes.columns.relation"),
        cell: (info) => renderBoolean(info.getValue()),
        meta: { labelKey: "entityTypes.columns.relation", width: "14%", centered: true },
      }),
      columnHelper.accessor("versioned", {
        header: () => t("entityTypes.columns.versioned"),
        cell: (info) => renderBoolean(info.getValue()),
        meta: { labelKey: "entityTypes.columns.versioned", width: "14%", centered: true },
      }),
      columnHelper.accessor("state", {
        header: () => t("entityTypes.columns.state"),
        cell: (info) =>
          info.getValue() === "Active" ? t("common.active") : t("common.terminated"),
        meta: { labelKey: "entityTypes.columns.state", width: "14%" },
      }),
    ],
    [t, renderBoolean],
  );
  return (
    <>
      <div className={sharedStyles.headerBlock}>
        {!actionBarCollapsed && (
          <ActionBar>
            <div className={sharedStyles.actionBarGroup}>
              <div className={sharedStyles.actionBarGroupButtons}>
                <RibbonButton
                  sharedStyles={sharedStyles}
                  icon={<Add24Regular />}
                  label={t("actionBar.create")}
                />
                <RibbonButton
                  sharedStyles={sharedStyles}
                  icon={<ArrowSync24Regular />}
                  label={t("actionBar.refresh")}
                />
                <RibbonButton
                  sharedStyles={sharedStyles}
                  icon={<ArrowExportUp24Regular style={{ transform: "rotate(180deg)" }} />}
                  label={t("actionBar.export")}
                />
                <RibbonButton
                  sharedStyles={sharedStyles}
                  icon={<ArrowDownload24Regular />}
                  label={t("actionBar.downloadLbos")}
                />
              </div>
              <div className={sharedStyles.actionBarGroupLabel}>
                {t("actionBar.groups.general")}
              </div>
            </div>
          </ActionBar>
        )}
        <PageHeader
          collapsed={actionBarCollapsed}
          onToggle={() => setActionBarCollapsed((v) => !v)}
        >
          <span style={{ display: "inline-flex", alignItems: "center", columnGap: 12 }}>
            <DocumentBulletList20Regular />
            <Text size={300}>{t("entityTypes.pageLabel")}</Text>
          </span>
        </PageHeader>
      </div>

      <DataTableCard
        title={(count) => t("entityTypes.title", { count })}
        ariaLabel={t("entityTypes.pageLabel")}
        columns={columns}
        stateOptions={STATE_OPTIONS}
        useListQuery={useEntityTypes}
        getRowId={(row) => row.id}
      />
    </>
  );
}
