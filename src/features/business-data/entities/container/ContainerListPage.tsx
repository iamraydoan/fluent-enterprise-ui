import { useContainers } from "@/api";
import type { ContainerRecord } from "@/api";
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
import { useContainerDialogs } from "./useContainerDialogs";

const COLUMNS: DataColumn<ContainerRecord>[] = [
  {
    field: "name",
    headerName: "businessData.container.columns.name",
    type: "link",
    locked: true,
    width: "25%",
  },
  { field: "description", headerName: "businessData.container.columns.description", width: "30%" },
  { field: "type", headerName: "businessData.container.columns.type", width: "15%" },
  { field: "systemState", headerName: "businessData.container.columns.systemState", width: "15%" },
  { field: "state", headerName: "businessData.container.columns.state", width: "15%" },
];

export function ContainerListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/container/$name", openRoute);
  const { dialogs, openCreate } = useContainerDialogs();
  return (
    <>
      <DataListPage
        icon={<Box24Regular />}
        titleKey="businessData.container.pageLabel"
        listTitleKey="businessData.container.listTitle"
        actions={[
          { ...createAction, onClick: openCreate },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useContainers}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      {dialogs}
    </>
  );
}
