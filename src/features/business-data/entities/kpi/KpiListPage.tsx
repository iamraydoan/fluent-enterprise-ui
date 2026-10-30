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
import type { TranslationKey } from "@/i18n";
import type { ListQueryParams } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { useKpis } from "@/api";
import type { KpiRecord } from "@/api";

const tk = (key: string) => key as TranslationKey;

const COLUMNS: DataColumn<KpiRecord>[] = [
  { field: "name", headerName: tk("businessData.kpi.columns.name"), type: "link", locked: true, width: "35%" },
  { field: "description", headerName: tk("businessData.kpi.columns.description"), width: "30%" },
  { field: "type", headerName: tk("businessData.kpi.columns.type"), width: "20%" },
  { field: "state", headerName: tk("businessData.kpi.columns.state"), type: "enum", enumOptions: RECORD_STATE_COLUMN_OPTIONS, width: "15%" },
];

function useKpiListQuery(params: ListQueryParams) {
  return useKpis(params);
}

export function KpiListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/kpi/$name", openRoute);
  return (
    <DataListPage
      icon={<Target24Regular />}
      titleKey={tk("businessData.kpi.pageLabel")}
      listTitleKey={tk("businessData.kpi.listTitle")}
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useKpiListQuery}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
