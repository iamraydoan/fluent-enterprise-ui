import { useBatches } from "@/api";
import type { BatchRecord } from "@/api";
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
import { useBatchDialogs } from "./useBatchDialogs";

const COLUMNS: DataColumn<BatchRecord>[] = [
  {
    field: "name",
    headerName: "businessData.batch.columns.name",
    type: "link",
    locked: true,
    width: "20%",
  },
  { field: "description", headerName: "businessData.batch.columns.description", width: "25%" },
  { field: "resource", headerName: "businessData.batch.columns.resource", width: "15%" },
  { field: "systemState", headerName: "businessData.batch.columns.systemState", width: "15%" },
  { field: "loadState", headerName: "businessData.batch.columns.loadState", width: "15%" },
  { field: "state", headerName: "businessData.batch.columns.state", width: "10%" },
];

export function BatchListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/batch/$name", openRoute);
  const { dialogs, openCreate } = useBatchDialogs();

  return (
    <>
      <DataListPage
        icon={<Box24Regular />}
        titleKey="businessData.batch.pageLabel"
        listTitleKey="businessData.batch.listTitle"
        actions={[
          { ...createAction, onClick: openCreate },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useBatches}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      {dialogs}
    </>
  );
}
