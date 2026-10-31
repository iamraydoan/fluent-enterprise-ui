import { useState } from "react";
import { useDataSilos } from "@/api";
import type { DataSiloRecord } from "@/api";
import {
  RECORD_STATE_COLUMN_OPTIONS,
  DataListPage,
  createAction,
  defaultListFilters,
  exportAction,
  importAction,
  refreshAction,
} from "@/components/common";
import type { DataColumn, HeaderAction } from "@/components/common";
import { Database20Regular } from "@/components/icons";
import type { TranslationKey } from "@/i18n";
import type { ListQueryParams } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { CreateDataSiloDialog } from "./DataSiloDialogs";

const COLUMNS: DataColumn<DataSiloRecord>[] = [
  {
    field: "name",
    headerName: "businessData.dataSilo.columns.name" as TranslationKey,
    type: "link",
    locked: true,
    width: "25%",
  },
  {
    field: "description",
    headerName: "businessData.dataSilo.columns.description" as TranslationKey,
    width: "25%",
  },
  {
    field: "type",
    headerName: "businessData.dataSilo.columns.type" as TranslationKey,
    width: "12%",
  },
  {
    field: "enterpriseName",
    headerName: "businessData.dataSilo.columns.enterpriseName" as TranslationKey,
    width: "13%",
  },
  {
    field: "siteName",
    headerName: "businessData.dataSilo.columns.siteName" as TranslationKey,
    width: "13%",
  },
  {
    field: "state",
    headerName: "businessData.dataSilo.columns.state" as TranslationKey,
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
    width: "12%",
  },
];

function useSiloListQuery(params: ListQueryParams) {
  return useDataSilos(params);
}

export function DataSiloListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/data-silo/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);

  const createWithDialog: HeaderAction = {
    ...createAction,
    onClick: () => setCreateOpen(true),
  };

  return (
    <>
      <DataListPage
        icon={<Database20Regular />}
        titleKey={"businessData.dataSilo.pageLabel" as TranslationKey}
        listTitleKey={"businessData.dataSilo.listTitle" as TranslationKey}
        actions={[createWithDialog, refreshAction, importAction, exportAction]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useSiloListQuery}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      {createOpen && <CreateDataSiloDialog onClose={() => setCreateOpen(false)} />}
    </>
  );
}
