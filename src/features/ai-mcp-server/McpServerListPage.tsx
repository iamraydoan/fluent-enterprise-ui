import { useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { RecordState, useMcpServers } from "@/api";
import type { McpServerRecord } from "@/api";
import { DataTableCard, ListPageHeader, RECORD_STATE_LABELS } from "@/components/common";
import type { DataColumn, DataFilter } from "@/components/common";
import { Add24Regular, ArrowSync24Regular, PlugConnected20Regular } from "@/components/icons";
import { useAppTranslation } from "@/i18n";
import { enumOptions } from "@/lib/enum";
import { useTabsStore } from "@/stores/tabs-store";
import { useSharedStyles } from "@/styles/shared";

export function McpServerListPage() {
  const sharedStyles = useSharedStyles();
  const { t } = useAppTranslation();
  const openRoute = useTabsStore((state) => state.openRoute);
  const navigate = useNavigate();
  const openDetail = useCallback(
    (name: string) => {
      const route = `/administration/ai-mcp-server/${encodeURIComponent(name)}`;
      openRoute(route);
      navigate({ to: "/administration/ai-mcp-server/$name", params: { name } });
    },
    [navigate, openRoute],
  );
  const columns = useMemo<DataColumn<McpServerRecord>[]>(
    () => [
      {
        key: "name",
        labelKey: "mcpServer.columns.name",
        locked: true,
        width: "25%",
        render: (row) => (
          <a
            className={sharedStyles.tableLink}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              openDetail(row.name);
            }}
          >
            {row.name}
          </a>
        ),
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
    [t, sharedStyles, openDetail],
  );
  const filters = useMemo<DataFilter[]>(
    () => [
      {
        type: "select",
        param: "state",
        labelKey: "common.stateFilterLabel",
        includeAll: true,
        options: enumOptions(
          [RecordState.Active, RecordState.Draft, RecordState.Terminated],
          RECORD_STATE_LABELS,
        ),
      },
      { type: "search", param: "q" },
    ],
    [],
  );
  return (
    <>
      <ListPageHeader
        icon={<PlugConnected20Regular />}
        title={t("mcpServer.pageLabel")}
        actions={[
          { icon: <Add24Regular />, label: t("actionBar.create") },
          { icon: <ArrowSync24Regular />, label: t("actionBar.refresh") },
        ]}
      />

      <DataTableCard
        title={(count) => t("mcpServer.listTitle", { count })}
        ariaLabel={t("mcpServer.pageLabel")}
        columns={columns}
        filters={filters}
        useListQuery={useMcpServers}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
    </>
  );
}
