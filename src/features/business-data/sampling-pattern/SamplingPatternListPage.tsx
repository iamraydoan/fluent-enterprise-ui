import { useState } from "react";
import { useSamplingPatterns } from "@/api";
import type { SamplingPatternRecord } from "@/api";
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
import { SamplingPatternFormDialog } from "./dialogs/SamplingPatternFormDialog";

const COLUMNS: DataColumn<SamplingPatternRecord>[] = [
  {
    field: "name",
    headerName: "businessData.samplingPattern.columns.name",
    type: "link",
    locked: true,
    width: "30%",
  },
  {
    field: "description",
    headerName: "businessData.samplingPattern.columns.description",
    width: "30%",
  },
  { field: "type", headerName: "businessData.samplingPattern.columns.type", width: "15%" },
  { field: "mode", headerName: "businessData.samplingPattern.columns.mode", width: "15%" },
  {
    field: "state",
    headerName: "businessData.samplingPattern.columns.state",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
    width: "10%",
  },
];

function useSamplingPatternList(params: ListQueryParams): ListQueryResult<SamplingPatternRecord> {
  const query = useSamplingPatterns({
    q: params.filters?.q,
    state: params.filters?.state,
  });
  return {
    data: query.data ? { data: query.data, meta: { total: query.data.length } } : undefined,
    isLoading: query.isLoading,
  };
}

export function SamplingPatternListPage() {
  const { t } = useAppTranslation();
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/sampling-pattern/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <DataListPage
        icon={<Wrench24Regular />}
        titleKey="businessData.samplingPattern.pageLabel"
        listTitleKey="businessData.samplingPattern.listTitle"
        actions={[
          { ...createAction, onClick: () => setCreateOpen(true) },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useSamplingPatternList}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      <SamplingPatternFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("businessData.samplingPattern.dialogs.form.createTitle")}
        submitLabel={t("actionBar.create")}
      />
    </>
  );
}
