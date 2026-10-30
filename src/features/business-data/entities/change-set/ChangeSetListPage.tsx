import { useChangeSets } from "@/api";
import type { ChangeSetRecord } from "@/api";
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
import { useChangeSetDialogs } from "./useChangeSetDialogs";

const COLUMNS: DataColumn<ChangeSetRecord>[] = [
  { field: "name", headerName: "businessData.changeSet.columns.name", type: "link", locked: true, width: "25%" },
  { field: "description", headerName: "businessData.changeSet.columns.description", width: "30%" },
  { field: "type", headerName: "businessData.changeSet.columns.type", width: "15%" },
  { field: "state", headerName: "businessData.changeSet.columns.state", width: "15%" },
  { field: "systemState", headerName: "businessData.changeSet.columns.systemState", width: "15%" },
];

export function ChangeSetListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/change-set/$name", openRoute);
  const { dialogs, openCreate } = useChangeSetDialogs();
  return (
    <>
    <DataListPage
      icon={<Box24Regular />}
      titleKey="businessData.changeSet.pageLabel"
      listTitleKey="businessData.changeSet.listTitle"
      actions={[{ ...createAction, onClick: openCreate }, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useChangeSets}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
    {dialogs}
    </>
  );
}
