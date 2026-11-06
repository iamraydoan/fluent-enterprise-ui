import { Empty, Grid } from "@/components/common";
import { Button, Input, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";
import type { OperationOnChange, OperationValues } from "../components/operationTypes";

export interface BinConversionRow {
  id: number;
  fromBinCode: string;
  toBinCode: string;
  toBinDescription: string;
  toBinQuality: string;
  toBinColor: string;
}

const useListStyles = makeStyles({
  row: {
    marginBottom: theme.spacing.sm,
  },
  hint: { fontSize: "13px", color: theme.color.textSecondary, marginBottom: theme.spacing.md },
});

export function BinConversionListEditor({
  values,
  onChange,
}: {
  values: OperationValues;
  onChange: OperationOnChange;
}) {
  const { t } = useAppTranslation();
  const styles = useListStyles();
  const rows = (values.conversions as unknown as BinConversionRow[] | undefined) ?? [];

  const setRows = (next: BinConversionRow[]) => onChange("conversions", next);

  const addRow = () =>
    setRows([
      ...rows,
      {
        id: Date.now() + rows.length,
        fromBinCode: "",
        toBinCode: "",
        toBinDescription: "",
        toBinQuality: "",
        toBinColor: "",
      },
    ]);

  const removeRow = (id: number) => setRows(rows.filter((row) => row.id !== id));

  const updateRow = (id: number, patch: Partial<BinConversionRow>) =>
    setRows(rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  return (
    <div>
      <div className={styles.hint}>{t("businessData.binConverter.operations.conversionsHint")}</div>
      {rows.length === 0 && (
        <Empty>{t("businessData.binConverter.operations.noConversions")}</Empty>
      )}
      {rows.map((row) => (
        <Grid
          columns="repeat(5, minmax(0, 1fr)) auto"
          gap="8px"
          align="center"
          key={row.id}
          className={styles.row}
        >
          <Input
            placeholder={t("businessData.binConverter.operations.fromBinCode")}
            value={row.fromBinCode}
            onChange={(value) => updateRow(row.id, { fromBinCode: value })}
          />
          <Input
            placeholder={t("businessData.binConverter.operations.toBinCode")}
            value={row.toBinCode}
            onChange={(value) => updateRow(row.id, { toBinCode: value })}
          />
          <Input
            placeholder={t("businessData.binConverter.operations.toBinDescription")}
            value={row.toBinDescription}
            onChange={(value) => updateRow(row.id, { toBinDescription: value })}
          />
          <Input
            placeholder={t("businessData.binConverter.operations.toBinQuality")}
            value={row.toBinQuality}
            onChange={(value) => updateRow(row.id, { toBinQuality: value })}
          />
          <Input
            placeholder={t("businessData.binConverter.operations.toBinColor")}
            value={row.toBinColor}
            onChange={(value) => updateRow(row.id, { toBinColor: value })}
          />
          <Button variant="secondary" onClick={() => removeRow(row.id)}>
            {t("common.remove")}
          </Button>
        </Grid>
      ))}
      <Button variant="secondary" onClick={addRow}>
        {t("common.add")}
      </Button>
    </div>
  );
}
