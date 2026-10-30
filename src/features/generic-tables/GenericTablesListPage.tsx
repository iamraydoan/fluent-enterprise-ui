import { useGenericTables } from "@/api";
import type { GenericTableRecord } from "@/api";
import {
  createAction,
  DataListPage,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Table24Regular } from "@/components/icons";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

const COLUMNS: DataColumn<GenericTableRecord>[] = [
  {
    field: "name",
    headerName: "genericTables.columns.name",
    type: "link",
    locked: true,
    width: "25%",
  },
  { field: "description", headerName: "genericTables.columns.description", width: "45%" },
  {
    field: "isSystem",
    headerName: "genericTables.columns.system",
    type: "boolean",
    width: "15%",
    align: "center",
  },
  {
    field: "state",
    headerName: "genericTables.columns.state",
    width: "15%",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
  },
];

export function GenericTablesListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/administration/tables/$name", openRoute);
  return (
    <DataListPage
      icon={<Table24Regular />}
      titleKey="genericTables.pageLabel"
      listTitleKey="genericTables.listTitle"
      actions={[createAction, refreshAction]}
      columns={COLUMNS}
      useListQuery={useGenericTables}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
