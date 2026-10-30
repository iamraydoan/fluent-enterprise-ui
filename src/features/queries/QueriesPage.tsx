import { useState } from "react";
import { useQueries, useQueryFolders } from "@/api";
import type { QueryRecord } from "@/api";
import {
  createAction,
  DataTableCard,
  endpointAction,
  exportAction,
  importAction,
  ListPage,
  refreshAction,
  searchFilter,
  SidePanel,
} from "@/components/common";
import type { DataColumn, DataFilter } from "@/components/common";
import { DocumentSearch24Regular, Folder24Regular, Grid24Regular } from "@/components/icons";
import { makeStyles, mergeClasses, Text, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { ListQueryParams, ListQueryResult } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

const usePageStyles = makeStyles({
  body: { display: "flex", columnGap: "10px", flexGrow: 1, minHeight: 0 },
  main: { flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column" },
  folderItem: {
    display: "flex",
    alignItems: "center",
    columnGap: "8px",
    width: "100%",
    padding: "8px 12px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
    fontSize: "13px",
    borderRadius: tokens.borderRadiusMedium,
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  folderActive: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
    fontWeight: tokens.fontWeightSemibold,
  },
  sectionLabel: {
    fontSize: "11px",
    color: tokens.colorNeutralForeground3,
    textTransform: "uppercase",
    padding: "12px 12px 4px",
    letterSpacing: "0.5px",
  },
});

const COLUMNS: DataColumn<QueryRecord>[] = [
  {
    field: "name",
    headerName: "queries.columns.query",
    type: "link",
    locked: true,
    width: "25%",
  },
  { field: "description", headerName: "queries.columns.description", width: "30%" },
  { field: "entityType", headerName: "queries.columns.entityType", width: "15%" },
  { field: "modifiedBy", headerName: "queries.columns.modifiedBy", width: "15%" },
  {
    field: "modifiedOn",
    headerName: "queries.columns.modifiedOn",
    type: "dateTime",
    width: "15%",
  },
];

const FILTERS: DataFilter[] = [
  { type: "checkbox", param: "showSystemItems", labelKey: "queries.filters.systemItems" },
  searchFilter(),
];

function QueriesGrid({ folder }: { folder: string }) {
  const { t } = useAppTranslation();
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/administration/queries/$name", openRoute);

  function useQueryList(params: ListQueryParams): ListQueryResult<QueryRecord> {
    const query = useQueries({
      folder: folder === "all" ? undefined : folder,
      q: params.filters?.q,
      showSystemItems: params.filters?.showSystemItems === "true",
    });
    return {
      data: query.data ? { data: query.data, meta: { total: query.data.length } } : undefined,
      isLoading: query.isLoading,
    };
  }

  return (
    <DataTableCard
      title={(count) => t("queries.listTitle", { count })}
      ariaLabel={t("queries.pageLabel")}
      columns={COLUMNS}
      filters={FILTERS}
      useListQuery={useQueryList}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}

export function QueriesPage() {
  const { t } = useAppTranslation();
  const styles = usePageStyles();
  const [collapsed, setCollapsed] = useState(false);
  const [folder, setFolder] = useState("all");
  const { data: folders = [] } = useQueryFolders();

  return (
    <ListPage
      header={{
        icon: <DocumentSearch24Regular />,
        title: t("queries.pageLabel"),
        actions: [createAction, refreshAction, importAction, exportAction, endpointAction],
      }}
    >
      <div className={styles.body}>
        <SidePanel
          title={t("queries.foldersTitle")}
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
        >
          <button
            className={mergeClasses(styles.folderItem, folder === "all" && styles.folderActive)}
            onClick={() => setFolder("all")}
          >
            <Grid24Regular />
            <Text weight={folder === "all" ? "semibold" : "regular"} size={300}>
              {t("queries.allQueries")}
            </Text>
          </button>
          <div className={styles.sectionLabel}>{t("queries.foldersSection")}</div>
          {folders.map((entry) => (
            <button
              key={entry.path}
              className={mergeClasses(
                styles.folderItem,
                folder === entry.path && styles.folderActive,
              )}
              onClick={() => setFolder(entry.path)}
            >
              <Folder24Regular />
              <Text weight={folder === entry.path ? "semibold" : "regular"} size={300}>
                {entry.name}
              </Text>
            </button>
          ))}
        </SidePanel>
        <div className={styles.main}>
          <QueriesGrid key={folder} folder={folder} />
        </div>
      </div>
    </ListPage>
  );
}
