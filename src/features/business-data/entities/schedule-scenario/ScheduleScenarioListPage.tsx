import { useState } from "react";
import { useScheduleScenarios } from "@/api";
import type { ScheduleScenarioRecord } from "@/api";
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
import type { ListQueryParams, ListQueryResult } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { ScheduleScenarioFormDialog } from "./dialogs/ScheduleScenarioFormDialog";

const COLUMNS: DataColumn<ScheduleScenarioRecord>[] = [
  {
    field: "name",
    headerName: "businessData.scheduleScenario.columns.name",
    type: "link",
    locked: true,
    width: "35%",
  },
  {
    field: "description",
    headerName: "businessData.scheduleScenario.columns.description",
    width: "30%",
  },
  {
    field: "schedule",
    headerName: "businessData.scheduleScenario.columns.schedule",
    width: "20%",
  },
  {
    field: "state",
    headerName: "businessData.scheduleScenario.columns.state",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
    width: "15%",
  },
];

function useScheduleScenarioList(params: ListQueryParams): ListQueryResult<ScheduleScenarioRecord> {
  const query = useScheduleScenarios({
    q: params.filters?.q,
    state: params.filters?.state,
  });
  return {
    data: query.data ? { data: query.data, meta: { total: query.data.length } } : undefined,
    isLoading: query.isLoading,
  };
}

export function ScheduleScenarioListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/schedule-scenario/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <DataListPage
        icon={<Wrench24Regular />}
        titleKey="businessData.scheduleScenario.pageLabel"
        listTitleKey="businessData.scheduleScenario.listTitle"
        actions={[
          { ...createAction, onClick: () => setCreateOpen(true) },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useScheduleScenarioList}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      <ScheduleScenarioFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </>
  );
}
