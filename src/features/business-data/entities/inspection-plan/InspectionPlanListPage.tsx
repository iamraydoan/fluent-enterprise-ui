import { useState } from "react";
import { useInspectionPlans } from "@/api";
import type { InspectionPlanRecord } from "@/api";
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
import type { ListQueryParams } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { InspectionPlanDialog } from "./InspectionPlanDialog";
import { MODE_CREATE } from "./wizardMode";


const COLUMNS: DataColumn<InspectionPlanRecord>[] = [
  {
    field: "name",
    headerName: "businessData.inspectionPlan.columns.name",
    type: "link",
    locked: true,
    width: "35%",
  },
  {
    field: "description",
    headerName: "businessData.inspectionPlan.columns.description",
    width: "35%",
  },
  { field: "type", headerName: "businessData.inspectionPlan.columns.type", width: "15%" },
  {
    field: "state",
    headerName: "businessData.inspectionPlan.columns.state",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
    width: "15%",
  },
];

function useInspectionPlanListQuery(params: ListQueryParams) {
  return useInspectionPlans(params);
}

export function InspectionPlanListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/inspection-plan/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);
  return (
    <>
      <DataListPage
        icon={<TableSimple24Regular />}
        titleKey={"businessData.inspectionPlan.pageLabel"}
        listTitleKey={"businessData.inspectionPlan.listTitle"}
        actions={[
          { ...createAction, onClick: () => setCreateOpen(true) },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useInspectionPlanListQuery}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      {createOpen && (
        <InspectionPlanDialog mode={MODE_CREATE} onClose={() => setCreateOpen(false)} />
      )}
    </>
  );
}
