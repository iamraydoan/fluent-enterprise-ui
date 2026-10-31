import { useState } from "react";
import { useMaps } from "@/api";
import type { MapRecord } from "@/api";
import {
  RECORD_STATE_COLUMN_OPTIONS,
  DataListPage,
  createAction,
  defaultListFilters,
  exportAction,
  importAction,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Grid24Regular } from "@/components/icons";
import type { ListQueryParams } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { MODE_CREATE } from "../components/wizardMode";
import { MapDialog } from "./dialogs/MapDialog";

const COLUMNS: DataColumn<MapRecord>[] = [
  {
    field: "name",
    headerName: "businessData.map.columns.name",
    type: "link",
    locked: true,
    width: "30%",
  },
  { field: "description", headerName: "businessData.map.columns.description", width: "25%" },
  {
    field: "mapDefinition",
    headerName: "businessData.map.columns.mapDefinition",
    width: "30%",
  },
  {
    field: "state",
    headerName: "businessData.map.columns.state",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
    width: "15%",
  },
];

function useMapListQuery(params: ListQueryParams) {
  return useMaps(params);
}

export function MapListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/map/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);
  return (
    <>
      <DataListPage
        icon={<Grid24Regular />}
        titleKey={"businessData.map.pageLabel"}
        listTitleKey={"businessData.map.listTitle"}
        actions={[
          { ...createAction, onClick: () => setCreateOpen(true) },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useMapListQuery}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      {createOpen && <MapDialog mode={MODE_CREATE} onClose={() => setCreateOpen(false)} />}
    </>
  );
}
