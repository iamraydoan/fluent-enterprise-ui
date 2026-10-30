import { useCalendars } from "@/api";
import type { CalendarRecord } from "@/api";
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

const COLUMNS: DataColumn<CalendarRecord>[] = [
  { field: "name", headerName: "businessData.calendar.columns.name", type: "link", locked: true, width: "30%" },
  { field: "description", headerName: "businessData.calendar.columns.description", width: "40%" },
  { field: "state", headerName: "businessData.calendar.columns.state", width: "30%" },
];

export function CalendarListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/calendar/$name", openRoute);
  return (
    <DataListPage
      icon={<Box24Regular />}
      titleKey="businessData.calendar.pageLabel"
      listTitleKey="businessData.calendar.listTitle"
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useCalendars}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
