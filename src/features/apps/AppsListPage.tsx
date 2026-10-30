import { useMemo } from "react";
import { AppType, RecordState, useApps } from "@/api";
import type { AppRecord } from "@/api";
import {
  createAction,
  DataTableCard,
  ListPage,
  RECORD_STATE_LABELS,
  refreshAction,
  searchFilter,
  stateFilter,
} from "@/components/common";
import type { DataColumn, DataFilter } from "@/components/common";
import { Window20Regular } from "@/components/icons";
import { useAppTranslation } from "@/i18n";

const APP_TYPE_OPTIONS = {
  [AppType.System]: { labelKey: "apps.types.system", color: "brand" },
  [AppType.UserDefined]: { labelKey: "apps.types.userDefined", color: "neutral" },
} as const;

const APP_STATE_OPTIONS = {
  [RecordState.Active]: { labelKey: RECORD_STATE_LABELS[RecordState.Active], color: "success" },
  [RecordState.Draft]: { labelKey: RECORD_STATE_LABELS[RecordState.Draft], color: "warning" },
  [RecordState.Terminated]: {
    labelKey: RECORD_STATE_LABELS[RecordState.Terminated],
    color: "danger",
  },
} as const;

export function AppsListPage() {
  const { t } = useAppTranslation();
  const columns = useMemo<DataColumn<AppRecord>[]>(
    () => [
      { field: "name", headerName: "apps.columns.app" },
      { field: "description", headerName: "apps.columns.description" },
      {
        field: "type",
        headerName: "apps.columns.type",
        enumOptions: APP_TYPE_OPTIONS,
      },
      {
        field: "state",
        headerName: "apps.columns.state",
        enumOptions: APP_STATE_OPTIONS,
      },
    ],
    [],
  );
  const filters = useMemo<DataFilter[]>(() => [stateFilter(), searchFilter()], []);
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
        columns={columns}
        filters={filters}
        useListQuery={useApps}
        getRowId={(row) => row.name}
      />
    </ListPage>
  );
}
