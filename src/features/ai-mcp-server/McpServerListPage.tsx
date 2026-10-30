import { useMcpServers } from "@/api";
import type { McpServerRecord } from "@/api";
import {
  createAction,
  DataTableCard,
  defaultListFilters,
  ListPage,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { PlugConnected20Regular } from "@/components/icons";
import { useAppTranslation } from "@/i18n";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

const COLUMNS: DataColumn<McpServerRecord>[] = [
  { field: "name", headerName: "mcpServer.columns.name", type: "link", locked: true, width: "25%" },
  { field: "description", headerName: "mcpServer.columns.description", width: "30%" },
  { field: "url", headerName: "mcpServer.columns.url", width: "30%" },
  {
    field: "state",
    headerName: "mcpServer.columns.state",
    width: "15%",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
  },
];

export function McpServerListPage() {
  const { t } = useAppTranslation();
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/administration/ai-mcp-server/$name", openRoute);
  return (
    <ListPage
      header={{
        icon: <PlugConnected20Regular />,
        title: t("mcpServer.pageLabel"),
        actions: [createAction, refreshAction],
      }}
    >
      <DataTableCard
        title={(count) => t("mcpServer.listTitle", { count })}
        ariaLabel={t("mcpServer.pageLabel")}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useMcpServers}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
    </ListPage>
  );
}
