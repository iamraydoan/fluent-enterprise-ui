import { useChecklists } from "@/api";
import type { ChecklistRecord } from "@/api";
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

const COLUMNS: DataColumn<ChecklistRecord>[] = [
  { field: "name", headerName: "businessData.checklist.columns.name", type: "link", locked: true, width: "30%" },
  { field: "description", headerName: "businessData.checklist.columns.description", width: "30%" },
  { field: "scope", headerName: "businessData.checklist.columns.scope", width: "15%" },
  { field: "executionMode", headerName: "businessData.checklist.columns.executionMode", width: "15%" },
  { field: "state", headerName: "businessData.checklist.columns.state", width: "10%" },
];

export function ChecklistListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/checklist/$name", openRoute);
  return (
    <DataListPage
      icon={<Box24Regular />}
      titleKey="businessData.checklist.pageLabel"
      listTitleKey="businessData.checklist.listTitle"
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useChecklists}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
