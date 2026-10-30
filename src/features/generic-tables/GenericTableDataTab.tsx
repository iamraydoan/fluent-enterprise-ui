import { useState } from "react";
import type { GenericTableDetail } from "@/api";
import { Add24Regular, ArrowSync20Regular } from "@/components/icons";
import {
  Button,
  Checkbox,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  tokens,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";

const useGridStyles = makeStyles({
  toolbar: {
    display: "flex",
    alignItems: "center",
    columnGap: "4px",
    padding: "8px 0",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    marginBottom: "12px",
  },
  title: { fontSize: "15px", fontWeight: tokens.fontWeightSemibold, marginBottom: "8px" },
  scroll: {
    overflow: "auto",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  th: {
    backgroundColor: "#EFEFEF",
    fontSize: "12px",
    fontWeight: 400,
    textTransform: "uppercase",
    padding: "8px 12px",
    textAlign: "left",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  td: {
    padding: "8px 12px",
    fontSize: "13px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  boolTrue: { color: tokens.colorPaletteGreenForeground1 },
  boolFalse: { color: tokens.colorNeutralForeground3 },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    columnGap: "16px",
    padding: "8px 0",
    fontSize: "13px",
    color: tokens.colorNeutralForeground2,
  },
});

function formatCell(value: unknown, dataType: string): string {
  if (value === null || value === undefined || value === "") return "";
  if (dataType === "boolean") return value ? "✓" : "✗";
  return String(value);
}

export function GenericTableDataTab({ table }: { table: GenericTableDetail }) {
  const { t } = useAppTranslation();
  const styles = useGridStyles();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const keyColumn = table.columns.find((col) => col.isKey);
  const toggle = (key: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const toggleAll = () =>
    setSelected((current) =>
      current.size === table.rows.length
        ? new Set()
        : new Set(table.rows.map((row) => String(row[keyColumn?.name ?? ""]))),
    );

  return (
    <div>
      <div className={styles.toolbar}>
        <Button appearance="subtle" icon={<ArrowSync20Regular />}>
          {t("actionBar.refresh")}
        </Button>
        <Button appearance="subtle" icon={<Add24Regular />}>
          {t("genericTables.data.add")}
        </Button>
      </div>
      <div className={styles.title}>
        {t("genericTables.data.title", { name: table.name, count: table.rows.length })}
      </div>
      <div className={styles.scroll}>
        <Table style={{ width: "100%", borderCollapse: "collapse" }}>
          <TableHeader>
            <TableRow>
              <TableHeaderCell className={styles.th}>
                <Checkbox
                  checked={selected.size === table.rows.length && table.rows.length > 0}
                  onChange={(_, data) => {
                    if (data.checked) toggleAll();
                    else setSelected(new Set());
                  }}
                  aria-label={t("genericTables.data.selectAll")}
                />
              </TableHeaderCell>
              {table.columns.map((column) => (
                <TableHeaderCell key={column.name} className={styles.th}>
                  {column.name
                    .replace(/([A-Z])/g, " $1")
                    .trim()
                    .toUpperCase()}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.rows.map((row, index) => {
              const key = String(row[keyColumn?.name ?? ""] ?? index);
              return (
                <TableRow key={key}>
                  <TableCell className={styles.td}>
                    <Checkbox
                      checked={selected.has(key)}
                      onChange={() => toggle(key)}
                      aria-label={t("genericTables.data.selectRow", { row: key })}
                    />
                  </TableCell>
                  {table.columns.map((column) => (
                    <TableCell key={column.name} className={styles.td}>
                      {column.dataType === "boolean" ? (
                        <Text
                          className={row[column.name] ? styles.boolTrue : styles.boolFalse}
                          weight="semibold"
                        >
                          {formatCell(row[column.name], column.dataType)}
                        </Text>
                      ) : (
                        formatCell(row[column.name], column.dataType)
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className={styles.footer}>
        <span>{t("genericTables.data.selected", { count: selected.size })}</span>
        <span>{t("genericTables.data.total", { count: table.rows.length })}</span>
      </div>
    </div>
  );
}
