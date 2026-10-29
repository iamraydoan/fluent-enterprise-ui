import { useNavigate } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { useMcpServers } from "@/api";
import type { McpServerRecord } from "@/api";
import { ActionBar, DataTableCard, PageHeader, RibbonButton } from "@/components/common";
import {
  Add24Regular,
  ArrowSync24Regular,
  PlugConnected20Regular,
  Search20Regular,
} from "@/components/icons";
import { Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useTabsStore } from "@/stores/tabs-store";
import { useSharedStyles } from "@/styles/shared";

const columnHelper = createColumnHelper<McpServerRecord>();

const STATE_LABELS: Record<string, TranslationKey> = {
  Active: "common.active",
  Draft: "common.draft",
  Terminated: "common.terminated",
};

const STATE_OPTIONS = ["all", "active", "draft", "terminated"];

export function McpServerListPage() {
  const sharedStyles = useSharedStyles();
  const { t } = useAppTranslation();
  const openRoute = useTabsStore((state) => state.openRoute);
  const navigate = useNavigate();
  const [actionBarCollapsed, setActionBarCollapsed] = useState(false);
  const openDetail = useCallback(
    (name: string) => {
      const route = `/administration/ai-mcp-server/${encodeURIComponent(name)}`;
      openRoute(route);
      navigate({ to: "/administration/ai-mcp-server/$name", params: { name } });
    },
    [navigate, openRoute],
  );
  const columns = useMemo<ColumnDef<McpServerRecord>[]>(
    () => [
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
        cell: (info) => t(STATE_LABELS[info.getValue()] ?? "common.active"),
        meta: { labelKey: "mcpServer.columns.state", width: "15%" },
      }),
    ],
    [t, sharedStyles, openDetail],
  );
  return (
    <>
      <div className={sharedStyles.headerBlock}>
        {!actionBarCollapsed && (
          <ActionBar>
            <div className={sharedStyles.actionBarGroup}>
              <div className={sharedStyles.actionBarGroupButtons}>
                <RibbonButton
                  sharedStyles={sharedStyles}
                  icon={<Add24Regular />}
                  label={t("actionBar.create")}
                />
                <RibbonButton
                  sharedStyles={sharedStyles}
                  icon={<ArrowSync24Regular />}
                  label={t("actionBar.refresh")}
                />
              </div>
              <div className={sharedStyles.actionBarGroupLabel}>
                {t("actionBar.groups.general")}
              </div>
            </div>
          </ActionBar>
        )}
        <PageHeader
          collapsed={actionBarCollapsed}
          onToggle={() => setActionBarCollapsed((v) => !v)}
        >
          <span style={{ display: "inline-flex", alignItems: "center", columnGap: 12 }}>
            <PlugConnected20Regular />
            <Text size={300}>{t("mcpServer.pageLabel")}</Text>
          </span>
        </PageHeader>
      </div>

      <DataTableCard
        title={(count) => t("mcpServer.listTitle", { count })}
        ariaLabel={t("mcpServer.pageLabel")}
        columns={columns}
        stateOptions={STATE_OPTIONS}
        searchIcon={<Search20Regular />}
        useListQuery={useMcpServers}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
    </>
  );
}
