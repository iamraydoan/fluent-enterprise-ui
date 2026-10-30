import { useDataCollectionLimitSets } from "@/api";
import type { DataCollectionLimitSetRecord } from "@/api";
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

const COLUMNS: DataColumn<DataCollectionLimitSetRecord>[] = [
  { field: "name", headerName: "businessData.dataCollectionLimitSet.columns.name", type: "link", locked: true, width: "35%" },
  { field: "description", headerName: "businessData.dataCollectionLimitSet.columns.description", width: "30%" },
  { field: "dataCollection", headerName: "businessData.dataCollectionLimitSet.columns.dataCollection", width: "20%" },
  { field: "state", headerName: "businessData.dataCollectionLimitSet.columns.state", width: "15%" },
];

export function DataCollectionLimitSetListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/data-collection-limit-set/$name", openRoute);
  return (
    <DataListPage
      icon={<Box24Regular />}
      titleKey="businessData.dataCollectionLimitSet.pageLabel"
      listTitleKey="businessData.dataCollectionLimitSet.listTitle"
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useDataCollectionLimitSets}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
