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
import type { ListQueryParams } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";


const COLUMNS: DataColumn<EmployeeRecord>[] = [
  { field: "name", headerName: "businessData.employee.columns.name", type: "link", locked: true, width: "25%" },
  { field: "description", headerName: "businessData.employee.columns.description", width: "25%" },
  { field: "user", headerName: "businessData.employee.columns.user", width: "15%" },
  { field: "number", headerName: "businessData.employee.columns.number", width: "10%" },
  { field: "team", headerName: "businessData.employee.columns.team", width: "15%" },
  { field: "state", headerName: "businessData.employee.columns.state", type: "enum", enumOptions: RECORD_STATE_COLUMN_OPTIONS, width: "10%" },
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
      titleKey={"businessData.employee.pageLabel"}
      listTitleKey={"businessData.employee.listTitle"}
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useEmployeeListQuery}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
