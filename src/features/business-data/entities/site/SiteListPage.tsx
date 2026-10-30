import { useSites } from "@/api";
import type { SiteRecord } from "@/api";
import {
  DataListPage,
  exportAction,
  importAction,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Globe24Regular } from "@/components/icons";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

const COLUMNS: DataColumn<SiteRecord>[] = [
  {
    field: "name",
    headerName: "businessData.site.columns.name",
    type: "link",
    locked: true,
    width: "30%",
  },
  {
    field: "description",
    headerName: "businessData.site.columns.description",
    width: "30%",
  },
  {
    field: "enterprise",
    headerName: "businessData.site.columns.enterprise",
    width: "18%",
  },
  {
    field: "isRemote",
    headerName: "businessData.site.columns.isRemote",
    type: "boolean",
    width: "10%",
  },
  {
    field: "state",
    headerName: "businessData.site.columns.state",
    width: "12%",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
  },
];

export function SiteListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/site/$name", openRoute);

  return (
    <DataListPage
      icon={<Globe24Regular />}
      titleKey="businessData.site.pageLabel"
      listTitleKey="businessData.site.listTitle"
      actions={[refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      useListQuery={useSites}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
