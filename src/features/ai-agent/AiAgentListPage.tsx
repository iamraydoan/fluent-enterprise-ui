import { useAiAgents } from "@/api";
import type { AiAgentRecord } from "@/api";
import {
  createAction,
  DataTableCard,
  defaultListFilters,
  ListPage,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Bot20Regular } from "@/components/icons";
import { useAppTranslation } from "@/i18n";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

const COLUMNS: DataColumn<AiAgentRecord>[] = [
  { field: "name", headerName: "aiAgent.columns.agent", type: "link", locked: true, width: "25%" },
  { field: "description", headerName: "aiAgent.columns.description", width: "40%" },
  { field: "mcpServers", headerName: "aiAgent.columns.mcpServers", width: "15%" },
  {
    field: "state",
    headerName: "aiAgent.columns.state",
    width: "20%",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
  },
];

export function AiAgentListPage() {
  const { t } = useAppTranslation();
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/administration/ai-agent/$name", openRoute);
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
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useAiAgents}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
    </ListPage>
  );
}
