import { useMemo, useRef, useState } from "react";
import { useConfigurationTree, useConfigurations } from "@/api";
import type { ConfigurationEntry } from "@/api";
import { createAction, DataListPage, refreshAction, SidePanel } from "@/components/common";
import type { DataColumn, DataFilter, DataTableCardApi, HeaderAction } from "@/components/common";
import { MoreVertical24Regular, Wrench20Regular } from "@/components/icons";
import { makeStyles, mergeClasses, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { ConfigurationTree } from "./ConfigurationTree";
import { CONFIG_ENTRY_TYPE_LABELS, CONFIG_ENTRY_TYPES, entryName, maskedValue } from "./data";

const usePageStyles = makeStyles({
  allEntries: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: "44px",
    padding: "0 12px",
    marginBottom: "4px",
    border: "none",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    textAlign: "left",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  allEntriesActive: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
  },
});

const COLUMNS: DataColumn<ConfigurationEntry>[] = [
  {
    field: "path",
    headerName: "configuration.columns.path",
    locked: true,
    width: "38%",
    truncate: true,
  },
  {
    field: "name",
    headerName: "configuration.columns.name",
    width: "30%",
    truncate: true,
    valueGetter: (entry) => entryName(entry.path),
  },
  {
    field: "value",
    headerName: "configuration.columns.value",
    truncate: true,
    valueGetter: maskedValue,
  },
  {
    field: "type",
    headerName: "configuration.columns.type",
    defaultHidden: true,
  },
  {
    field: "description",
    headerName: "configuration.columns.description",
    defaultHidden: true,
  },
  {
    field: "modifiedOn",
    headerName: "configuration.columns.modifiedOn",
    type: "dateTime",
    defaultHidden: true,
  },
  {
    field: "modifiedBy",
    headerName: "configuration.columns.modifiedBy",
    defaultHidden: true,
  },
  {
    field: "createdOn",
    headerName: "configuration.columns.createdOn",
    type: "dateTime",
    defaultHidden: true,
  },
  {
    field: "createdBy",
    headerName: "configuration.columns.createdBy",
    defaultHidden: true,
  },
];

const FILTERS: DataFilter[] = [
  {
    type: "checkbox",
    param: "userConfigs",
    labelKey: "configuration.filters.userConfigs",
    defaultChecked: true,
  },
  {
    type: "select",
    param: "displayBy",
    labelKey: "configuration.filters.displayBy",
    options: [
      { value: "latest", labelKey: "configuration.displayBy.latestChanges" },
      { value: "path", labelKey: "configuration.displayBy.path" },
      { value: "name", labelKey: "configuration.displayBy.name" },
    ],
  },
  {
    type: "select",
    param: "type",
    labelKey: "configuration.filters.type",
    includeAll: true,
    options: CONFIG_ENTRY_TYPES.map((type) => ({
      value: type,
      labelKey: CONFIG_ENTRY_TYPE_LABELS[type],
    })),
  },
  {
    type: "select",
    param: "searchFields",
    labelKey: "configuration.filters.searchFields",
    options: [
      { value: "all", labelKey: "common.all" },
      { value: "path", labelKey: "configuration.searchFields.path" },
      { value: "name", labelKey: "configuration.searchFields.name" },
      { value: "value", labelKey: "configuration.searchFields.value" },
    ],
  },
  { type: "search", param: "q" },
];

export function ConfigurationListPage() {
  const { t } = useAppTranslation();
  const styles = usePageStyles();
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/administration/configuration/$path", openRoute);
  const tableApi = useRef<DataTableCardApi | null>(null);
  const [showTree, setShowTree] = useState(true);
  const { data: branchPaths } = useConfigurationTree();

  const actions = useMemo<HeaderAction[]>(
    () => [
      refreshAction,
      createAction,
      {
        id: "more",
        icon: <MoreVertical24Regular />,
        labelKey: "actionBar.more",
        group: "actions",
        menu: [
          {
            label: t("configuration.resetFilters"),
            onClick: () => tableApi.current?.resetFilters(),
          },
          {
            label: t("configuration.resetColumns"),
            onClick: () => tableApi.current?.resetColumns(),
          },
        ],
      },
    ],
    [t],
  );

  return (
    <DataListPage
      icon={<Wrench20Regular />}
      titleKey="configuration.pageLabel"
      listTitleKey="configuration.listTitle"
      actions={actions}
      columns={COLUMNS}
      filters={FILTERS}
      useListQuery={useConfigurations}
      getRowId={(entry) => entry.path}
      onRowClick={(entry) => openDetail(entry.path)}
      apiRef={tableApi}
      sidebar={
        <SidePanel
          title={t("configuration.tree.title")}
          collapsed={!showTree}
          onToggle={() => setShowTree((visible) => !visible)}
        >
          <button
            className={mergeClasses(styles.allEntries, styles.allEntriesActive)}
            onClick={() => tableApi.current?.resetFilters()}
          >
            {t("configuration.tree.allEntries")}
          </button>
          <ConfigurationTree
            branchPaths={branchPaths ?? []}
            selectedPath={null}
            onSelect={openDetail}
          />
        </SidePanel>
      }
    />
  );
}
