import { useState } from "react";
import type { ChartDetail } from "@/api";
import { Button, Input, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { DialogShell, NumField } from "./dialogShared";
import { useDialogStyles } from "./dialogStyles";

export interface CloneChartRow {
  id: number;
  name: string;
  parameter: string;
  type: string;
  description: string;
  lsl?: number;
  target?: number;
  usl?: number;
  centerline1?: number;
  centerline2?: number;
  stdDev?: number;
}

export function CloneChartDialog({
  open,
  chart,
  onClose,
  onClone,
}: {
  open: boolean;
  chart: ChartDetail | null;
  onClose: () => void;
  onClone: (rows: CloneChartRow[]) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [rows, setRows] = useState<CloneChartRow[]>([]);
  const addRow = () =>
    setRows([
      ...rows,
      {
        id: Date.now() + rows.length,
        name: chart ? `${chart.name} - Clone` : "",
        parameter: chart?.parameter ?? "",
        type: chart?.type ?? "",
        description: chart?.description ?? "",
        lsl: chart?.lsl,
        target: chart?.target,
        usl: chart?.usl,
        centerline1: chart?.centerline1,
        centerline2: chart?.centerline2,
        stdDev: chart?.stdDev,
      },
    ]);
  const removeRow = (id: number) => setRows(rows.filter((r) => r.id !== id));
  const update = (id: number, patch: Partial<CloneChartRow>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <DialogShell
      open={open}
      wide
      title={t("businessData.chart.operations.cloneTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            disabled={rows.length === 0 || rows.some((r) => r.name.trim() === "")}
            onClick={() => onClone(rows)}
          >
            {t("businessData.chart.operations.clone")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.chart.operations.cloneHint", { name: chart?.name ?? "" })}
      </div>
      {rows.length === 0 && (
        <div className={styles.empty}>{t("businessData.chart.operations.noCloneRows")}</div>
      )}
      {rows.map((row) => (
        <div
          key={row.id}
          style={{
            marginBottom: "12px",
            paddingBottom: "12px",
            borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
          }}
        >
          <div
            className={styles.ruleRow}
            style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) auto" }}
          >
            <Input
              placeholder={t("businessData.chart.detail.name")}
              value={row.name}
              onChange={(_, d) => update(row.id, { name: d.value })}
            />
            <Input
              placeholder={t("businessData.chart.detail.parameter")}
              value={row.parameter}
              onChange={(_, d) => update(row.id, { parameter: d.value })}
            />
            <Input
              placeholder={t("businessData.chart.detail.type")}
              value={row.type}
              onChange={(_, d) => update(row.id, { type: d.value })}
            />
            <Button appearance="secondary" onClick={() => removeRow(row.id)}>
              {t("common.remove")}
            </Button>
          </div>
          <div
            className={styles.ruleRow}
            style={{ gridTemplateColumns: "repeat(6, minmax(0,1fr))", marginTop: "8px" }}
          >
            <NumField
              label={t("businessData.chart.detail.lsl")}
              value={row.lsl}
              onChange={(v) => update(row.id, { lsl: v })}
            />
            <NumField
              label={t("businessData.chart.detail.target")}
              value={row.target}
              onChange={(v) => update(row.id, { target: v })}
            />
            <NumField
              label={t("businessData.chart.detail.usl")}
              value={row.usl}
              onChange={(v) => update(row.id, { usl: v })}
            />
            <NumField
              label={t("businessData.chart.detail.centerline1")}
              value={row.centerline1}
              onChange={(v) => update(row.id, { centerline1: v })}
            />
            <NumField
              label={t("businessData.chart.detail.centerline2")}
              value={row.centerline2}
              onChange={(v) => update(row.id, { centerline2: v })}
            />
            <NumField
              label={t("businessData.chart.detail.stdDev")}
              value={row.stdDev}
              onChange={(v) => update(row.id, { stdDev: v })}
            />
          </div>
          <Input
            placeholder={t("businessData.chart.detail.description")}
            value={row.description}
            onChange={(_, d) => update(row.id, { description: d.value })}
            style={{ marginTop: "8px" }}
          />
        </div>
      ))}
      <Button appearance="secondary" onClick={addRow}>
        {t("common.add")}
      </Button>
    </DialogShell>
  );
}
