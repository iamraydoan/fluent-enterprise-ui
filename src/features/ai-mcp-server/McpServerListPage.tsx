import { useMemo } from "react";
import { RecordState, useMcpServers } from "@/api";
import type { McpServerRecord } from "@/api";
import {
  DataTableCard,
  ListPage,
  RECORD_STATE_LABELS,
  RowLink,
  searchFilter,
  stateFilter,
} from "@/components/common";
import type { DataColumn, DataFilter } from "@/components/common";
import { Add24Regular, ArrowSync24Regular, PlugConnected20Regular } from "@/components/icons";
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
        key: "name",
        labelKey: "mcpServer.columns.name",
        locked: true,
        width: "25%",
        render: (row) => <RowLink onOpen={() => openDetail(row.name)}>{row.name}</RowLink>,
      },
      { key: "description", labelKey: "mcpServer.columns.description", width: "30%" },
      { key: "url", labelKey: "mcpServer.columns.url", width: "30%" },
      {
        key: "state",
        labelKey: "mcpServer.columns.state",
        width: "15%",
        render: (row) => t(RECORD_STATE_LABELS[row.state]),
      },
    ],
    [t, openDetail],
  );
  const filters = useMemo<DataFilter[]>(
    () => [
      stateFilter([RecordState.Active, RecordState.Draft, RecordState.Terminated]),
      searchFilter(),
    ],
    [],
  );
  return (
    <ListPage
      header={{
        icon: <PlugConnected20Regular />,
        title: t("mcpServer.pageLabel"),
        actions: [
          { icon: <Add24Regular />, label: t("actionBar.create") },
          { icon: <ArrowSync24Regular />, label: t("actionBar.refresh") },
        ],
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
