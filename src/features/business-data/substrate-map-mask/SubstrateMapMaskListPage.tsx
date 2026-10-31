import { useSubstrateMapMasks } from "@/api";
import type { SubstrateMapMaskRecord } from "@/api";
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

const COLUMNS: DataColumn<SubstrateMapMaskRecord>[] = [
  {
    field: "name",
    headerName: "businessData.substrateMapMask.columns.name",
    type: "link",
    locked: true,
    width: "32%",
  },
  {
    field: "description",
    headerName: "businessData.substrateMapMask.columns.description",
    width: "32%",
  },
  {
    field: "substrateType",
    headerName: "businessData.substrateMapMask.columns.substrateType",
    width: "18%",
  },
  {
    field: "state",
    headerName: "businessData.substrateMapMask.columns.state",
    width: "18%",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
  },
];

export function SubstrateMapMaskListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/substrate-map-mask/$name", openRoute);

  return (
    <DataListPage
      filters={defaultListFilters}
      icon={<Grid24Regular />}
      titleKey="businessData.substrateMapMask.pageLabel"
      listTitleKey="businessData.substrateMapMask.listTitle"
      actions={[refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      useListQuery={useSubstrateMapMasks}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
