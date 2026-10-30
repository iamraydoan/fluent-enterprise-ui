import { useProducts } from "@/api";
import type { ProductRecord } from "@/api";
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

const COLUMNS: DataColumn<ProductRecord>[] = [
  {
    field: "name",
    headerName: "businessData.product.columns.name",
    type: "link",
    locked: true,
    width: "22%",
  },
  { field: "description", headerName: "businessData.product.columns.description", width: "28%" },
  { field: "productType", headerName: "businessData.product.columns.productType", width: "20%" },
  { field: "state", headerName: "businessData.product.columns.state", width: "15%" },
  { field: "isActive", headerName: "businessData.product.columns.isActive", width: "15%" },
];

export function ProductListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/product/$name", openRoute);
  return (
    <DataListPage<ProductRecord>
      icon={<Box24Regular />}
      titleKey="businessData.product.pageLabel"
      listTitleKey="businessData.product.listTitle"
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useProducts}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
