import type { RowData } from "@tanstack/react-table";
import type { ReactElement, ReactNode } from "react";
import { ListPage } from "@/components/common/ListPage";
import type { HeaderAction } from "@/components/common/ListPageHeader";
import { DataTableCard } from "@/components/common/data-table/DataTableCard";
import type { DataTableCardApi } from "@/components/common/data-table/DataTableCard";
import type { DataColumn } from "@/components/common/data-table/columns";
import { defaultListFilters } from "@/components/common/data-table/filters";
import type { DataFilter } from "@/components/common/data-table/filters";
import { makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import type { ListQueryParams, ListQueryResult } from "@/lib/listQuery";

const useListLayoutStyles = makeStyles({
  body: { display: "flex", columnGap: "10px", flexGrow: 1, minHeight: 0 },
  sidebar: { display: "flex", flexDirection: "column", minHeight: 0 },
  main: { flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column" },
});

export interface DataListPageProps<TRow extends RowData> {
  icon: ReactElement;
  titleKey: TranslationKey;
  listTitleKey: TranslationKey;
  actions: readonly HeaderAction[];
  columns: DataColumn<TRow>[];
  filters?: DataFilter[];
  useListQuery: (params: ListQueryParams) => ListQueryResult<TRow>;
  getRowId?: (row: TRow) => string;
  onRowClick?: (row: TRow) => void;
  apiRef?: { current: DataTableCardApi | null };
  sidebar?: ReactNode;
}

export function DataListPage<TRow extends RowData>({
  icon,
  titleKey,
  listTitleKey,
  actions,
  columns,
  filters = defaultListFilters,
  useListQuery,
  getRowId,
  onRowClick,
  apiRef,
  sidebar,
}: DataListPageProps<TRow>) {
  const { t } = useAppTranslation();
  const styles = useListLayoutStyles();
  const table = (
    <DataTableCard
      title={(count) => t(listTitleKey, { count })}
      ariaLabel={t(titleKey)}
      columns={columns}
      filters={filters}
      useListQuery={useListQuery}
      getRowId={getRowId}
      onRowClick={onRowClick}
      apiRef={apiRef}
    />
  );
  return (
    <ListPage header={{ icon, title: t(titleKey), actions }}>
      {sidebar ? (
        <div className={styles.body}>
          <div className={styles.sidebar}>{sidebar}</div>
          <div className={styles.main}>{table}</div>
        </div>
      ) : (
        table
      )}
    </ListPage>
  );
}
