import { useState } from "react";
import { useDocuments } from "@/api";
import type { DocumentRecord } from "@/api";
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
import { DocumentBulletList24Regular } from "@/components/icons";
import type { ListQueryParams } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { MODE_CREATE } from "../components/wizardMode";
import { DocumentWizardDialog } from "./DocumentDialogs";

const COLUMNS: DataColumn<DocumentRecord>[] = [
  {
    field: "name",
    headerName: "businessData.document.columns.name",
    type: "link",
    locked: true,
    width: "30%",
  },
  {
    field: "description",
    headerName: "businessData.document.columns.description",
    width: "25%",
  },
  { field: "type", headerName: "businessData.document.columns.type", width: "12%" },
  { field: "author", headerName: "businessData.document.columns.author", width: "13%" },
  {
    field: "creationDate",
    headerName: "businessData.document.columns.creationDate",
    type: "dateTime",
    width: "12%",
  },
  {
    field: "state",
    headerName: "businessData.document.columns.state",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
    width: "8%",
  },
];

function useDocumentListQuery(params: ListQueryParams) {
  return useDocuments(params);
}

export function DocumentListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/document/$name", openRoute);
  const [showCreate, setShowCreate] = useState(false);
  return (
    <>
      <DataListPage
        icon={<DocumentBulletList24Regular />}
        titleKey={"businessData.document.pageLabel"}
        listTitleKey={"businessData.document.listTitle"}
        actions={[
          { ...createAction, onClick: () => setShowCreate(true) },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useDocumentListQuery}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      {showCreate && (
        <DocumentWizardDialog mode={MODE_CREATE} onClose={() => setShowCreate(false)} />
      )}
    </>
  );
}
