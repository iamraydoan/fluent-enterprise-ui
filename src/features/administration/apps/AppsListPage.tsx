import { AppType, useApps } from "@/api";
import type { AppRecord } from "@/api";
import {
  createAction,
  DataListPage,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Window20Regular } from "@/components/icons";

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
  return (
    <DataListPage
      icon={<Window20Regular />}
      titleKey="apps.pageLabel"
      listTitleKey="apps.listTitle"
      actions={[createAction, refreshAction]}
      columns={COLUMNS}
      useListQuery={useApps}
      getRowId={(row) => row.name}
    />
  );
}
