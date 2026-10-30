import { useBoms } from "@/api";
import type { BomRecord } from "@/api";
import {
  DataListPage,
  createAction,
  defaultListFilters,
  exportAction,
  importAction,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { useBomDialogs } from "./useBomDialogs";

const COLUMNS: DataColumn<BomRecord>[] = [
  {
    field: "name",
    headerName: "businessData.bom.columns.name",
    type: "link",
    locked: true,
    width: "25%",
  },
  { field: "description", headerName: "businessData.bom.columns.description", width: "30%" },
  { field: "product", headerName: "businessData.bom.columns.product", width: "20%" },
  { field: "version", headerName: "businessData.bom.columns.version", width: "10%" },
  { field: "state", headerName: "businessData.bom.columns.state", width: "15%" },
];

export function BomListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/bom/$name", openRoute);
  const { dialogs, openCreate } = useBomDialogs();

  return (
    <>
      <DataListPage
        icon={<Box24Regular />}
        titleKey="businessData.bom.pageLabel"
        listTitleKey="businessData.bom.listTitle"
        actions={[
          { ...createAction, onClick: openCreate },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useBoms}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      {dialogs}
    </>
  );
}
