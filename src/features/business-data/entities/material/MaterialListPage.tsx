import { useMaterials } from "@/api";
import type { MaterialRecord } from "@/api";
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

const COLUMNS: DataColumn<MaterialRecord>[] = [
  {
    field: "name",
    headerName: "businessData.material.columns.name",
    type: "link",
    locked: true,
    width: "20%",
  },
  { field: "description", headerName: "businessData.material.columns.description", width: "20%" },
  { field: "type", headerName: "businessData.material.columns.type", width: "12%" },
  { field: "product", headerName: "businessData.material.columns.product", width: "15%" },
  { field: "step", headerName: "businessData.material.columns.step", width: "13%" },
  {
    field: "primaryQuantity",
    headerName: "businessData.material.columns.primaryQuantity",
    width: "12%",
  },
  { field: "state", headerName: "businessData.material.columns.state", width: "8%", type: "text" },
];

export function MaterialListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/material/$name", openRoute);
  return (
    <DataListPage<MaterialRecord>
      icon={<Box24Regular />}
      titleKey="businessData.material.pageLabel"
      listTitleKey="businessData.material.listTitle"
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useMaterials}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
