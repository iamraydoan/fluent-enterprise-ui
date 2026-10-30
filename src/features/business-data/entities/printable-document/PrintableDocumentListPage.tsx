import { usePrintableDocuments } from "@/api";
import type { PrintableDocumentRecord } from "@/api";
import {
  createAction,
  DataListPage,
  defaultListFilters,
  exportAction,
  importAction,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

const COLUMNS: DataColumn<PrintableDocumentRecord>[] = [
  { field: "name", headerName: "businessData.printableDocument.columns.name", type: "link", locked: true, width: "24%" },
  { field: "description", headerName: "businessData.printableDocument.columns.description", width: "30%" },
  { field: "documentType", headerName: "businessData.printableDocument.columns.documentType", width: "20%" },
  { field: "state", headerName: "businessData.printableDocument.columns.state", width: "13%" },
  { field: "version", headerName: "businessData.printableDocument.columns.version", width: "13%" },
];

export function PrintableDocumentListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/printable-document/$name", openRoute);
  return (
    <DataListPage<PrintableDocumentRecord>
      icon={<Box24Regular />}
      titleKey="businessData.printableDocument.pageLabel"
      listTitleKey="businessData.printableDocument.listTitle"
      actions={[createAction, refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      filters={defaultListFilters}
      useListQuery={usePrintableDocuments}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
