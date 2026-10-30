import { useMemo } from "react";
import { useAiAgents } from "@/api";
import type { AiAgentRecord } from "@/api";
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
import { Bot20Regular } from "@/components/icons";
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
        field: "name",
        headerName: "aiAgent.columns.agent",
        locked: true,
        width: "25%",
        cellRenderer: (row) => <RowLink onOpen={() => openDetail(row.name)}>{row.name}</RowLink>,
      },
      { field: "description", headerName: "aiAgent.columns.description", width: "40%" },
      { field: "mcpServers", headerName: "aiAgent.columns.mcpServers", width: "15%" },
      {
        field: "state",
        headerName: "aiAgent.columns.state",
        width: "20%",
        enumOptions: RECORD_STATE_COLUMN_OPTIONS,
      },
    ],
    [openDetail],
  );
  const filters = useMemo<DataFilter[]>(() => [stateFilter(), searchFilter()], []);
  return (
    <ListPage
      header={{
        icon: <Bot20Regular />,
        title: t("aiAgent.pageLabel"),
        actions: [createAction, refreshAction],
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
