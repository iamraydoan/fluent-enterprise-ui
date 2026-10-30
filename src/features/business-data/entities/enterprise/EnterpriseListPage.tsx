import { useState } from "react";
import { useEnterprises } from "@/api";
import type { EnterpriseRecord } from "@/api";
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
import { EnterpriseDialog } from "./EnterpriseDialog";
import { MODE_CREATE } from "./wizardMode";

const tk = (key: string) => key as TranslationKey;

const COLUMNS: DataColumn<EnterpriseRecord>[] = [
  { field: "name", headerName: tk("businessData.enterprise.columns.name"), type: "link", locked: true, width: "35%" },
  { field: "description", headerName: tk("businessData.enterprise.columns.description"), width: "30%" },
  { field: "dataGroup", headerName: tk("businessData.enterprise.columns.dataGroup"), width: "20%" },
  { field: "state", headerName: tk("businessData.enterprise.columns.state"), type: "enum", enumOptions: RECORD_STATE_COLUMN_OPTIONS, width: "15%" },
];

function useEnterpriseListQuery(params: ListQueryParams) {
  return useEnterprises(params);
}

export function EnterpriseListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/enterprise/$name", openRoute);
  const [showCreate, setShowCreate] = useState(false);
  return (
    <>
      <DataListPage
        icon={<Organization24Regular />}
        titleKey={tk("businessData.enterprise.pageLabel")}
        listTitleKey={tk("businessData.enterprise.listTitle")}
        actions={[{ ...createAction, onClick: () => setShowCreate(true) }, refreshAction, importAction, exportAction]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useEnterpriseListQuery}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      {showCreate && <EnterpriseDialog mode={MODE_CREATE} onClose={() => setShowCreate(false)} />}
    </>
  );
}
