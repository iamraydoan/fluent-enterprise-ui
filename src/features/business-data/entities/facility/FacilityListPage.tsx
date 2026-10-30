import { useState } from "react";
import { useFacilities } from "@/api";
import type { FacilityRecord } from "@/api";
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
import { Organization24Regular } from "@/components/icons";
import type { TranslationKey } from "@/i18n";
import type { ListQueryParams } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { FacilityDialog } from "./FacilityDialog";
import { MODE_CREATE } from "./wizardMode";

const tk = (key: string) => key as TranslationKey;

const COLUMNS: DataColumn<FacilityRecord>[] = [
  {
    field: "name",
    headerName: tk("businessData.facility.columns.name"),
    type: "link",
    locked: true,
    width: "35%",
  },
  {
    field: "description",
    headerName: tk("businessData.facility.columns.description"),
    width: "25%",
  },
  { field: "type", headerName: tk("businessData.facility.columns.type"), width: "15%" },
  { field: "site", headerName: tk("businessData.facility.columns.site"), width: "15%" },
  {
    field: "state",
    headerName: tk("businessData.facility.columns.state"),
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
    width: "10%",
  },
];

function useFacilityListQuery(params: ListQueryParams) {
  return useFacilities(params);
}

export function FacilityListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/facility/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);
  return (
    <>
      <DataListPage
        icon={<Organization24Regular />}
        titleKey={tk("businessData.facility.pageLabel")}
        listTitleKey={tk("businessData.facility.listTitle")}
        actions={[
          { ...createAction, onClick: () => setCreateOpen(true) },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useFacilityListQuery}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      {createOpen && <FacilityDialog mode={MODE_CREATE} onClose={() => setCreateOpen(false)} />}
    </>
  );
}
