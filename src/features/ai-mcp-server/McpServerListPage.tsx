import { useNavigate } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { useMcpServers } from "@/api";
import type { McpServerRecord } from "@/api";
import {
  DataTableCard,
  ListPageHeader,
  RECORD_STATE_LABELS,
  RECORD_STATE_OPTIONS,
} from "@/components/common";
import type { DataTableFeatures } from "@/components/common";
import {
  Add24Regular,
  ArrowSync24Regular,
  PlugConnected20Regular,
  Search20Regular,
} from "@/components/icons";
import { useAppTranslation } from "@/i18n";
import { useTabsStore } from "@/stores/tabs-store";
import { useSharedStyles } from "@/styles/shared";

const columnHelper = createColumnHelper<DataTableFeatures, McpServerRecord>();

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
  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor("name", {
          header: () => t("mcpServer.columns.name"),
          cell: (info) => (
            <a
              className={sharedStyles.tableLink}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openDetail(info.getValue());
              }}
            >
              {info.getValue()}
            </a>
          ),
          meta: { labelKey: "mcpServer.columns.name", locked: true, width: "25%" },
        }),
        columnHelper.accessor("description", {
          header: () => t("mcpServer.columns.description"),
          cell: (info) => info.getValue(),
          meta: { labelKey: "mcpServer.columns.description", width: "30%" },
        }),
        columnHelper.accessor("url", {
          header: () => t("mcpServer.columns.url"),
          cell: (info) => info.getValue(),
          meta: { labelKey: "mcpServer.columns.url", width: "30%" },
        }),
        columnHelper.accessor("state", {
          header: () => t("mcpServer.columns.state"),
          cell: (info) => t(RECORD_STATE_LABELS[info.getValue()] ?? "common.active"),
          meta: { labelKey: "mcpServer.columns.state", width: "15%" },
        }),
      ]),
    [t, sharedStyles, openDetail],
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
        stateOptions={RECORD_STATE_OPTIONS}
        searchIcon={<Search20Regular />}
        useListQuery={useMcpServers}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
    </>
  );
}
