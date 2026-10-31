import { useState } from "react";
import { useQueries, useQueryFolders } from "@/api";
import type { QueryRecord } from "@/api";
import {
  createAction,
  endpointAction,
  exportAction,
  importAction,
  DataListPage,
  refreshAction,
  searchFilter,
  SidePanel,
  SidebarNavItem,
} from "@/components/common";
import type { DataColumn, DataFilter } from "@/components/common";
import { DocumentSearch24Regular, Folder24Regular, Grid24Regular } from "@/components/icons";
import { makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { ListQueryParams, ListQueryResult } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

const ALL_FOLDERS = "all";

const usePageStyles = makeStyles({
  body: { display: "flex", columnGap: "10px", flexGrow: 1, minHeight: 0 },
  main: { flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column" },
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

export function QueriesPage() {
  const { t } = useAppTranslation();
  const styles = usePageStyles();
  const [collapsed, setCollapsed] = useState(false);
  const [folder, setFolder] = useState(ALL_FOLDERS);
  const { data: folders = [] } = useQueryFolders();

  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/administration/queries/$name", openRoute);

  function useQueryList(params: ListQueryParams): ListQueryResult<QueryRecord> {
    const query = useQueries({
      folder: folder === ALL_FOLDERS ? undefined : folder,
      q: params.filters?.q,
      showSystemItems: params.filters?.showSystemItems === "true",
    });
    return {
      data: query.data ? { data: query.data, meta: { total: query.data.length } } : undefined,
      isLoading: query.isLoading,
    };
  }

  return (
    <DataListPage
      icon={<DocumentSearch24Regular />}
      titleKey="queries.pageLabel"
      listTitleKey="queries.listTitle"
      actions={[createAction, refreshAction, importAction, exportAction, endpointAction]}
      columns={COLUMNS}
      filters={FILTERS}
      useListQuery={useQueryList}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
      sidebar={
        <SidePanel
          title={t("queries.foldersTitle")}
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
        >
          <SidebarNavItem
            icon={<Grid24Regular />}
            label={t("queries.allQueries")}
            active={folder === ALL_FOLDERS}
            onClick={() => setFolder(ALL_FOLDERS)}
          />
          <div className={styles.sectionLabel}>{t("queries.foldersSection")}</div>
          {folders.map((entry) => (
            <SidebarNavItem
              key={entry.path}
              icon={<Folder24Regular />}
              label={entry.name}
              active={folder === entry.path}
              onClick={() => setFolder(entry.path)}
            />
          ))}
        </SidePanel>
      }
    />
  );
}
