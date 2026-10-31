import type { DataCollectionParameter } from "@/api";
import { ArrowDown16Regular, ArrowUp16Regular } from "@/components/icons";
import { Button, Checkbox, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { MiniSelect } from "../../components/MiniSelect";
import type { OperationValues } from "../../components/operationTypes";
import { LIMIT_CHECKING_MODES, PARAMETER_DATA_TYPES } from "../dataCollectionLookups";
import { useDialogStyles } from "./dialogStyles";

export interface DataCollectionParameterRow extends DataCollectionParameter {
  id: number;
}

const EMPTY_PARAMETER = (id: number): DataCollectionParameterRow => ({
  id,
  parameter: "",
  dataType: "FreeText",
  isOptional: false,
  minimumSamples: 1,
  maximumSamples: 1,
  minimumSampleReadings: 1,
  maximumSampleReadings: 1,
  limitChecking: "None",
});

export function DataCollectionParametersEditor({
  values,
  onChange,
  fieldKey = "parameters",
}: {
  values: OperationValues;
  onChange: (key: string, value: string | number | boolean) => void;
  fieldKey?: string;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const rows = (values[fieldKey] as unknown as DataCollectionParameterRow[] | undefined) ?? [];
  const setRows = (next: DataCollectionParameterRow[]) =>
    onChange(fieldKey, next as unknown as boolean);
  const addRow = () => setRows([...rows, EMPTY_PARAMETER(Date.now() + rows.length)]);
  const removeRow = (id: number) => setRows(rows.filter((r) => r.id !== id));
  const update = (id: number, patch: Partial<DataCollectionParameterRow>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const move = (idx: number, dir: -1 | 1) => {
    const next = [...rows];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    setRows(next);
  };

  return (
    <div>
      <div className={styles.hint}>
        {t("businessData.dataCollection.operations.parametersHint")}
      </div>
      {rows.length === 0 && (
        <div className={styles.empty}>
          {t("businessData.dataCollection.operations.noParameters")}
        </div>
      )}
      {rows.map((row, idx) => (
        <div key={row.id} className={styles.paramCard}>
          <div className={styles.paramRow}>
            <div className={styles.grow}>
              <div className={styles.miniLabel}>
                {t("businessData.dataCollection.operations.parameterName")}
              </div>
              <Input
                placeholder={t("businessData.dataCollection.operations.parameterName")}
                value={row.parameter}
                onChange={(_, d) => update(row.id, { parameter: d.value })}
              />
            </div>
            <div>
              <div className={styles.miniLabel}>
                {t("businessData.dataCollection.operations.dataType")}
              </div>
              <MiniSelect
                value={row.dataType}
                options={PARAMETER_DATA_TYPES.map((v) => ({ value: v, label: v }))}
                onSelect={(v) => update(row.id, { dataType: v })}
                ariaLabel={t("businessData.dataCollection.operations.dataType")}
              />
            </div>
            <Checkbox
              label={t("businessData.dataCollection.operations.optional")}
              checked={row.isOptional}
              onChange={() => update(row.id, { isOptional: !row.isOptional })}
            />
          </div>
          <div className={styles.paramRow}>
            <div className={styles.numWrap}>
              <div className={styles.miniLabel}>
                {t("businessData.dataCollection.operations.minSamples")}
              </div>
              <Input
                type="number"
                value={String(row.minimumSamples)}
                onChange={(_, d) => update(row.id, { minimumSamples: Number(d.value) })}
              />
            </div>
            <div className={styles.numWrap}>
              <div className={styles.miniLabel}>
                {t("businessData.dataCollection.operations.maxSamples")}
              </div>
              <Input
                type="number"
                value={String(row.maximumSamples)}
                onChange={(_, d) => update(row.id, { maximumSamples: Number(d.value) })}
              />
            </div>
            <div className={styles.numWrap}>
              <div className={styles.miniLabel}>
                {t("businessData.dataCollection.operations.minReadings")}
              </div>
              <Input
                type="number"
                value={String(row.minimumSampleReadings)}
                onChange={(_, d) => update(row.id, { minimumSampleReadings: Number(d.value) })}
              />
            </div>
            <div className={styles.numWrap}>
              <div className={styles.miniLabel}>
                {t("businessData.dataCollection.operations.maxReadings")}
              </div>
              <Input
                type="number"
                value={String(row.maximumSampleReadings)}
                onChange={(_, d) => update(row.id, { maximumSampleReadings: Number(d.value) })}
              />
            </div>
            <div>
              <div className={styles.miniLabel}>
                {t("businessData.dataCollection.operations.limitChecking")}
              </div>
              <MiniSelect
                value={row.limitChecking}
                options={LIMIT_CHECKING_MODES.map((v) => ({ value: v, label: v }))}
                onSelect={(v) => update(row.id, { limitChecking: v })}
                ariaLabel={t("businessData.dataCollection.operations.limitChecking")}
              />
            </div>
            <div className={styles.rowActions}>
              <Button
                appearance="secondary"
                size="small"
                disabled={idx === 0}
                onClick={() => move(idx, -1)}
              >
                <ArrowUp16Regular />
              </Button>
              <Button
                appearance="secondary"
                size="small"
                disabled={idx === rows.length - 1}
                onClick={() => move(idx, 1)}
              >
                <ArrowDown16Regular />
              </Button>
              <Button appearance="secondary" size="small" onClick={() => removeRow(row.id)}>
                {t("common.remove")}
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Button appearance="secondary" onClick={addRow}>
        {t("common.add")}
      </Button>
    </div>
  );
}
