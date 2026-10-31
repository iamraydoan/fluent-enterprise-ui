import { useWorkgroups } from "@/api";
import type { WorkgroupRecord } from "@/api";
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

const COLUMNS: DataColumn<WorkgroupRecord>[] = [
  {
    field: "name",
    headerName: "businessData.workgroup.columns.name",
    type: "link",
    locked: true,
    width: "32%",
  },
  {
    field: "description",
    headerName: "businessData.workgroup.columns.description",
    width: "32%",
  },
  {
    field: "scope",
    headerName: "businessData.workgroup.columns.scope",
    width: "18%",
  },
  {
    field: "state",
    headerName: "businessData.workgroup.columns.state",
    width: "18%",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
  },
];

export function WorkgroupListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/workgroup/$name", openRoute);

  return (
    <DataListPage
      filters={defaultListFilters}
      icon={<ShieldCheckmark20Regular />}
      titleKey="businessData.workgroup.pageLabel"
      listTitleKey="businessData.workgroup.listTitle"
      actions={[refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      useListQuery={useWorkgroups}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
