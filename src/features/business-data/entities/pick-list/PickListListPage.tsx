import { usePickLists } from "@/api";
import type { PickListRecord } from "@/api";
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

const COLUMNS: DataColumn<PickListRecord>[] = [
  {
    field: "name",
    headerName: "businessData.pickList.columns.name",
    type: "link",
    locked: true,
    width: "22%",
  },
  { field: "description", headerName: "businessData.pickList.columns.description", width: "28%" },
  { field: "state", headerName: "businessData.pickList.columns.state", width: "15%" },
  { field: "itemCount", headerName: "businessData.pickList.columns.itemCount", width: "15%" },
  { field: "createdOn", headerName: "businessData.pickList.columns.createdOn", width: "20%" },
];

export function PickListListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/pick-list/$name", openRoute);
  return (
    <DataListPage<PickListRecord>
      icon={<Box24Regular />}
      titleKey="businessData.pickList.pageLabel"
      listTitleKey="businessData.pickList.listTitle"
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={usePickLists}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
