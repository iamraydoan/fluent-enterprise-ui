import { useState } from "react";
import { useSetupMatrices } from "@/api";
import type { SetupMatrixRecord } from "@/api";
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
import { SetupMatrixFormDialog } from "./dialogs/SetupMatrixFormDialog";

const COLUMNS: DataColumn<SetupMatrixRecord>[] = [
  {
    field: "name",
    headerName: "businessData.setupMatrix.columns.name",
    type: "link",
    locked: true,
    width: "35%",
  },
  {
    field: "description",
    headerName: "businessData.setupMatrix.columns.description",
    width: "35%",
  },
  {
    field: "timeScale",
    headerName: "businessData.setupMatrix.columns.timeScale",
    width: "15%",
  },
  {
    field: "state",
    headerName: "businessData.setupMatrix.columns.state",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
    width: "15%",
  },
];

function useSetupMatrixList(params: ListQueryParams): ListQueryResult<SetupMatrixRecord> {
  const query = useSetupMatrices({
    q: params.filters?.q,
    state: params.filters?.state,
  });
  return {
    data: query.data ? { data: query.data, meta: { total: query.data.length } } : undefined,
    isLoading: query.isLoading,
  };
}

export function SetupMatrixListPage() {
  const { t } = useAppTranslation();
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/setup-matrix/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <DataListPage
        icon={<Wrench24Regular />}
        titleKey="businessData.setupMatrix.pageLabel"
        listTitleKey="businessData.setupMatrix.listTitle"
        actions={[
          { ...createAction, onClick: () => setCreateOpen(true) },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useSetupMatrixList}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      <SetupMatrixFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("businessData.setupMatrix.dialogs.form.createTitle")}
        submitLabel={t("actionBar.create")}
      />
    </>
  );
}
