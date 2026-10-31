import { useState } from "react";
import { useServices } from "@/api";
import type { ServiceRecord } from "@/api";
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
import { ServiceFormDialog } from "./dialogs/ServiceFormDialog";

const COLUMNS: DataColumn<ServiceRecord>[] = [
  {
    field: "name",
    headerName: "businessData.service.columns.name",
    type: "link",
    locked: true,
    width: "30%",
  },
  {
    field: "description",
    headerName: "businessData.service.columns.description",
    width: "35%",
  },
  { field: "type", headerName: "businessData.service.columns.type", width: "15%" },
  {
    field: "enabled",
    headerName: "businessData.service.columns.enabled",
    type: "boolean",
    width: "10%",
  },
  {
    field: "state",
    headerName: "businessData.service.columns.state",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
    width: "10%",
  },
];

function useServiceList(params: ListQueryParams): ListQueryResult<ServiceRecord> {
  const query = useServices({
    q: params.filters?.q,
    state: params.filters?.state,
  });
  return {
    data: query.data ? { data: query.data, meta: { total: query.data.length } } : undefined,
    isLoading: query.isLoading,
  };
}

export function ServiceListPage() {
  const { t } = useAppTranslation();
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/service/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <DataListPage
        icon={<Wrench24Regular />}
        titleKey="businessData.service.pageLabel"
        listTitleKey="businessData.service.listTitle"
        actions={[
          { ...createAction, onClick: () => setCreateOpen(true) },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useServiceList}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      <ServiceFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("businessData.service.dialogs.form.createTitle")}
        submitLabel={t("actionBar.create")}
      />
    </>
  );
}
