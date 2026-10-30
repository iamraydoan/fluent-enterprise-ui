import { useMemo } from "react";
import { useMcpServers } from "@/api";
import type { McpServerRecord } from "@/api";
import {
  createAction,
  DataTableCard,
  ListPage,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
  RowLink,
  searchFilter,
  stateFilter,
} from "@/components/common";
import type { DataColumn, DataFilter } from "@/components/common";
import { PlugConnected20Regular } from "@/components/icons";
import { useAppTranslation } from "@/i18n";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

export function McpServerListPage() {
  const { t } = useAppTranslation();
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/administration/ai-mcp-server/$name", openRoute);
  const columns = useMemo<DataColumn<McpServerRecord>[]>(
    () => [
      {
        field: "name",
        headerName: "mcpServer.columns.name",
        locked: true,
        width: "25%",
        cellRenderer: (row) => <RowLink onOpen={() => openDetail(row.name)}>{row.name}</RowLink>,
      },
      { field: "description", headerName: "mcpServer.columns.description", width: "30%" },
      { field: "url", headerName: "mcpServer.columns.url", width: "30%" },
      {
        field: "state",
        headerName: "mcpServer.columns.state",
        width: "15%",
        enumOptions: RECORD_STATE_COLUMN_OPTIONS,
      },
    ],
    [openDetail],
  );
  const filters = useMemo<DataFilter[]>(() => [stateFilter(), searchFilter()], []);
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
        columns={columns}
        filters={filters}
        useListQuery={useMcpServers}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
    </ListPage>
  );
}
