import { useState } from "react";
import { useResources } from "@/api";
import type { ResourceRecord } from "@/api";
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
import { ResourceFormDialog } from "./dialogs/ResourceFormDialog";

const COLUMNS: DataColumn<ResourceRecord>[] = [
  {
    field: "name",
    headerName: "businessData.resource.columns.name",
    type: "link",
    locked: true,
    width: "25%",
  },
  {
    field: "description",
    headerName: "businessData.resource.columns.description",
    width: "25%",
  },
  { field: "type", headerName: "businessData.resource.columns.type", width: "15%" },
  {
    field: "processingType",
    headerName: "businessData.resource.columns.processingType",
    width: "15%",
  },
  {
    field: "systemState",
    headerName: "businessData.resource.columns.systemState",
    width: "10%",
  },
  {
    field: "state",
    headerName: "businessData.resource.columns.state",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
    width: "10%",
  },
];

function useResourceList(params: ListQueryParams): ListQueryResult<ResourceRecord> {
  const query = useResources({
    q: params.filters?.q,
    state: params.filters?.state,
  });
  return {
    data: query.data ? { data: query.data, meta: { total: query.data.length } } : undefined,
    isLoading: query.isLoading,
  };
}

export function ResourceListPage() {
  const { t } = useAppTranslation();
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/resource/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <DataListPage
        icon={<Wrench24Regular />}
        titleKey="businessData.resource.pageLabel"
        listTitleKey="businessData.resource.listTitle"
        actions={[
          { ...createAction, onClick: () => setCreateOpen(true) },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useResourceList}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      <ResourceFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("businessData.resource.dialogs.form.createTitle")}
        submitLabel={t("actionBar.create")}
      />
    </>
  );
}
