import { useParameters } from "@/api";
import type { ParameterRecord } from "@/api";
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

const COLUMNS: DataColumn<ParameterRecord>[] = [
  { field: "name", headerName: "businessData.parameter.columns.name", type: "link", locked: true, width: "22%" },
  { field: "description", headerName: "businessData.parameter.columns.description", width: "28%" },
  { field: "dataType", headerName: "businessData.parameter.columns.dataType", width: "18%" },
  { field: "value", headerName: "businessData.parameter.columns.value", width: "20%" },
  { field: "state", headerName: "businessData.parameter.columns.state", width: "12%" },
];

export function ParameterListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/parameter/$name", openRoute);
  return (
    <DataListPage<ParameterRecord>
      icon={<Box24Regular />}
      titleKey="businessData.parameter.pageLabel"
      listTitleKey="businessData.parameter.listTitle"
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useParameters}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
