import { useProductionOrders } from "@/api";
import type { ProductionOrderRecord } from "@/api";
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

const COLUMNS: DataColumn<ProductionOrderRecord>[] = [
  {
    field: "name",
    headerName: "businessData.productionOrder.columns.name",
    type: "link",
    locked: true,
    width: "20%",
  },
  {
    field: "description",
    headerName: "businessData.productionOrder.columns.description",
    width: "22%",
  },
  { field: "product", headerName: "businessData.productionOrder.columns.product", width: "18%" },
  { field: "quantity", headerName: "businessData.productionOrder.columns.quantity", width: "14%" },
  { field: "state", headerName: "businessData.productionOrder.columns.state", width: "13%" },
  { field: "priority", headerName: "businessData.productionOrder.columns.priority", width: "13%" },
];

export function ProductionOrderListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/production-order/$name", openRoute);
  return (
    <DataListPage<ProductionOrderRecord>
      icon={<Box24Regular />}
      titleKey="businessData.productionOrder.pageLabel"
      listTitleKey="businessData.productionOrder.listTitle"
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useProductionOrders}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
