import { useState } from "react";
import { useMaintenanceActivityOrders } from "@/api";
import type { MaintenanceActivityOrderRecord } from "@/api";
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
import type { TranslationKey } from "@/i18n";
import type { ListQueryParams } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { RequestMaintenanceActivityOrderDialog } from "./RequestMaintenanceActivityOrderDialog";

const COLUMNS: DataColumn<MaintenanceActivityOrderRecord>[] = [
  {
    field: "name",
    headerName: "businessData.maintenanceActivityOrder.columns.name",
    type: "link",
    locked: true,
    width: "15%",
  },
  {
    field: "description",
    headerName: "businessData.maintenanceActivityOrder.columns.description",
    width: "25%",
  },
  { field: "type", headerName: "businessData.maintenanceActivityOrder.columns.type", width: "15%" },
  {
    field: "executionState",
    headerName: "businessData.maintenanceActivityOrder.columns.executionState",
    width: "20%",
  },
  {
    field: "scheduleType",
    headerName: "businessData.maintenanceActivityOrder.columns.scheduleType",
    width: "15%",
  },
  {
    field: "state",
    headerName: "businessData.maintenanceActivityOrder.columns.state",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
    width: "10%",
  },
];

function useMaintenanceActivityOrderListQuery(params: ListQueryParams) {
  return useMaintenanceActivityOrders(params);
}

export function MaintenanceActivityOrderListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation(
    "/business-data/maintenance-activity-order/$name",
    openRoute,
  );
  const [requestOpen, setRequestOpen] = useState(false);
  const requestLabelKey: TranslationKey = "businessData.maintenanceActivityOrder.request.request";
  return (
    <>
      <DataListPage
        icon={<Wrench24Regular />}
        titleKey={"businessData.maintenanceActivityOrder.pageLabel"}
        listTitleKey={"businessData.maintenanceActivityOrder.listTitle"}
        actions={[
          { ...createAction, labelKey: requestLabelKey, onClick: () => setRequestOpen(true) },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useMaintenanceActivityOrderListQuery}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      {requestOpen && (
        <RequestMaintenanceActivityOrderDialog onClose={() => setRequestOpen(false)} />
      )}
    </>
  );
}
