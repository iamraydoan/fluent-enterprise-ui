import { useMemo, useRef, useState } from "react";
import { useConfigurationTree, useConfigurations } from "@/api";
import type { ConfigurationEntry } from "@/api";
import { DataTableCard, ListPage, SidePanel } from "@/components/common";
import type { DataColumn, DataFilter, DataTableCardApi, HeaderAction } from "@/components/common";
import {
  Add24Regular,
  ArrowSync24Regular,
  MoreVertical24Regular,
  Wrench20Regular,
} from "@/components/icons";
import { makeStyles, mergeClasses, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { ConfigurationTree } from "./ConfigurationTree";
import {
  CONFIG_ENTRY_TYPE_LABELS,
  CONFIG_ENTRY_TYPES,
  entryName,
  formatDateTime,
  maskedValue,
} from "./data";

const usePageStyles = makeStyles({
  body: {
    display: "flex",
    columnGap: "10px",
    flexGrow: 1,
    minHeight: 0,
  },
  panelWrap: {
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  },
  cardWrap: {
    flexGrow: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },
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

export function ConfigurationListPage() {
  const { t } = useAppTranslation();
  const styles = usePageStyles();
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/administration/configuration/$path", openRoute);
  const tableApi = useRef<DataTableCardApi | null>(null);
  const [showTree, setShowTree] = useState(true);
  const { data: branchPaths } = useConfigurationTree();

  const columns = useMemo<DataColumn<ConfigurationEntry>[]>(
    () => [
      {
        key: "path",
        labelKey: "configuration.columns.path",
        locked: true,
        width: "38%",
        truncate: true,
      },
      {
        key: "name",
        labelKey: "configuration.columns.name",
        width: "30%",
        truncate: true,
        getValue: (entry) => entryName(entry.path),
      },
      {
        key: "value",
        labelKey: "configuration.columns.value",
        truncate: true,
        getValue: maskedValue,
      },
      {
        key: "type",
        labelKey: "configuration.columns.type",
        defaultHidden: true,
      },
      {
        key: "description",
        labelKey: "configuration.columns.description",
        defaultHidden: true,
      },
      {
        key: "modifiedOn",
        labelKey: "configuration.columns.modifiedOn",
        defaultHidden: true,
        getValue: (entry) => formatDateTime(entry.modifiedOn),
      },
      {
        key: "modifiedBy",
        labelKey: "configuration.columns.modifiedBy",
        defaultHidden: true,
      },
      {
        key: "createdOn",
        labelKey: "configuration.columns.createdOn",
        defaultHidden: true,
        getValue: (entry) => formatDateTime(entry.createdOn),
      },
      {
        key: "createdBy",
        labelKey: "configuration.columns.createdBy",
        defaultHidden: true,
      },
    ],
    [],
  );

  const filters = useMemo<DataFilter[]>(
    () => [
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
    ],
    [],
  );

  const actions = useMemo<HeaderAction[]>(
    () => [
      { icon: <ArrowSync24Regular />, label: t("actionBar.refresh") },
      { icon: <Add24Regular />, label: t("actionBar.create") },
      {
        icon: <MoreVertical24Regular />,
        label: t("actionBar.more"),
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
    <ListPage
      header={{
        icon: <Wrench20Regular />,
        title: t("configuration.pageLabel"),
        actions,
      }}
    >
      <div className={styles.body}>
        <div className={styles.panelWrap}>
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
        </div>
        <div className={styles.cardWrap}>
          <DataTableCard
            title={(count) => t("configuration.listTitle", { count })}
            ariaLabel={t("configuration.pageLabel")}
            columns={columns}
            filters={filters}
            useListQuery={useConfigurations}
            getRowId={(entry) => entry.path}
            onRowClick={(entry) => openDetail(entry.path)}
            apiRef={tableApi}
          />
        </div>
      </div>
    </ListPage>
  );
}
