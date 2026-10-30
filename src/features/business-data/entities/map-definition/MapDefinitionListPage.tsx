import { useState } from "react";
import { useMapDefinitions } from "@/api";
import type { MapDefinitionRecord } from "@/api";
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
import { Grid24Regular } from "@/components/icons";
import type { TranslationKey } from "@/i18n";
import type { ListQueryParams } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { MapDefinitionWizardDialog } from "./MapDefinitionWizardDialog";
import { MODE_CREATE } from "./wizardMode";

const tk = (key: string) => key as TranslationKey;

const COLUMNS: DataColumn<MapDefinitionRecord>[] = [
  { field: "name", headerName: tk("businessData.mapDefinition.columns.name"), type: "link", locked: true, width: "35%" },
  { field: "description", headerName: tk("businessData.mapDefinition.columns.description"), width: "35%" },
  { field: "type", headerName: tk("businessData.mapDefinition.columns.type"), width: "15%" },
  { field: "state", headerName: tk("businessData.mapDefinition.columns.state"), type: "enum", enumOptions: RECORD_STATE_COLUMN_OPTIONS, width: "15%" },
];

function useMapDefinitionListQuery(params: ListQueryParams) {
  return useMapDefinitions(params);
}

export function MapDefinitionListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/map-definition/$name", openRoute);
  const [wizardOpen, setWizardOpen] = useState(false);
  const createWithWizard: HeaderAction = {
    ...createAction,
    onClick: () => setWizardOpen(true),
  };
  return (
    <>
      <DataListPage
        icon={<Grid24Regular />}
        titleKey={tk("businessData.mapDefinition.pageLabel")}
        listTitleKey={tk("businessData.mapDefinition.listTitle")}
        actions={[createWithWizard, refreshAction, importAction, exportAction]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useMapDefinitionListQuery}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      {wizardOpen && (
        <MapDefinitionWizardDialog mode={MODE_CREATE} onClose={() => setWizardOpen(false)} />
      )}
    </>
  );
}
