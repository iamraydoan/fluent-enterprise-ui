import { useState } from "react";
import { useSamplingPlans } from "@/api";
import type { SamplingPlanRecord } from "@/api";
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
import { Wrench24Regular } from "@/components/icons";
import { useAppTranslation } from "@/i18n";
import type { ListQueryParams, ListQueryResult } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { SamplingPlanFormDialog } from "./dialogs/SamplingPlanFormDialog";

const COLUMNS: DataColumn<SamplingPlanRecord>[] = [
  {
    field: "name",
    headerName: "businessData.samplingPlan.columns.name",
    type: "link",
    locked: true,
    width: "30%",
  },
  {
    field: "description",
    headerName: "businessData.samplingPlan.columns.description",
    width: "30%",
  },
  { field: "type", headerName: "businessData.samplingPlan.columns.type", width: "15%" },
  {
    field: "defaultSamplingType",
    headerName: "businessData.samplingPlan.columns.defaultSamplingType",
    width: "15%",
  },
  {
    field: "state",
    headerName: "businessData.samplingPlan.columns.state",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
    width: "10%",
  },
];

function useSamplingPlanList(params: ListQueryParams): ListQueryResult<SamplingPlanRecord> {
  const query = useSamplingPlans({
    q: params.filters?.q,
    state: params.filters?.state,
  });
  return {
    data: query.data ? { data: query.data, meta: { total: query.data.length } } : undefined,
    isLoading: query.isLoading,
  };
}

export function SamplingPlanListPage() {
  const { t } = useAppTranslation();
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/sampling-plan/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <DataListPage
        icon={<Wrench24Regular />}
        titleKey="businessData.samplingPlan.pageLabel"
        listTitleKey="businessData.samplingPlan.listTitle"
        actions={[
          { ...createAction, onClick: () => setCreateOpen(true) },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useSamplingPlanList}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      <SamplingPlanFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("businessData.samplingPlan.dialogs.form.createTitle")}
        submitLabel={t("actionBar.create")}
      />
    </>
  );
}
