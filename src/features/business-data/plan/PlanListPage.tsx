import { usePlans } from "@/api";
import type { PlanRecord } from "@/api";
import {
  createAction,
  DataListPage,
  defaultListFilters,
  exportAction,
  importAction,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

const COLUMNS: DataColumn<PlanRecord>[] = [
  {
    field: "name",
    headerName: "businessData.plan.columns.name",
    type: "link",
    locked: true,
    width: "24%",
  },
  { field: "description", headerName: "businessData.plan.columns.description", width: "30%" },
  { field: "type", headerName: "businessData.plan.columns.type", width: "20%" },
  { field: "state", headerName: "businessData.plan.columns.state", width: "13%" },
  { field: "startDate", headerName: "businessData.plan.columns.startDate", width: "13%" },
];

export function PlanListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/plan/$name", openRoute);
  return (
    <DataListPage<PlanRecord>
      icon={<Box24Regular />}
      titleKey="businessData.plan.pageLabel"
      listTitleKey="businessData.plan.listTitle"
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={usePlans}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
