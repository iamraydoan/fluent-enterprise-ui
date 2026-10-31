import { useSubstrateMaps } from "@/api";
import type { SubstrateMapRecord } from "@/api";
import {
  defaultListFilters,
  DataListPage,
  exportAction,
  importAction,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Grid24Regular } from "@/components/icons";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

const COLUMNS: DataColumn<SubstrateMapRecord>[] = [
  {
    field: "name",
    headerName: "businessData.substrateMap.columns.name",
    type: "link",
    locked: true,
    width: "32%",
  },
  {
    field: "description",
    headerName: "businessData.substrateMap.columns.description",
    width: "32%",
  },
  {
    field: "substrateType",
    headerName: "businessData.substrateMap.columns.substrateType",
    width: "18%",
  },
  {
    field: "state",
    headerName: "businessData.substrateMap.columns.state",
    width: "18%",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
  },
];

export function SubstrateMapListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/substrate-map/$name", openRoute);

  return (
    <DataListPage
      filters={defaultListFilters}
      icon={<Grid24Regular />}
      titleKey="businessData.substrateMap.pageLabel"
      listTitleKey="businessData.substrateMap.listTitle"
      actions={[refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      useListQuery={useSubstrateMaps}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
