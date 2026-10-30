import { useState } from "react";
import { useFlows } from "@/api";
import type { FlowRecord } from "@/api";
import {
  RECORD_STATE_COLUMN_OPTIONS,
  DataListPage,
  createAction,
  defaultListFilters,
  exportAction,
  importAction,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Flow24Regular } from "@/components/icons";
import type { TranslationKey } from "@/i18n";
import type { ListQueryParams } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { FlowDialog } from "./FlowDialog";
import { MODE_CREATE } from "./wizardMode";

const tk = (key: string) => key as TranslationKey;

const COLUMNS: DataColumn<FlowRecord>[] = [
  {
    field: "name",
    headerName: tk("businessData.flow.columns.name"),
    type: "link",
    locked: true,
    width: "25%",
  },
  { field: "description", headerName: tk("businessData.flow.columns.description"), width: "30%" },
  { field: "type", headerName: tk("businessData.flow.columns.type"), width: "15%" },
  { field: "flowType", headerName: tk("businessData.flow.columns.flowType"), width: "15%" },
  {
    field: "state",
    headerName: tk("businessData.flow.columns.state"),
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
    width: "15%",
  },
];

function useFlowListQuery(params: ListQueryParams) {
  return useFlows(params);
}

export function FlowListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/flow/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);
  return (
    <>
      <DataListPage
        icon={<Flow24Regular />}
        titleKey={tk("businessData.flow.pageLabel")}
        listTitleKey={tk("businessData.flow.listTitle")}
        actions={[
          { ...createAction, onClick: () => setCreateOpen(true) },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useFlowListQuery}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      {createOpen && <FlowDialog mode={MODE_CREATE} onClose={() => setCreateOpen(false)} />}
    </>
  );
}
