import { useState } from "react";
import { useExperimentDefinitions } from "@/api";
import type { ExperimentDefinitionRecord } from "@/api";
import {
  RECORD_STATE_COLUMN_OPTIONS,
  DataListPage,
  createAction,
  defaultListFilters,
  exportAction,
  importAction,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import type { TranslationKey } from "@/i18n";
import type { ListQueryParams } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { ExperimentDefinitionDialog } from "./ExperimentDefinitionDialog";
import { MODE_CREATE } from "./wizardMode";

const tk = (key: string) => key as TranslationKey;

const COLUMNS: DataColumn<ExperimentDefinitionRecord>[] = [
  {
    field: "name",
    headerName: tk("businessData.experimentDefinition.columns.name"),
    type: "link",
    locked: true,
    width: "30%",
  },
  {
    field: "description",
    headerName: tk("businessData.experimentDefinition.columns.description"),
    width: "25%",
  },
  { field: "type", headerName: tk("businessData.experimentDefinition.columns.type"), width: "15%" },
  {
    field: "product",
    headerName: tk("businessData.experimentDefinition.columns.product"),
    width: "20%",
  },
  {
    field: "state",
    headerName: tk("businessData.experimentDefinition.columns.state"),
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
    width: "10%",
  },
];

function useExperimentDefinitionListQuery(params: ListQueryParams) {
  return useExperimentDefinitions(params);
}

export function ExperimentDefinitionListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/experiment-definition/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);
  return (
    <>
      <DataListPage
        icon={<Box24Regular />}
        titleKey={tk("businessData.experimentDefinition.pageLabel")}
        listTitleKey={tk("businessData.experimentDefinition.listTitle")}
        actions={[
          { ...createAction, onClick: () => setCreateOpen(true) },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useExperimentDefinitionListQuery}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      {createOpen && (
        <ExperimentDefinitionDialog mode={MODE_CREATE} onClose={() => setCreateOpen(false)} />
      )}
    </>
  );
}
