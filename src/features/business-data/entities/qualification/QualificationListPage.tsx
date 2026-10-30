import { useQualifications } from "@/api";
import type { QualificationRecord } from "@/api";
import {
  createAction,
  DataListPage,
  defaultListFilters,
  exportAction,
  importAction,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Trophy24Regular } from "@/components/icons";
import type { ListQueryParams, ListQueryResult } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

const COLUMNS: DataColumn<QualificationRecord>[] = [
  {
    field: "name",
    headerName: "businessData.qualification.columns.name",
    type: "link",
    locked: true,
    width: "30%",
  },
  {
    field: "description",
    headerName: "businessData.qualification.columns.description",
    width: "35%",
  },
  { field: "type", headerName: "businessData.qualification.columns.type", width: "20%" },
  {
    field: "state",
    headerName: "businessData.qualification.columns.state",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
    width: "15%",
  },
];

function useQualificationList(params: ListQueryParams): ListQueryResult<QualificationRecord> {
  const query = useQualifications({
    q: params.filters?.q,
    state: params.filters?.state,
  });
  return {
    data: query.data ? { data: query.data, meta: { total: query.data.length } } : undefined,
    isLoading: query.isLoading,
  };
}

export function QualificationListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/qualification/$name", openRoute);

  return (
    <DataListPage
      icon={<Trophy24Regular />}
      titleKey="businessData.qualification.pageLabel"
      listTitleKey="businessData.qualification.listTitle"
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useQualificationList}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
