import { useState } from "react";
import { useKpis } from "@/api";
import type { KpiRecord } from "@/api";
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
import { Target24Regular } from "@/components/icons";
import type { ListQueryParams } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { MODE_CREATE } from "../components/wizardMode";
import { KpiDialog } from "./dialogs/KpiDialog";

const COLUMNS: DataColumn<KpiRecord>[] = [
  {
    field: "name",
    headerName: "businessData.kpi.columns.name",
    type: "link",
    locked: true,
    width: "35%",
  },
  { field: "description", headerName: "businessData.kpi.columns.description", width: "30%" },
  { field: "type", headerName: "businessData.kpi.columns.type", width: "20%" },
  {
    field: "state",
    headerName: "businessData.kpi.columns.state",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
    width: "15%",
  },
];

function useKpiListQuery(params: ListQueryParams) {
  return useKpis(params);
}

export function KpiListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/kpi/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <DataListPage
        icon={<Target24Regular />}
        titleKey={"businessData.kpi.pageLabel"}
        listTitleKey={"businessData.kpi.listTitle"}
        actions={[
          { ...createAction, onClick: () => setCreateOpen(true) },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useKpiListQuery}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      {createOpen && <KpiDialog mode={MODE_CREATE} onClose={() => setCreateOpen(false)} />}
    </>
  );
}
