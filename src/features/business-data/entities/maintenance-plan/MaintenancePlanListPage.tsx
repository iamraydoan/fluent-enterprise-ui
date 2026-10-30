import { useMaintenancePlans } from "@/api";
import type { MaintenancePlanRecord } from "@/api";
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
import { Wrench24Regular } from "@/components/icons";
import type { TranslationKey } from "@/i18n";
import type { ListQueryParams } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

const tk = (key: string) => key as TranslationKey;

const COLUMNS: DataColumn<MaintenancePlanRecord>[] = [
  { field: "name", headerName: tk("businessData.maintenancePlan.columns.name"), type: "link", locked: true, width: "30%" },
  { field: "description", headerName: tk("businessData.maintenancePlan.columns.description"), width: "30%" },
  { field: "type", headerName: tk("businessData.maintenancePlan.columns.type"), width: "15%" },
  { field: "scope", headerName: tk("businessData.maintenancePlan.columns.scope"), width: "15%" },
  { field: "state", headerName: tk("businessData.maintenancePlan.columns.state"), type: "enum", enumOptions: RECORD_STATE_COLUMN_OPTIONS, width: "10%" },
];

function useMaintenancePlanListQuery(params: ListQueryParams) {
  return useMaintenancePlans(params);
}

export function MaintenancePlanListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/maintenance-plan/$name", openRoute);
  return (
    <DataListPage
      icon={<Wrench24Regular />}
      titleKey={tk("businessData.maintenancePlan.pageLabel")}
      listTitleKey={tk("businessData.maintenancePlan.listTitle")}
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useMaintenancePlanListQuery}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
