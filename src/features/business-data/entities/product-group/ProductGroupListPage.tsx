import { useProductGroups } from "@/api";
import type { ProductGroupRecord } from "@/api";
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

const COLUMNS: DataColumn<ProductGroupRecord>[] = [
  { field: "name", headerName: "businessData.productGroup.columns.name", type: "link", locked: true, width: "26%" },
  { field: "description", headerName: "businessData.productGroup.columns.description", width: "34%" },
  { field: "state", headerName: "businessData.productGroup.columns.state", width: "20%" },
  { field: "productCount", headerName: "businessData.productGroup.columns.productCount", width: "20%" },
];

export function ProductGroupListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/product-group/$name", openRoute);
  return (
    <DataListPage<ProductGroupRecord>
      icon={<Box24Regular />}
      titleKey="businessData.productGroup.pageLabel"
      listTitleKey="businessData.productGroup.listTitle"
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useProductGroups}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
