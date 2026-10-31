import type { ChartContextElement } from "@/api";
import { Button, Checkbox, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { MiniSelect } from "../../components/MiniSelect";
import type { OperationValues } from "../../components/operationTypes";
import { ELEMENT_TYPE_OPTIONS } from "../chartLookups";
import { useDialogStyles } from "./dialogStyles";

export interface ContextElementRow extends ChartContextElement {
  id: number;
}

export function ContextListEditor({
  values,
  onChange,
}: {
  values: OperationValues;
  onChange: (key: string, value: string | number | boolean) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const rows = (values.contexts as unknown as ContextElementRow[] | undefined) ?? [];
  const setRows = (next: ContextElementRow[]) => onChange("contexts", next as unknown as boolean);
  const addRow = () =>
    setRows([
      ...rows,
      {
        id: Date.now() + rows.length,
        keyOrder: rows.length + 1,
        isKey: false,
        name: "",
        description: "",
        elementType: "FreeText",
        source: "",
      },
    ]);
  const removeRow = (id: number) => setRows(rows.filter((r) => r.id !== id));
  const update = (id: number, patch: Partial<ContextElementRow>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div>
      <div className={styles.hint}>{t("businessData.chart.operations.contextsHint")}</div>
      {rows.length === 0 && (
        <div className={styles.empty}>{t("businessData.chart.operations.noContexts")}</div>
      )}
      {rows.map((row) => (
        <div key={row.id} className={styles.contextRow}>
          <Input
            type="number"
            value={String(row.keyOrder)}
            onChange={(_, d) => update(row.id, { keyOrder: Number(d.value) || 0 })}
            aria-label={t("businessData.chart.operations.keyOrder")}
          />
          <Checkbox
            label={t("businessData.chart.operations.isKey")}
            checked={row.isKey}
            onChange={() => update(row.id, { isKey: !row.isKey })}
          />
          <Input
            placeholder={t("businessData.chart.operations.contextName")}
            value={row.name}
            onChange={(_, d) => update(row.id, { name: d.value })}
          />
          <Input
            placeholder={t("businessData.chart.operations.contextDescription")}
            value={row.description}
            onChange={(_, d) => update(row.id, { description: d.value })}
          />
          <MiniSelect
            value={row.elementType}
            options={ELEMENT_TYPE_OPTIONS}
            onSelect={(v) => update(row.id, { elementType: v as ContextElementRow["elementType"] })}
          />
          <Input
            placeholder={t("businessData.chart.operations.contextSource")}
            value={row.source}
            onChange={(_, d) => update(row.id, { source: d.value })}
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

export function ReadingsEditor({
  values,
  onChange,
  count,
}: {
  values: OperationValues;
  onChange: (key: string, value: string | number | boolean) => void;
  count: number;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const readings = (values.readings as unknown as (number | "")[] | undefined) ?? [];
  const setReadings = (next: (number | "")[]) => onChange("readings", next as unknown as boolean);
  const setAt = (index: number, raw: string) => {
    const next = Array.from({ length: count }, (_, i) => readings[i] ?? "");
    next[index] = raw === "" ? "" : Number(raw);
    setReadings(next);
  };
  return (
    <div>
      <div className={styles.hint}>{t("businessData.chart.operations.readingsHint")}</div>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={styles.readingRow}>
          <span style={{ minWidth: "110px", fontSize: "13px" }}>
            {t("businessData.chart.operations.reading", { index: i + 1 })}
          </span>
          <Input
            type="number"
            value={readings[i] === undefined || readings[i] === "" ? "" : String(readings[i])}
            onChange={(_, d) => setAt(i, d.value)}
          />
        </div>
      ))}
    </div>
  );
}

export function PostContextEditor({
  values,
  onChange,
  contexts,
}: {
  values: OperationValues;
  onChange: (key: string, value: string | number | boolean) => void;
  contexts: ChartContextElement[];
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const map = (values.contextValues as unknown as Record<string, string> | undefined) ?? {};
  const setValue = (name: string, value: string) =>
    onChange("contextValues", { ...map, [name]: value } as unknown as boolean);
  return (
    <div>
      <div className={styles.hint}>{t("businessData.chart.operations.postContextHint")}</div>
      {contexts.map((c) => (
        <div key={c.name} className={styles.fieldRow}>
          <span className={styles.fieldLabel}>
            {c.name}
            {c.isKey ? " *" : ""}
          </span>
          <Input value={map[c.name] ?? ""} onChange={(_, d) => setValue(c.name, d.value)} />
        </div>
      ))}
    </div>
  );
}
