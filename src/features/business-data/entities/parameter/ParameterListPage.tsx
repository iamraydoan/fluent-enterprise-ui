import { useState } from "react";
import { useParameters } from "@/api";
import type { ParameterRecord } from "@/api";
import {
  DataListPage,
  defaultListFilters,
  exportAction,
  importAction,
  refreshAction,
} from "@/components/common";
import type { DataColumn, HeaderAction } from "@/components/common";
import { Add24Regular, Box24Regular } from "@/components/icons";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { CreateParameterDialog } from "./ParameterOperations";

const COLUMNS: DataColumn<ParameterRecord>[] = [
  {
    field: "name",
    headerName: "businessData.parameter.columns.name",
    type: "link",
    locked: true,
    width: "22%",
  },
  { field: "description", headerName: "businessData.parameter.columns.description", width: "28%" },
  { field: "dataType", headerName: "businessData.parameter.columns.dataType", width: "18%" },
  { field: "value", headerName: "businessData.parameter.columns.value", width: "20%" },
  { field: "state", headerName: "businessData.parameter.columns.state", width: "12%" },
];

const createParameterAction: HeaderAction = {
  id: "create",
  icon: <Add24Regular />,
  labelKey: "businessData.parameter.operations.create.title",
};

export function ParameterListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/parameter/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);
  return (
    <>
    <DataListPage<ParameterRecord>
      icon={<Box24Regular />}
      titleKey="businessData.parameter.pageLabel"
      listTitleKey="businessData.parameter.listTitle"
      actions={[
        { ...createParameterAction, onClick: () => setCreateOpen(true) },
        refreshAction,
        importAction,
        exportAction,
      ]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={useParameters}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
      <CreateParameterDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}
