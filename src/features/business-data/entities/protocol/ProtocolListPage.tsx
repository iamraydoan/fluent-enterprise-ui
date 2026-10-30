import { useProtocols } from "@/api";
import type { ProtocolRecord } from "@/api";
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

const COLUMNS: DataColumn<ProtocolRecord>[] = [
  {
    field: "name",
    headerName: "businessData.protocol.columns.name",
    type: "link",
    locked: true,
    width: "24%",
  },
  { field: "description", headerName: "businessData.protocol.columns.description", width: "30%" },
  { field: "type", headerName: "businessData.protocol.columns.type", width: "20%" },
  { field: "state", headerName: "businessData.protocol.columns.state", width: "13%" },
  { field: "version", headerName: "businessData.protocol.columns.version", width: "13%" },
];

export function ProtocolListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/protocol/$name", openRoute);
  return (
    <DataListPage<ProtocolRecord>
      icon={<Box24Regular />}
      titleKey="businessData.protocol.pageLabel"
      listTitleKey="businessData.protocol.listTitle"
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useProtocols}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
