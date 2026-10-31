import { useShiftLogbooks } from "@/api";
import type { ShiftLogbookRecord } from "@/api";
import {
  DataListPage,
  exportAction,
  importAction,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { DocumentBulletList24Regular } from "@/components/icons";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

const COLUMNS: DataColumn<ShiftLogbookRecord>[] = [
  {
    field: "name",
    headerName: "businessData.shiftLogbook.columns.name",
    type: "link",
    locked: true,
    width: "30%",
  },
  { field: "area", headerName: "businessData.shiftLogbook.columns.area", width: "15%" },
  {
    field: "shiftDefinition",
    headerName: "businessData.shiftLogbook.columns.shiftDefinition",
    width: "20%",
  },
  { field: "shift", headerName: "businessData.shiftLogbook.columns.shift", width: "12%" },
  {
    field: "systemState",
    headerName: "businessData.shiftLogbook.columns.systemState",
    width: "10%",
  },
  {
    field: "state",
    headerName: "businessData.shiftLogbook.columns.state",
    width: "13%",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
  },
];

export function ShiftLogbookListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/shift-logbook/$name", openRoute);

  return (
    <DataListPage
      icon={<DocumentBulletList24Regular />}
      titleKey="businessData.shiftLogbook.pageLabel"
      listTitleKey="businessData.shiftLogbook.listTitle"
      actions={[refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      useListQuery={useShiftLogbooks}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
