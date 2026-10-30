import { usePackages } from "@/api";
import type { PackageRecord } from "@/api";
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

const COLUMNS: DataColumn<PackageRecord>[] = [
  { field: "name", headerName: "businessData.package.columns.name", type: "link", locked: true, width: "20%" },
  { field: "description", headerName: "businessData.package.columns.description", width: "25%" },
  { field: "product", headerName: "businessData.package.columns.product", width: "20%" },
  { field: "level", headerName: "businessData.package.columns.level", width: "12%" },
  { field: "state", headerName: "businessData.package.columns.state", width: "11%" },
  { field: "packedQuantity", headerName: "businessData.package.columns.packedQuantity", width: "12%" },
];

export function PackageListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/package/$name", openRoute);
  return (
    <DataListPage<PackageRecord>
      icon={<Box24Regular />}
      titleKey="businessData.package.pageLabel"
      listTitleKey="businessData.package.listTitle"
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={usePackages}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
