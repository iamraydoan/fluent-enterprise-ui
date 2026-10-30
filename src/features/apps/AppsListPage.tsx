import { AppType, useApps } from "@/api";
import type { AppRecord } from "@/api";
import {
  createAction,
  DataTableCard,
  defaultListFilters,
  ListPage,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Window20Regular } from "@/components/icons";
import { useAppTranslation } from "@/i18n";

const APP_TYPE_OPTIONS = {
  [AppType.System]: { labelKey: "apps.types.system", color: "brand" },
  [AppType.UserDefined]: { labelKey: "apps.types.userDefined", color: "neutral" },
} as const;

const COLUMNS: DataColumn<AppRecord>[] = [
  { field: "name", headerName: "apps.columns.app" },
  { field: "description", headerName: "apps.columns.description" },
  { field: "type", headerName: "apps.columns.type", type: "enum", enumOptions: APP_TYPE_OPTIONS },
  {
    field: "state",
    headerName: "apps.columns.state",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
  },
];

export function AppsListPage() {
  const { t } = useAppTranslation();
  return (
    <ListPage
      header={{
        icon: <Window20Regular />,
        title: t("apps.pageLabel"),
        actions: [createAction, refreshAction],
      }}
    >
      <DataTableCard
        title={(count) => t("apps.listTitle", { count })}
        ariaLabel={t("apps.pageLabel")}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useApps}
        getRowId={(row) => row.name}
      />
    </ListPage>
  );
}
