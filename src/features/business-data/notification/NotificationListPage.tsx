import { useState } from "react";
import { useNotifications } from "@/api";
import type { NotificationRecord } from "@/api";
import {
  DataListPage,
  defaultListFilters,
  exportAction,
  importAction,
  refreshAction,
} from "@/components/common";
import type { DataColumn, HeaderAction } from "@/components/common";
import { Add24Regular, Box24Regular } from "@/components/icons";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { CreateNotificationDialog } from "./NotificationDialogs";

const COLUMNS: DataColumn<NotificationRecord>[] = [
  {
    field: "name",
    headerName: "businessData.notification.columns.name",
    type: "link",
    locked: true,
    width: "20%",
  },
  {
    field: "description",
    headerName: "businessData.notification.columns.description",
    width: "25%",
  },
  { field: "severity", headerName: "businessData.notification.columns.severity", width: "15%" },
  { field: "type", headerName: "businessData.notification.columns.type", width: "15%" },
  { field: "state", headerName: "businessData.notification.columns.state", width: "12%" },
  { field: "validTo", headerName: "businessData.notification.columns.validTo", width: "13%" },
];

const createNotificationAction: HeaderAction = {
  id: "create",
  icon: <Add24Regular />,
  labelKey: "businessData.notification.operations.create.title",
};

export function NotificationListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/notification/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <DataListPage<NotificationRecord>
        icon={<Box24Regular />}
        titleKey="businessData.notification.pageLabel"
        listTitleKey="businessData.notification.listTitle"
        actions={[
          { ...createNotificationAction, onClick: () => setCreateOpen(true) },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useNotifications}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      <CreateNotificationDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}
