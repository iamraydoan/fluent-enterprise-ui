import { useSteps } from "@/api";
import type { StepRecord } from "@/api";
import {
  defaultListFilters,
  DataListPage,
  exportAction,
  importAction,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Flow24Regular } from "@/components/icons";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

const COLUMNS: DataColumn<StepRecord>[] = [
  {
    field: "name",
    headerName: "businessData.step.columns.name",
    type: "link",
    locked: true,
    width: "35%",
  },
  {
    field: "description",
    headerName: "businessData.step.columns.description",
    width: "40%",
  },
  {
    field: "state",
    headerName: "businessData.step.columns.state",
    width: "25%",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
  },
];

export function StepListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/step/$name", openRoute);

  return (
    <DataListPage
      filters={defaultListFilters}
      icon={<Flow24Regular />}
      titleKey="businessData.step.pageLabel"
      listTitleKey="businessData.step.listTitle"
      actions={[refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      useListQuery={useSteps}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
