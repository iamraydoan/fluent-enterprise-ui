import { useState } from "react";
import { useRecipes } from "@/api";
import type { RecipeRecord } from "@/api";
import {
  createAction,
  DataListPage,
  defaultListFilters,
  exportAction,
  importAction,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
} from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Cube24Regular } from "@/components/icons";
import { useAppTranslation } from "@/i18n";
import type { ListQueryParams, ListQueryResult } from "@/lib/listQuery";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { RecipeFormDialog } from "./dialogs/RecipeFormDialog";

const COLUMNS: DataColumn<RecipeRecord>[] = [
  {
    field: "name",
    headerName: "businessData.recipe.columns.name",
    type: "link",
    locked: true,
    width: "30%",
  },
  {
    field: "description",
    headerName: "businessData.recipe.columns.description",
    width: "25%",
  },
  { field: "type", headerName: "businessData.recipe.columns.type", width: "15%" },
  {
    field: "isEnabled",
    headerName: "businessData.recipe.columns.isEnabled",
    type: "boolean",
    width: "15%",
  },
  {
    field: "state",
    headerName: "businessData.recipe.columns.state",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
    width: "15%",
  },
];

function useRecipeList(params: ListQueryParams): ListQueryResult<RecipeRecord> {
  const query = useRecipes({
    q: params.filters?.q,
    state: params.filters?.state,
  });
  return {
    data: query.data ? { data: query.data, meta: { total: query.data.length } } : undefined,
    isLoading: query.isLoading,
  };
}

export function RecipeListPage() {
  const { t } = useAppTranslation();
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/business-data/recipe/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <DataListPage
        icon={<Cube24Regular />}
        titleKey="businessData.recipe.pageLabel"
        listTitleKey="businessData.recipe.listTitle"
        actions={[
          { ...createAction, onClick: () => setCreateOpen(true) },
          refreshAction,
          importAction,
          exportAction,
        ]}
        columns={COLUMNS}
        filters={defaultListFilters}
        useListQuery={useRecipeList}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
      <RecipeFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("businessData.recipe.dialogs.form.createTitle")}
        submitLabel={t("actionBar.create")}
      />
    </>
  );
}
