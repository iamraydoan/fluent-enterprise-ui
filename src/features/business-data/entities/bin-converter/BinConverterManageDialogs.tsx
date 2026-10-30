import { Button, Input, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { OperationValues } from "../../components/operationTypes";

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
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr)) auto",
    columnGap: "8px",
    alignItems: "center",
    marginBottom: "8px",
  },
  empty: { padding: "16px", textAlign: "center", color: tokens.colorNeutralForeground3 },
  hint: { fontSize: "13px", color: tokens.colorNeutralForeground2, marginBottom: "12px" },
});

export function BinConversionListEditor({
  values,
  onChange,
}: {
  values: OperationValues;
  onChange: (key: string, value: string | number | boolean) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useListStyles();
  const rows = (values.conversions as unknown as BinConversionRow[] | undefined) ?? [];

  const setRows = (next: BinConversionRow[]) => onChange("conversions", next as unknown as boolean);

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
        <div className={styles.empty}>{t("businessData.binConverter.operations.noConversions")}</div>
      )}
      {rows.map((row) => (
        <div key={row.id} className={styles.row}>
          <Input
            placeholder={t("businessData.binConverter.operations.fromBinCode")}
            value={row.fromBinCode}
            onChange={(_, data) => updateRow(row.id, { fromBinCode: data.value })}
          />
          <Input
            placeholder={t("businessData.binConverter.operations.toBinCode")}
            value={row.toBinCode}
            onChange={(_, data) => updateRow(row.id, { toBinCode: data.value })}
          />
          <Input
            placeholder={t("businessData.binConverter.operations.toBinDescription")}
            value={row.toBinDescription}
            onChange={(_, data) => updateRow(row.id, { toBinDescription: data.value })}
          />
          <Input
            placeholder={t("businessData.binConverter.operations.toBinQuality")}
            value={row.toBinQuality}
            onChange={(_, data) => updateRow(row.id, { toBinQuality: data.value })}
          />
          <Input
            placeholder={t("businessData.binConverter.operations.toBinColor")}
            value={row.toBinColor}
            onChange={(_, data) => updateRow(row.id, { toBinColor: data.value })}
          />
          <Button appearance="secondary" onClick={() => removeRow(row.id)}>
            {t("common.remove")}
          </Button>
        </div>
      ))}
      <Button appearance="secondary" onClick={addRow}>
        {t("common.add")}
      </Button>
    </div>
  );
}
