import { useState } from "react";
import { useShiftDefinitions } from "@/api";
import type { ShiftDefinitionRecord } from "@/api";
import {
  defaultListFilters,
  DataListPage,
  exportAction,
  importAction,
  newFromTemplateAction,
  newTemplateAction,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
} from "@/components/common";
import type { DataColumn, HeaderAction } from "@/components/common";
import { Add24Regular, Timer24Regular } from "@/components/icons";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { ShiftDefinitionCreateWizard } from "./dialogs/ShiftDefinitionCreateWizard";

const COLUMNS: DataColumn<ShiftDefinitionRecord>[] = [
  {
    field: "name",
    headerName: "businessData.shiftDefinition.columns.name",
    type: "link",
    locked: true,
    width: "30%",
  },
  {
    field: "description",
    headerName: "businessData.shiftDefinition.columns.description",
    width: "30%",
  },
  { field: "calendar", headerName: "businessData.shiftDefinition.columns.calendar", width: "15%" },
  {
    field: "startTime",
    headerName: "businessData.shiftDefinition.columns.startTime",
    width: "12%",
  },
  {
    field: "state",
    headerName: "businessData.shiftDefinition.columns.state",
    width: "13%",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
  },
];

export function ShiftDefinitionListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/shift-definition/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);

  const createWithDialog: HeaderAction = {
    id: "create",
    icon: <Add24Regular />,
    labelKey: "actionBar.create",
    onClick: () => setCreateOpen(true),
  };

  return (
    <>
      <DataListPage
        filters={defaultListFilters}
        icon={<Timer24Regular />}
        titleKey="businessData.shiftDefinition.pageLabel"
        listTitleKey="businessData.shiftDefinition.listTitle"
        actions={[
          createWithDialog,
          newTemplateAction,
          newFromTemplateAction,
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        useListQuery={useShiftDefinitions}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      {createOpen && <ShiftDefinitionCreateWizard onClose={() => setCreateOpen(false)} />}
    </>
  );
}
