import { useMaterialTransfers } from "@/api";
import type { MaterialTransferRecord } from "@/api";
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

const COLUMNS: DataColumn<MaterialTransferRecord>[] = [
  { field: "name", headerName: "businessData.materialTransfer.columns.name", type: "link", locked: true, width: "15%" },
  { field: "type", headerName: "businessData.materialTransfer.columns.type", width: "15%" },
  { field: "state", headerName: "businessData.materialTransfer.columns.state", width: "12%" },
  { field: "material", headerName: "businessData.materialTransfer.columns.material", width: "15%" },
  { field: "quantity", headerName: "businessData.materialTransfer.columns.quantity", width: "12%" },
  { field: "fromFacility", headerName: "businessData.materialTransfer.columns.fromFacility", width: "15%" },
  { field: "toFacility", headerName: "businessData.materialTransfer.columns.toFacility", width: "16%" },
];

export function MaterialTransferListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/material-transfer/$name", openRoute);
  return (
    <DataListPage<MaterialTransferRecord>
      icon={<Box24Regular />}
      titleKey="businessData.materialTransfer.pageLabel"
      listTitleKey="businessData.materialTransfer.listTitle"
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useMaterialTransfers}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
