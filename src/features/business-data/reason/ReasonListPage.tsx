import { useState } from "react";
import { useReasons } from "@/api";
import type { ReasonRecord } from "@/api";
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
import { Box24Regular } from "@/components/icons";
import { useAppTranslation } from "@/i18n";
import type { ListQueryParams, ListQueryResult } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { ReasonFormDialog } from "./dialogs/ReasonFormDialog";

const COLUMNS: DataColumn<ReasonRecord>[] = [
  {
    field: "name",
    headerName: "businessData.reason.columns.name",
    type: "link",
    locked: true,
    width: "30%",
  },
  {
    field: "description",
    headerName: "businessData.reason.columns.description",
    width: "30%",
  },
  { field: "type", headerName: "businessData.reason.columns.type", width: "20%" },
  {
    field: "state",
    headerName: "businessData.reason.columns.state",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
    width: "20%",
  },
];

function useReasonList(params: ListQueryParams): ListQueryResult<ReasonRecord> {
  const query = useReasons({
    q: params.filters?.q,
    state: params.filters?.state,
  });
  return {
    data: query.data ? { data: query.data, meta: { total: query.data.length } } : undefined,
    isLoading: query.isLoading,
  };
}

export function ReasonListPage() {
  const { t } = useAppTranslation();
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/reason/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <DataListPage
        icon={<Box24Regular />}
        titleKey="businessData.reason.pageLabel"
        listTitleKey="businessData.reason.listTitle"
        actions={[
          { ...createAction, onClick: () => setCreateOpen(true) },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useReasonList}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      <ReasonFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("businessData.reason.dialogs.form.createTitle")}
        submitLabel={t("actionBar.create")}
      />
    </>
  );
}
