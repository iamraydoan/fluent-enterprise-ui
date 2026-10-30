import { useState } from "react";
import { useQualificationChecks } from "@/api";
import type { QualificationCheckRecord } from "@/api";
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
import { Certificate24Regular } from "@/components/icons";
import { useAppTranslation } from "@/i18n";
import type { ListQueryParams, ListQueryResult } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { QualificationCheckFormDialog } from "./dialogs/QualificationCheckFormDialog";

const COLUMNS: DataColumn<QualificationCheckRecord>[] = [
  {
    field: "name",
    headerName: "businessData.qualificationCheck.columns.name",
    type: "link",
    locked: true,
    width: "30%",
  },
  {
    field: "description",
    headerName: "businessData.qualificationCheck.columns.description",
    width: "30%",
  },
  {
    field: "instanceType",
    headerName: "businessData.qualificationCheck.columns.instanceType",
    width: "20%",
  },
  {
    field: "state",
    headerName: "businessData.qualificationCheck.columns.state",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
    width: "20%",
  },
];

function useQualificationCheckList(params: ListQueryParams): ListQueryResult<QualificationCheckRecord> {
  const query = useQualificationChecks({
    q: params.filters?.q,
    state: params.filters?.state,
  });
  return {
    data: query.data ? { data: query.data, meta: { total: query.data.length } } : undefined,
    isLoading: query.isLoading,
  };
}

export function QualificationCheckListPage() {
  const { t } = useAppTranslation();
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/qualification-check/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <DataListPage
        icon={<Certificate24Regular />}
        titleKey="businessData.qualificationCheck.pageLabel"
        listTitleKey="businessData.qualificationCheck.listTitle"
        actions={[
          { ...createAction, onClick: () => setCreateOpen(true) },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useQualificationCheckList}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      <QualificationCheckFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("businessData.qualificationCheck.dialogs.form.createTitle")}
        submitLabel={t("actionBar.create")}
      />
    </>
  );
}
