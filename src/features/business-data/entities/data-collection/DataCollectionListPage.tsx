import { useDataCollections } from "@/api";
import type { DataCollectionRecord } from "@/api";
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
import { useDataCollectionDialogs } from "./useDataCollectionDialogs";

const COLUMNS: DataColumn<DataCollectionRecord>[] = [
  {
    field: "name",
    headerName: "businessData.dataCollection.columns.name",
    type: "link",
    locked: true,
    width: "30%",
  },
  {
    field: "description",
    headerName: "businessData.dataCollection.columns.description",
    width: "30%",
  },
  { field: "scope", headerName: "businessData.dataCollection.columns.scope", width: "20%" },
  { field: "state", headerName: "businessData.dataCollection.columns.state", width: "20%" },
];

export function DataCollectionListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/data-collection/$name", openRoute);
  const { dialogs, openCreate } = useDataCollectionDialogs();
  return (
    <>
      <DataListPage
        icon={<Box24Regular />}
        titleKey="businessData.dataCollection.pageLabel"
        listTitleKey="businessData.dataCollection.listTitle"
        actions={[
          { ...createAction, onClick: openCreate },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useDataCollections}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      {dialogs}
    </>
  );
}
