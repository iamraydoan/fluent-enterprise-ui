import { useMemo } from "react";
import { RecordState, useAiAgents } from "@/api";
import type { AiAgentRecord } from "@/api";
import {
  DataTableCard,
  ListPage,
  RECORD_STATE_LABELS,
  RowLink,
  searchFilter,
  stateFilter,
} from "@/components/common";
import type { DataColumn, DataFilter } from "@/components/common";
import { Add24Regular, ArrowSync24Regular, Bot20Regular } from "@/components/icons";
import { useAppTranslation } from "@/i18n";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

export function AiAgentListPage() {
  const { t } = useAppTranslation();
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/administration/ai-agent/$name", openRoute);
  const columns = useMemo<DataColumn<AiAgentRecord>[]>(
    () => [
      {
        key: "name",
        labelKey: "aiAgent.columns.agent",
        locked: true,
        width: "25%",
        render: (row) => <RowLink onOpen={() => openDetail(row.name)}>{row.name}</RowLink>,
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
        icon: <Bot20Regular />,
        title: t("aiAgent.pageLabel"),
        actions: [
          { icon: <Add24Regular />, label: t("actionBar.create") },
          { icon: <ArrowSync24Regular />, label: t("actionBar.refresh") },
        ],
      }}
    >
      <DataTableCard
        title={(count) => t("aiAgent.listTitle", { count })}
        ariaLabel={t("aiAgent.pageLabel")}
        columns={columns}
        filters={filters}
        useListQuery={useAiAgents}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
    </ListPage>
  );
}
