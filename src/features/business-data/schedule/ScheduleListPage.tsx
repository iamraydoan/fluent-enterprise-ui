import { useState } from "react";
import { useSchedules } from "@/api";
import type { ScheduleRecord } from "@/api";
import {
  createAction,
  DataListPage,
  defaultListFilters,
  exportAction,
  importAction,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Wrench24Regular } from "@/components/icons";
import { useAppTranslation } from "@/i18n";
import type { ListQueryParams, ListQueryResult } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { ScheduleFormDialog } from "./dialogs/ScheduleFormDialog";

const COLUMNS: DataColumn<ScheduleRecord>[] = [
  {
    field: "name",
    headerName: "businessData.schedule.columns.name",
    type: "link",
    locked: true,
    width: "40%",
  },
  {
    field: "description",
    headerName: "businessData.schedule.columns.description",
    width: "45%",
  },
  {
    field: "state",
    headerName: "businessData.schedule.columns.state",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
    width: "15%",
  },
];

function useScheduleList(params: ListQueryParams): ListQueryResult<ScheduleRecord> {
  const query = useSchedules({
    q: params.filters?.q,
    state: params.filters?.state,
  });
  return {
    data: query.data ? { data: query.data, meta: { total: query.data.length } } : undefined,
    isLoading: query.isLoading,
  };
}

export function ScheduleListPage() {
  const { t } = useAppTranslation();
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/schedule/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <DataListPage
        icon={<Wrench24Regular />}
        titleKey="businessData.schedule.pageLabel"
        listTitleKey="businessData.schedule.listTitle"
        actions={[
          { ...createAction, onClick: () => setCreateOpen(true) },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useScheduleList}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      <ScheduleFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("businessData.schedule.dialogs.form.createTitle")}
        submitLabel={t("actionBar.create")}
      />
    </>
  );
}
