import { useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { RecordState, useAiAgents } from "@/api";
import type { AiAgentRecord } from "@/api";
import { DataTableCard, ListPageHeader, RECORD_STATE_LABELS } from "@/components/common";
import type { DataColumn, DataFilter } from "@/components/common";
import { Add24Regular, ArrowSync24Regular, Bot20Regular } from "@/components/icons";
import { useAppTranslation } from "@/i18n";
import { enumOptions } from "@/lib/enum";
import { useTabsStore } from "@/stores/tabs-store";
import { useSharedStyles } from "@/styles/shared";

export function AiAgentListPage() {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const openRoute = useTabsStore((state) => state.openRoute);
  const navigate = useNavigate();
  const openDetail = useCallback(
    (name: string) => {
      const route = `/administration/ai-agent/${encodeURIComponent(name)}`;
      openRoute(route);
      navigate({ to: "/administration/ai-agent/$name", params: { name } });
    },
    [navigate, openRoute],
  );
  const columns = useMemo<DataColumn<AiAgentRecord>[]>(
    () => [
      {
        key: "name",
        labelKey: "aiAgent.columns.agent",
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
      { key: "description", labelKey: "aiAgent.columns.description", width: "40%" },
      { key: "mcpServers", labelKey: "aiAgent.columns.mcpServers", width: "15%" },
      {
        key: "state",
        labelKey: "aiAgent.columns.state",
        width: "20%",
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
        icon={<Bot20Regular />}
        title={t("aiAgent.pageLabel")}
        actions={[
          { icon: <Add24Regular />, label: t("actionBar.create") },
          { icon: <ArrowSync24Regular />, label: t("actionBar.refresh") },
        ]}
      />

      <DataTableCard
        title={(count) => t("aiAgent.listTitle", { count })}
        ariaLabel={t("aiAgent.pageLabel")}
        columns={columns}
        filters={filters}
        useListQuery={useAiAgents}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
    </>
  );
}
