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
import { TableSimple24Regular } from "@/components/icons";
import type { TranslationKey } from "@/i18n";
import type { ListQueryParams } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { useInspectionPlans } from "@/api";
import type { InspectionPlanRecord } from "@/api";

const tk = (key: string) => key as TranslationKey;

const COLUMNS: DataColumn<InspectionPlanRecord>[] = [
  { field: "name", headerName: tk("businessData.inspectionPlan.columns.name"), type: "link", locked: true, width: "35%" },
  { field: "description", headerName: tk("businessData.inspectionPlan.columns.description"), width: "35%" },
  { field: "type", headerName: tk("businessData.inspectionPlan.columns.type"), width: "15%" },
  { field: "state", headerName: tk("businessData.inspectionPlan.columns.state"), type: "enum", enumOptions: RECORD_STATE_COLUMN_OPTIONS, width: "15%" },
];

function useInspectionPlanListQuery(params: ListQueryParams) {
  return useInspectionPlans(params);
}

export function InspectionPlanListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/inspection-plan/$name", openRoute);
  return (
    <DataListPage
      icon={<TableSimple24Regular />}
      titleKey={tk("businessData.inspectionPlan.pageLabel")}
      listTitleKey={tk("businessData.inspectionPlan.listTitle")}
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useInspectionPlanListQuery}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
