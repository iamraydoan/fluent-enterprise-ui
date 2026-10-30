import { usePeriodicInventorys } from "@/api";
import type { PeriodicInventoryRecord } from "@/api";
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

const COLUMNS: DataColumn<PeriodicInventoryRecord>[] = [
  { field: "name", headerName: "businessData.periodicInventory.columns.name", type: "link", locked: true, width: "22%" },
  { field: "description", headerName: "businessData.periodicInventory.columns.description", width: "28%" },
  { field: "facility", headerName: "businessData.periodicInventory.columns.facility", width: "20%" },
  { field: "state", headerName: "businessData.periodicInventory.columns.state", width: "15%" },
  { field: "scheduledOn", headerName: "businessData.periodicInventory.columns.scheduledOn", width: "15%" },
];

export function PeriodicInventoryListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/periodic-inventory/$name", openRoute);
  return (
    <DataListPage<PeriodicInventoryRecord>
      icon={<Box24Regular />}
      titleKey="businessData.periodicInventory.pageLabel"
      listTitleKey="businessData.periodicInventory.listTitle"
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={usePeriodicInventorys}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
