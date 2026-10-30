import { useBusinessPartners } from "@/api";
import type { BusinessPartnerRecord } from "@/api";
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
import { useBusinessPartnerDialogs } from "./useBusinessPartnerDialogs";

const COLUMNS: DataColumn<BusinessPartnerRecord>[] = [
  {
    field: "name",
    headerName: "businessData.businessPartner.columns.name",
    type: "link",
    locked: true,
    width: "30%",
  },
  {
    field: "description",
    headerName: "businessData.businessPartner.columns.description",
    width: "30%",
  },
  { field: "role", headerName: "businessData.businessPartner.columns.role", width: "20%" },
  { field: "state", headerName: "businessData.businessPartner.columns.state", width: "20%" },
];

export function BusinessPartnerListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/business-partner/$name", openRoute);
  const { dialogs, openCreate } = useBusinessPartnerDialogs();
  return (
    <>
      <DataListPage
        icon={<Box24Regular />}
        titleKey="businessData.businessPartner.pageLabel"
        listTitleKey="businessData.businessPartner.listTitle"
        actions={[
          { ...createAction, onClick: openCreate },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useBusinessPartners}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      {dialogs}
    </>
  );
}
