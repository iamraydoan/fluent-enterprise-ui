import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  makeStyles,
  tokens,
} from "@/components/ui";
import type { TranslationKey } from "@/i18n";

const useGridStyles = makeStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
    flexGrow: 1,
  },
  scroll: {
    overflow: "auto",
    flexGrow: 1,
    minHeight: 0,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  headerCell: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: "12px",
    textTransform: "uppercase",
    color: tokens.colorNeutralForeground3,
    whiteSpace: "nowrap",
  },
  rowSelected: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
  },
});

export interface FabGridColumn<TRow> {
  key: string;
  headerKey: string;
  width?: string;
  render: (row: TRow) => React.ReactNode;
}

interface FabGridProps<TRow> {
  columns: FabGridColumn<TRow>[];
  rows: TRow[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  getRowId: (row: TRow) => string;
  selectedLabel: string;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  t: (key: TranslationKey, options?: Record<string, unknown>) => string;
}

export function FabGrid<TRow>({
  columns,
  rows,
  selectedIds,
  onToggle,
  onToggleAll,
  getRowId,
  selectedLabel,
  page,
  totalPages,
  total,
  onPageChange,
  t,
}: FabGridProps<TRow>) {
  const styles = useGridStyles();
  const allSelected = rows.length > 0 && rows.every((r) => selectedIds.has(getRowId(r)));

  return (
    <div className={styles.wrapper}>
      <div className={styles.scroll}>
        <Table aria-label={selectedLabel}>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>
                <Checkbox checked={allSelected} onChange={onToggleAll} />
              </TableHeaderCell>
              {columns.map((col) => (
                <TableHeaderCell key={col.key} className={styles.headerCell}>
                  {col.headerKey}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const id = getRowId(row);
              const selected = selectedIds.has(id);
              return (
                <TableRow key={id} className={selected ? styles.rowSelected : undefined}>
                  <TableCell>
                    <Checkbox checked={selected} onChange={() => onToggle(id)} aria-label={id} />
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell key={col.key}>{col.render(row)}</TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          columnGap: "16px",
          padding: "8px 4px 0",
          fontSize: "13px",
        }}
      >
        <Text size={300}>{selectedLabel}</Text>
        <Text size={300}>
          {t("common.pageOf", { page, pages: totalPages })} ({total})
        </Text>
        <Text
          size={300}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          style={{ cursor: page > 1 ? "pointer" : "default", opacity: page > 1 ? 1 : 0.4 }}
        >
          {"<"}
        </Text>
        <Text
          size={300}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          style={{
            cursor: page < totalPages ? "pointer" : "default",
            opacity: page < totalPages ? 1 : 0.4,
          }}
        >
          {">"}
        </Text>
      </div>
    </div>
  );
}
