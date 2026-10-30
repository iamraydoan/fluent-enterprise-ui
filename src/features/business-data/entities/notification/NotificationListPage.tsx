import { useNotifications } from "@/api";
import type { NotificationRecord } from "@/api";
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

const COLUMNS: DataColumn<NotificationRecord>[] = [
  { field: "name", headerName: "businessData.notification.columns.name", type: "link", locked: true, width: "20%" },
  { field: "description", headerName: "businessData.notification.columns.description", width: "25%" },
  { field: "severity", headerName: "businessData.notification.columns.severity", width: "15%" },
  { field: "type", headerName: "businessData.notification.columns.type", width: "15%" },
  { field: "state", headerName: "businessData.notification.columns.state", width: "12%" },
  { field: "validTo", headerName: "businessData.notification.columns.validTo", width: "13%" },
];

export function NotificationListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/notification/$name", openRoute);
  return (
    <DataListPage<NotificationRecord>
      icon={<Box24Regular />}
      titleKey="businessData.notification.pageLabel"
      listTitleKey="businessData.notification.listTitle"
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useNotifications}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
