import { useTransferRequirements } from "@/api";
import type { TransferRequirementRecord } from "@/api";
import {
  DataListPage,
  exportAction,
  importAction,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { ArrowExportUp24Regular } from "@/components/icons";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

const COLUMNS: DataColumn<TransferRequirementRecord>[] = [
  {
    field: "name",
    headerName: "businessData.transferRequirement.columns.name",
    type: "link",
    locked: true,
    width: "16%",
  },
  {
    field: "description",
    headerName: "businessData.transferRequirement.columns.description",
    width: "24%",
  },
  {
    field: "sourceLocation",
    headerName: "businessData.transferRequirement.columns.sourceLocation",
    width: "16%",
  },
  {
    field: "destinationLocation",
    headerName: "businessData.transferRequirement.columns.destinationLocation",
    width: "16%",
  },
  {
    field: "requirementState",
    headerName: "businessData.transferRequirement.columns.requirementState",
    width: "14%",
  },
  {
    field: "state",
    headerName: "businessData.transferRequirement.columns.state",
    width: "14%",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
  },
];

export function TransferRequirementListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/transfer-requirement/$name", openRoute);

  return (
    <DataListPage
      icon={<ArrowExportUp24Regular />}
      titleKey="businessData.transferRequirement.pageLabel"
      listTitleKey="businessData.transferRequirement.listTitle"
      actions={[refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      useListQuery={useTransferRequirements}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
