import { useTeams } from "@/api";
import type { TeamRecord } from "@/api";
import {
  defaultListFilters,
  DataListPage,
  exportAction,
  importAction,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { ShieldCheckmark20Regular } from "@/components/icons";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

const COLUMNS: DataColumn<TeamRecord>[] = [
  {
    field: "name",
    headerName: "businessData.team.columns.name",
    type: "link",
    locked: true,
    width: "32%",
  },
  {
    field: "description",
    headerName: "businessData.team.columns.description",
    width: "32%",
  },
  {
    field: "calendar",
    headerName: "businessData.team.columns.calendar",
    width: "18%",
  },
  {
    field: "state",
    headerName: "businessData.team.columns.state",
    width: "18%",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
  },
];

export function TeamListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/team/$name", openRoute);

  return (
    <DataListPage
      filters={defaultListFilters}
      icon={<ShieldCheckmark20Regular />}
      titleKey="businessData.team.pageLabel"
      listTitleKey="businessData.team.listTitle"
      actions={[refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      useListQuery={useTeams}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
