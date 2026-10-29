import { useNavigate } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { useAiAgents } from "@/api";
import type { AiAgentRecord } from "@/api";
import { ActionBar, DataTableCard, PageHeader, RibbonButton } from "@/components/common";
import {
  Add24Regular,
  ArrowSync24Regular,
  Bot20Regular,
  Search20Regular,
} from "@/components/icons";
import { Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useTabsStore } from "@/stores/tabs-store";
import { useSharedStyles } from "@/styles/shared";

const columnHelper = createColumnHelper<AiAgentRecord>();

const STATE_LABELS: Record<string, TranslationKey> = {
  Active: "common.active",
  Draft: "common.draft",
  Terminated: "common.terminated",
};

const STATE_OPTIONS = ["all", "active", "draft", "terminated"];

export function AiAgentListPage() {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const openRoute = useTabsStore((state) => state.openRoute);
  const navigate = useNavigate();
  const [actionBarCollapsed, setActionBarCollapsed] = useState(false);
  const openDetail = useCallback(
    (name: string) => {
      const route = `/administration/ai-agent/${encodeURIComponent(name)}`;
      openRoute(route);
      navigate({ to: "/administration/ai-agent/$name", params: { name } });
    },
    [navigate, openRoute],
  );
  const columns = useMemo<ColumnDef<AiAgentRecord>[]>(
    () => [
      columnHelper.accessor("name", {
        header: () => t("aiAgent.columns.agent"),
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
        meta: { labelKey: "aiAgent.columns.agent", locked: true, width: "25%" },
      }),
      columnHelper.accessor("description", {
        header: () => t("aiAgent.columns.description"),
        cell: (info) => info.getValue(),
        meta: { labelKey: "aiAgent.columns.description", width: "40%" },
      }),
      columnHelper.accessor("mcpServers", {
        header: () => t("aiAgent.columns.mcpServers"),
        cell: (info) => info.getValue(),
        meta: { labelKey: "aiAgent.columns.mcpServers", width: "15%" },
      }),
      columnHelper.accessor("state", {
        header: () => t("aiAgent.columns.state"),
        cell: (info) => t(STATE_LABELS[info.getValue()] ?? "common.active"),
        meta: { labelKey: "aiAgent.columns.state", width: "20%" },
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
            <Bot20Regular />
            <Text size={300}>{t("aiAgent.pageLabel")}</Text>
          </span>
        </PageHeader>
      </div>

      <DataTableCard
        title={(count) => t("aiAgent.listTitle", { count })}
        ariaLabel={t("aiAgent.pageLabel")}
        columns={columns}
        stateOptions={STATE_OPTIONS}
        searchIcon={<Search20Regular />}
        useListQuery={useAiAgents}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
    </>
  );
}
