import { useAreas } from "@/api";
import type { AreaRecord } from "@/api";
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
import { useAreaDialogs } from "./useAreaDialogs";

const COLUMNS: DataColumn<AreaRecord>[] = [
  {
    field: "name",
    headerName: "businessData.area.columns.name",
    type: "link",
    locked: true,
    width: "25%",
  },
  { field: "description", headerName: "businessData.area.columns.description", width: "30%" },
  { field: "facility", headerName: "businessData.area.columns.facility", width: "20%" },
  { field: "type", headerName: "businessData.area.columns.type", width: "15%" },
  { field: "state", headerName: "businessData.area.columns.state", width: "10%" },
];

export function AreaListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/area/$name", openRoute);
  const { dialogs, openCreate } = useAreaDialogs();

  return (
    <>
      <DataListPage
        icon={<Box24Regular />}
        titleKey="businessData.area.pageLabel"
        listTitleKey="businessData.area.listTitle"
        actions={[
          { ...createAction, onClick: openCreate },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useAreas}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      {dialogs}
    </>
  );
}
