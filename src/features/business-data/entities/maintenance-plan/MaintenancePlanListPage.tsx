import { useState } from "react";
import { useMaintenancePlans } from "@/api";
import type { MaintenancePlanRecord } from "@/api";
import {
  RECORD_STATE_COLUMN_OPTIONS,
  DataListPage,
  createAction,
  defaultListFilters,
  exportAction,
  importAction,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Wrench24Regular } from "@/components/icons";
import type { ListQueryParams } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { MaintenancePlanDialog } from "./MaintenancePlanDialog";
import { MODE_CREATE } from "./wizardMode";


const COLUMNS: DataColumn<MaintenancePlanRecord>[] = [
  { field: "name", headerName: "businessData.maintenancePlan.columns.name", type: "link", locked: true, width: "30%" },
  { field: "description", headerName: "businessData.maintenancePlan.columns.description", width: "30%" },
  { field: "type", headerName: "businessData.maintenancePlan.columns.type", width: "15%" },
  { field: "scope", headerName: "businessData.maintenancePlan.columns.scope", width: "15%" },
  { field: "state", headerName: "businessData.maintenancePlan.columns.state", type: "enum", enumOptions: RECORD_STATE_COLUMN_OPTIONS, width: "10%" },
];

function useMaintenancePlanListQuery(params: ListQueryParams) {
  return useMaintenancePlans(params);
}

export function MaintenancePlanListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/maintenance-plan/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);
  return (
    <>
    <DataListPage
      icon={<Wrench24Regular />}
      titleKey={"businessData.maintenancePlan.pageLabel"}
      listTitleKey={"businessData.maintenancePlan.listTitle"}
      actions={[
        { ...createAction, onClick: () => setCreateOpen(true) },
        refreshAction,
        importAction,
        exportAction,
      ]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useMaintenancePlanListQuery}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
    {createOpen && <MaintenancePlanDialog mode={MODE_CREATE} onClose={() => setCreateOpen(false)} />}
    </>
  );
}
