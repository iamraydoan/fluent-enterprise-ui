import { useBinConverters } from "@/api";
import type { BinConverterRecord } from "@/api";
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
import { useBinConverterDialogs } from "./useBinConverterDialogs";

const COLUMNS: DataColumn<BinConverterRecord>[] = [
  { field: "name", headerName: "businessData.binConverter.columns.name", type: "link", locked: true, width: "25%" },
  { field: "description", headerName: "businessData.binConverter.columns.description", width: "30%" },
  { field: "converterType", headerName: "businessData.binConverter.columns.converterType", width: "20%" },
  { field: "binType", headerName: "businessData.binConverter.columns.binType", width: "15%" },
  { field: "state", headerName: "businessData.binConverter.columns.state", width: "10%" },
];

export function BinConverterListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/bin-converter/$name", openRoute);
  const { dialogs, openCreate } = useBinConverterDialogs();
  return (
    <>
    <DataListPage
      icon={<Box24Regular />}
      titleKey="businessData.binConverter.pageLabel"
      listTitleKey="businessData.binConverter.listTitle"
      actions={[{ ...createAction, onClick: openCreate }, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useBinConverters}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
    {dialogs}
    </>
  );
}
