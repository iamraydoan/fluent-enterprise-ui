import { useFabLives } from "@/api";
import type { FabLiveRecord } from "@/api";
import {
  RECORD_STATE_COLUMN_OPTIONS,
  DataListPage,
  defaultListFilters,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Target24Regular } from "@/components/icons";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

const COLUMNS: DataColumn<FabLiveRecord>[] = [
  {
    field: "name",
    headerName: "manufacturing.fabLives.columns.name",
    type: "link",
    locked: true,
    width: "30%",
  },
  {
    field: "description",
    headerName: "manufacturing.fabLives.columns.description",
    width: "35%",
  },
  {
    field: "folder",
    headerName: "manufacturing.fabLives.columns.folder",
    width: "17%",
  },
  {
    field: "state",
    headerName: "manufacturing.fabLives.columns.state",
    width: "18%",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
  },
];

export function FabLiveListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/manufacturing/fab-lives/$name", openRoute);

  return (
    <DataListPage
      filters={defaultListFilters}
      icon={<Target24Regular />}
      titleKey="manufacturing.fabLives.pageLabel"
      listTitleKey="manufacturing.fabLives.listTitle"
      actions={[refreshAction]}
      columns={COLUMNS}
      useListQuery={useFabLives}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
