import { useCertifications } from "@/api";
import type { CertificationRecord } from "@/api";
import {
  DataListPage,
  createAction,
  defaultListFilters,
  exportAction,
  importAction,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { useCertificationDialogs } from "./useCertificationDialogs";

const COLUMNS: DataColumn<CertificationRecord>[] = [
  {
    field: "name",
    headerName: "businessData.certification.columns.name",
    type: "link",
    locked: true,
    width: "30%",
  },
  {
    field: "description",
    headerName: "businessData.certification.columns.description",
    width: "30%",
  },
  { field: "type", headerName: "businessData.certification.columns.type", width: "20%" },
  { field: "state", headerName: "businessData.certification.columns.state", width: "20%" },
];

export function CertificationListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/certification/$name", openRoute);
  const { dialogs, openCreate } = useCertificationDialogs();
  return (
    <>
      <DataListPage
        icon={<Box24Regular />}
        titleKey="businessData.certification.pageLabel"
        listTitleKey="businessData.certification.listTitle"
        actions={[
          { ...createAction, onClick: openCreate },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useCertifications}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      {dialogs}
    </>
  );
}
