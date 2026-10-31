import { useTransferOrders } from "@/api";
import type { TransferOrderRecord } from "@/api";
import {
  defaultListFilters,
  DataListPage,
  exportAction,
  importAction,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { ArrowExportUp24Regular } from "@/components/icons";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

const COLUMNS: DataColumn<TransferOrderRecord>[] = [
  {
    field: "name",
    headerName: "businessData.transferOrder.columns.name",
    type: "link",
    locked: true,
    width: "16%",
  },
  {
    field: "description",
    headerName: "businessData.transferOrder.columns.description",
    width: "24%",
  },
  {
    field: "sourceLocation",
    headerName: "businessData.transferOrder.columns.sourceLocation",
    width: "16%",
  },
  {
    field: "destinationLocation",
    headerName: "businessData.transferOrder.columns.destinationLocation",
    width: "16%",
  },
  {
    field: "orderState",
    headerName: "businessData.transferOrder.columns.orderState",
    width: "14%",
  },
  {
    field: "state",
    headerName: "businessData.transferOrder.columns.state",
    width: "14%",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
  },
];

export function TransferOrderListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/transfer-order/$name", openRoute);

  return (
    <DataListPage
      filters={defaultListFilters}
      icon={<ArrowExportUp24Regular />}
      titleKey="businessData.transferOrder.pageLabel"
      listTitleKey="businessData.transferOrder.listTitle"
      actions={[refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      useListQuery={useTransferOrders}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
