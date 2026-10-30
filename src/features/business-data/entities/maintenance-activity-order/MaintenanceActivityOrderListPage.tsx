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

const tk = (key: string) => key as TranslationKey;

const COLUMNS: DataColumn<MaintenanceActivityOrderRecord>[] = [
  { field: "name", headerName: tk("businessData.maintenanceActivityOrder.columns.name"), type: "link", locked: true, width: "15%" },
  { field: "description", headerName: tk("businessData.maintenanceActivityOrder.columns.description"), width: "25%" },
  { field: "type", headerName: tk("businessData.maintenanceActivityOrder.columns.type"), width: "15%" },
  { field: "executionState", headerName: tk("businessData.maintenanceActivityOrder.columns.executionState"), width: "20%" },
  { field: "scheduleType", headerName: tk("businessData.maintenanceActivityOrder.columns.scheduleType"), width: "15%" },
  { field: "state", headerName: tk("businessData.maintenanceActivityOrder.columns.state"), type: "enum", enumOptions: RECORD_STATE_COLUMN_OPTIONS, width: "10%" },
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
  return (
    <DataListPage
      icon={<Wrench24Regular />}
      titleKey={tk("businessData.maintenanceActivityOrder.pageLabel")}
      listTitleKey={tk("businessData.maintenanceActivityOrder.listTitle")}
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useMaintenanceActivityOrderListQuery}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
