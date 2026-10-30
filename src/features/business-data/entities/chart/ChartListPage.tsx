import { useCharts } from "@/api";
import type { ChartRecord } from "@/api";
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

const COLUMNS: DataColumn<ChartRecord>[] = [
  { field: "name", headerName: "businessData.chart.columns.name", type: "link", locked: true, width: "30%" },
  { field: "description", headerName: "businessData.chart.columns.description", width: "30%" },
  { field: "chartType", headerName: "businessData.chart.columns.chartType", width: "25%" },
  { field: "state", headerName: "businessData.chart.columns.state", width: "15%" },
];

export function ChartListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/chart/$name", openRoute);
  return (
    <DataListPage
      icon={<Box24Regular />}
      titleKey="businessData.chart.pageLabel"
      listTitleKey="businessData.chart.listTitle"
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useCharts}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
