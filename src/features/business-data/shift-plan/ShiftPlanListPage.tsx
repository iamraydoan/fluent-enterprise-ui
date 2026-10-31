import { useShiftPlans } from "@/api";
import type { ShiftPlanRecord } from "@/api";
import {
  defaultListFilters,
  DataListPage,
  exportAction,
  importAction,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Timer24Regular } from "@/components/icons";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

const COLUMNS: DataColumn<ShiftPlanRecord>[] = [
  {
    field: "name",
    headerName: "businessData.shiftPlan.columns.name",
    type: "link",
    locked: true,
    width: "30%",
  },
  {
    field: "description",
    headerName: "businessData.shiftPlan.columns.description",
    width: "30%",
  },
  { field: "type", headerName: "businessData.shiftPlan.columns.type", width: "15%" },
  { field: "calendar", headerName: "businessData.shiftPlan.columns.calendar", width: "12%" },
  {
    field: "state",
    headerName: "businessData.shiftPlan.columns.state",
    width: "13%",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
  },
];

export function ShiftPlanListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/shift-plan/$name", openRoute);

  return (
    <DataListPage
      filters={defaultListFilters}
      icon={<Timer24Regular />}
      titleKey="businessData.shiftPlan.pageLabel"
      listTitleKey="businessData.shiftPlan.listTitle"
      actions={[refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      useListQuery={useShiftPlans}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
