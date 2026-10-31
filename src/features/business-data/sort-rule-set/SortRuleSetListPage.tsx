import { useSortRuleSets } from "@/api";
import type { SortRuleSetRecord } from "@/api";
import {
  defaultListFilters,
  DataListPage,
  exportAction,
  importAction,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { ArrowUp20Regular } from "@/components/icons";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";

const COLUMNS: DataColumn<SortRuleSetRecord>[] = [
  {
    field: "name",
    headerName: "businessData.sortRuleSet.columns.name",
    type: "link",
    locked: true,
    width: "32%",
  },
  {
    field: "description",
    headerName: "businessData.sortRuleSet.columns.description",
    width: "32%",
  },
  {
    field: "scope",
    headerName: "businessData.sortRuleSet.columns.scope",
    width: "18%",
  },
  {
    field: "state",
    headerName: "businessData.sortRuleSet.columns.state",
    width: "18%",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
  },
];

export function SortRuleSetListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/sort-rule-set/$name", openRoute);

  return (
    <DataListPage
      filters={defaultListFilters}
      icon={<ArrowUp20Regular />}
      titleKey="businessData.sortRuleSet.pageLabel"
      listTitleKey="businessData.sortRuleSet.listTitle"
      actions={[refreshAction, importAction, exportAction]}
      columns={COLUMNS}
      useListQuery={useSortRuleSets}
      getRowId={(row) => row.name}
      onRowClick={(row) => openDetail(row.name)}
    />
  );
}
