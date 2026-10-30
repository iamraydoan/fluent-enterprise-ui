import { useState } from "react";
import { useResourceJobs } from "@/api";
import type { ResourceJobRecord } from "@/api";
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
import { ResourceJobFormDialog } from "./dialogs/ResourceJobFormDialog";

const COLUMNS: DataColumn<ResourceJobRecord>[] = [
  {
    field: "name",
    headerName: "businessData.resourceJob.columns.name",
    type: "link",
    locked: true,
    width: "20%",
  },
  {
    field: "description",
    headerName: "businessData.resourceJob.columns.description",
    width: "25%",
  },
  {
    field: "resource",
    headerName: "businessData.resourceJob.columns.resource",
    width: "15%",
  },
  { field: "type", headerName: "businessData.resourceJob.columns.type", width: "15%" },
  {
    field: "systemState",
    headerName: "businessData.resourceJob.columns.systemState",
    width: "15%",
  },
  {
    field: "state",
    headerName: "businessData.resourceJob.columns.state",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
    width: "10%",
  },
];

function useResourceJobList(params: ListQueryParams): ListQueryResult<ResourceJobRecord> {
  const query = useResourceJobs({
    q: params.filters?.q,
    state: params.filters?.state,
  });
  return {
    data: query.data ? { data: query.data, meta: { total: query.data.length } } : undefined,
    isLoading: query.isLoading,
  };
}

export function ResourceJobListPage() {
  const { t } = useAppTranslation();
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/resource-job/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <DataListPage
        icon={<Wrench24Regular />}
        titleKey="businessData.resourceJob.pageLabel"
        listTitleKey="businessData.resourceJob.listTitle"
        actions={[
          { ...createAction, onClick: () => setCreateOpen(true) },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useResourceJobList}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      <ResourceJobFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("businessData.resourceJob.dialogs.form.createTitle")}
        submitLabel={t("actionBar.create")}
      />
    </>
  );
}
