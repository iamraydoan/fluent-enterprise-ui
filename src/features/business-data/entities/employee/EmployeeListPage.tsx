import { useEmployees } from "@/api";
import type { EmployeeRecord } from "@/api";
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
import { Organization24Regular } from "@/components/icons";
import type { TranslationKey } from "@/i18n";
import type { ListQueryParams } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

const tk = (key: string) => key as TranslationKey;

const COLUMNS: DataColumn<EmployeeRecord>[] = [
  { field: "name", headerName: tk("businessData.employee.columns.name"), type: "link", locked: true, width: "25%" },
  { field: "description", headerName: tk("businessData.employee.columns.description"), width: "25%" },
  { field: "user", headerName: tk("businessData.employee.columns.user"), width: "15%" },
  { field: "number", headerName: tk("businessData.employee.columns.number"), width: "10%" },
  { field: "team", headerName: tk("businessData.employee.columns.team"), width: "15%" },
  { field: "state", headerName: tk("businessData.employee.columns.state"), type: "enum", enumOptions: RECORD_STATE_COLUMN_OPTIONS, width: "10%" },
];

function useEmployeeListQuery(params: ListQueryParams) {
  return useEmployees(params);
}

export function EmployeeListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/employee/$name", openRoute);
  return (
    <DataListPage
      icon={<Organization24Regular />}
      titleKey={tk("businessData.employee.pageLabel")}
      listTitleKey={tk("businessData.employee.listTitle")}
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useEmployeeListQuery}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
