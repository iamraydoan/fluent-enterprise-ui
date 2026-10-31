import { useTasks } from "@/api";
import type { TaskRecord } from "@/api";
import {
  defaultListFilters,
  DataListPage,
  exportAction,
  importAction,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Checkmark20Filled } from "@/components/icons";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

const COLUMNS: DataColumn<TaskRecord>[] = [
  {
    field: "name",
    headerName: "businessData.task.columns.name",
    type: "link",
    locked: true,
    width: "28%",
  },
  {
    field: "description",
    headerName: "businessData.task.columns.description",
    width: "28%",
  },
  {
    field: "owner",
    headerName: "businessData.task.columns.owner",
    width: "16%",
  },
  {
    field: "taskState",
    headerName: "businessData.task.columns.taskState",
    width: "14%",
  },
  {
    field: "state",
    headerName: "businessData.task.columns.state",
    width: "14%",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
  },
];

export function TaskListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/task/$name", openRoute);

  return (
    <DataListPage
      filters={defaultListFilters}
      icon={<Checkmark20Filled />}
      titleKey="businessData.task.pageLabel"
      listTitleKey="businessData.task.listTitle"
      actions={[refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      useListQuery={useTasks}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
