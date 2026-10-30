import { useState } from "react";
import { useProductGroups } from "@/api";
import type { ProductGroupRecord } from "@/api";
import {
  DataListPage,
  defaultListFilters,
  exportAction,
  importAction,
  refreshAction,
} from "@/components/common";
import type { DataColumn, HeaderAction } from "@/components/common";
import { Add24Regular, Box24Regular } from "@/components/icons";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { CreateProductGroupDialog } from "./ProductGroupOperations";

const COLUMNS: DataColumn<ProductGroupRecord>[] = [
  {
    field: "name",
    headerName: "businessData.productGroup.columns.name",
    type: "link",
    locked: true,
    width: "26%",
  },
  {
    field: "description",
    headerName: "businessData.productGroup.columns.description",
    width: "34%",
  },
  { field: "state", headerName: "businessData.productGroup.columns.state", width: "20%" },
  {
    field: "productCount",
    headerName: "businessData.productGroup.columns.productCount",
    width: "20%",
  },
];

const createProductGroupAction: HeaderAction = {
  id: "create",
  icon: <Add24Regular />,
  labelKey: "businessData.productGroup.operations.create.title",
};

export function ProductGroupListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/product-group/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <DataListPage<ProductGroupRecord>
        icon={<Box24Regular />}
        titleKey="businessData.productGroup.pageLabel"
        listTitleKey="businessData.productGroup.listTitle"
        actions={[
          { ...createProductGroupAction, onClick: () => setCreateOpen(true) },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useProductGroups}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      <CreateProductGroupDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}
