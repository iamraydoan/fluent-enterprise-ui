import { useState } from "react";
import { useSendAheadRuns } from "@/api";
import type { SendAheadRunRecord } from "@/api";
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
import { SendAheadRunFormDialog } from "./dialogs/SendAheadRunFormDialog";

const COLUMNS: DataColumn<SendAheadRunRecord>[] = [
  {
    field: "name",
    headerName: "businessData.sendAheadRun.columns.name",
    type: "link",
    locked: true,
    width: "35%",
  },
  {
    field: "description",
    headerName: "businessData.sendAheadRun.columns.description",
    width: "45%",
  },
  {
    field: "state",
    headerName: "businessData.sendAheadRun.columns.state",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
    width: "20%",
  },
];

function useSendAheadRunList(params: ListQueryParams): ListQueryResult<SendAheadRunRecord> {
  const query = useSendAheadRuns({
    q: params.filters?.q,
    state: params.filters?.state,
  });
  return {
    data: query.data ? { data: query.data, meta: { total: query.data.length } } : undefined,
    isLoading: query.isLoading,
  };
}

export function SendAheadRunListPage() {
  const { t } = useAppTranslation();
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/send-ahead-run/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <DataListPage
        icon={<Wrench24Regular />}
        titleKey="businessData.sendAheadRun.pageLabel"
        listTitleKey="businessData.sendAheadRun.listTitle"
        actions={[
          { ...createAction, onClick: () => setCreateOpen(true) },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useSendAheadRunList}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      <SendAheadRunFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("businessData.sendAheadRun.dialogs.form.createTitle")}
        submitLabel={t("actionBar.create")}
      />
    </>
  );
}
