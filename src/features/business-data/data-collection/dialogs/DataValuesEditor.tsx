import { Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { OperationValues } from "../../components/operationTypes";
import { useDialogStyles } from "./dialogStyles";

export interface DataValueRow {
  parameter: string;
  value: string;
}

export function DataValuesEditor({
  parameters,
  values,
  onChange,
}: {
  parameters: { parameter: string; isOptional: boolean }[];
  values: OperationValues;
  onChange: (key: string, value: string | number | boolean) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const rows = (values.dataValues as unknown as DataValueRow[] | undefined) ?? [];
  const valueOf = (parameter: string) => rows.find((r) => r.parameter === parameter)?.value ?? "";
  const setValue = (parameter: string, value: string) => {
    const next = rows.some((r) => r.parameter === parameter)
      ? rows.map((r) => (r.parameter === parameter ? { ...r, value } : r))
      : [...rows, { parameter, value }];
    onChange("dataValues", next as unknown as boolean);
  };

  return (
    <div>
      <div className={styles.hint}>
        {t("businessData.dataCollection.operations.dataValuesHint")}
      </div>
      {parameters.length === 0 && (
        <div className={styles.empty}>
          {t("businessData.dataCollection.operations.noParameters")}
        </div>
      )}
      {parameters.map((p) => (
        <div key={p.parameter} className={styles.fieldRow}>
          <span className={styles.fieldLabel}>
            {p.parameter}
            {p.isOptional ? "" : " *"}
          </span>
          <Input value={valueOf(p.parameter)} onChange={(_, d) => setValue(p.parameter, d.value)} />
        </div>
      ))}
    </div>
  );
}
