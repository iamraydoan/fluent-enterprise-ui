import { useAiAgents } from "@/api";
import type { AiAgentRecord } from "@/api";
import {
  createAction,
  DataListPage,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Bot20Regular } from "@/components/icons";
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
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/administration/ai-agent/$name", openRoute);
  return (
    <DataListPage
      icon={<Bot20Regular />}
      titleKey="aiAgent.pageLabel"
      listTitleKey="aiAgent.listTitle"
      actions={[createAction, refreshAction]}
      columns={COLUMNS}
      useListQuery={useAiAgents}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
