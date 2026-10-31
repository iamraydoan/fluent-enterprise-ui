import { useState } from "react";
import { useGenericTables } from "@/api";
import type { GenericTableKind, GenericTableRecord } from "@/api";
import {
  createAction,
  DataTableCard,
  defaultListFilters,
  ListPage,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
  SidePanel,
  SidebarNavItem,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Table24Regular } from "@/components/icons";
import { makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import type { ListQueryParams } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

const useHubStyles = makeStyles({
  body: { display: "flex", columnGap: "10px", flexGrow: 1, minHeight: 0 },
  side: { display: "flex", flexDirection: "column", minHeight: 0 },
  main: { flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column" },
});

const TABLE_KINDS: Array<{
  kind: GenericTableKind;
  labelKey: TranslationKey;
  descKey: TranslationKey;
}> = [
  { kind: "generic", labelKey: "tables.kinds.generic", descKey: "tables.kinds.genericDesc" },
  { kind: "lookup", labelKey: "tables.kinds.lookup", descKey: "tables.kinds.lookupDesc" },
  { kind: "smart", labelKey: "tables.kinds.smart", descKey: "tables.kinds.smartDesc" },
];

const COLUMNS: DataColumn<GenericTableRecord>[] = [
  {
    field: "name",
    headerName: "genericTables.columns.name",
    type: "link",
    locked: true,
    width: "30%",
  },
  { field: "description", headerName: "genericTables.columns.description", width: "40%" },
  {
    field: "isSystem",
    headerName: "genericTables.columns.system",
    type: "boolean",
    width: "15%",
    align: "center",
  },
  {
    field: "state",
    headerName: "genericTables.columns.state",
    width: "15%",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
  },
];

function TablesGrid({ kind }: { kind: GenericTableKind }) {
  const { t } = useAppTranslation();
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/administration/tables/$name", openRoute);
  const labelKey =
    TABLE_KINDS.find((entry) => entry.kind === kind)?.labelKey ?? "tables.kinds.generic";

  function useKindTables(params: ListQueryParams) {
    return useGenericTables({ ...params, kind });
  }

  return (
    <DataTableCard
      title={(count) => t("tables.gridTitle", { kind: t(labelKey), count })}
      ariaLabel={t(labelKey)}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useKindTables}
      getRowId={(row) => `${row.kind}:${row.name}`}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}

export function TablesHubPage() {
  const { t } = useAppTranslation();
  const styles = useHubStyles();
  const [kind, setKind] = useState<GenericTableKind>("generic");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ListPage
      header={{
        icon: <Table24Regular />,
        title: t("tables.pageLabel"),
        actions: [createAction, refreshAction],
      }}
    >
      <div className={styles.body}>
        <div className={styles.side}>
          <SidePanel
            title={t("tables.typesTitle")}
            collapsed={collapsed}
            onToggle={() => setCollapsed((value) => !value)}
          >
            {TABLE_KINDS.map((entry) => (
              <SidebarNavItem
                key={entry.kind}
                label={t(entry.labelKey)}
                description={t(entry.descKey)}
                active={kind === entry.kind}
                onClick={() => setKind(entry.kind)}
              />
            ))}
          </SidePanel>
        </div>
        <div className={styles.main}>
          <TablesGrid key={kind} kind={kind} />
        </div>
      </div>
    </ListPage>
  );
}
