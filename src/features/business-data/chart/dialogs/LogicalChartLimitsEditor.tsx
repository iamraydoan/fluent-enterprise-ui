import { Button, Checkbox, Text} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";
import type { OperationOnChange, OperationValues } from "../../components/operationTypes";
import { NumField } from "./dialogShared";
import { numOrUndef, useDialogStyles } from "./dialogStyles";

export interface LogicalChartLimitRow {
  name: string;
  autoRecalculateCenterlines: boolean;
  windowSize: number;
  learningMode: boolean;
  disableAutoCalcAfterLearning: boolean;
  usl?: number;
  target?: number;
  lsl?: number;
  autoControlLimits: boolean;
  centerline1?: number;
  centerline2?: number;
  stdDev?: number;
  ucl?: number;
  lcl?: number;
}

export function LogicalChartLimitsEditor({
  values,
  onChange,
}: {
  values: OperationValues;
  onChange: OperationOnChange;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const rows = (values.logicalChartLimits as unknown as LogicalChartLimitRow[] | undefined) ?? [];
  const setRows = (next: LogicalChartLimitRow[]) =>
    onChange("logicalChartLimits", next);
  const update = (name: string, patch: Partial<LogicalChartLimitRow>) =>
    setRows(rows.map((r) => (r.name === name ? { ...r, ...patch } : r)));
  const copyChartLimits = (name: string) =>
    update(name, {
      autoRecalculateCenterlines: values.autoRecalculateCenterlines === true,
      windowSize: Number(values.windowSize ?? 0),
      learningMode: values.learningMode === true,
      disableAutoCalcAfterLearning: values.disableAutoCalcAfterLearning === true,
      usl: numOrUndef(values.usl),
      target: numOrUndef(values.target),
      lsl: numOrUndef(values.lsl),
      autoControlLimits: values.autoControlLimits === true,
      centerline1: numOrUndef(values.centerline1),
      centerline2: numOrUndef(values.centerline2),
      stdDev: numOrUndef(values.stdDev),
      ucl: numOrUndef(values.ucl),
      lcl: numOrUndef(values.lcl),
    });

  return (
    <div>
      <div className={styles.hint}>{t("businessData.chart.operations.setLimitsLogicalHint")}</div>
      {rows.length === 0 && (
        <div className={styles.empty}>{t("businessData.chart.operations.noLogicalCharts")}</div>
      )}
      {rows.map((row) => (
        <div
          key={row.name}
          style={{
            marginBottom: theme.spacing.lg,
            paddingBottom: theme.spacing.md,
            borderBottom: `1px solid ${theme.color.borderSubtle}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: theme.spacing.sm,
            }}
          >
            <Text weight="semibold">{row.name}</Text>
            <Button variant="secondary" onClick={() => copyChartLimits(row.name)}>
              {t("businessData.chart.operations.copyChartLimits")}
            </Button>
          </div>
          <div className={styles.ruleRow}>
            <NumField
              label={t("businessData.chart.detail.usl")}
              value={row.usl}
              onChange={(v) => update(row.name, { usl: v })}
            />
            <NumField
              label={t("businessData.chart.detail.target")}
              value={row.target}
              onChange={(v) => update(row.name, { target: v })}
            />
            <NumField
              label={t("businessData.chart.detail.lsl")}
              value={row.lsl}
              onChange={(v) => update(row.name, { lsl: v })}
            />
            <NumField
              label={t("businessData.chart.detail.centerline1")}
              value={row.centerline1}
              onChange={(v) => update(row.name, { centerline1: v })}
            />
            <NumField
              label={t("businessData.chart.detail.centerline2")}
              value={row.centerline2}
              onChange={(v) => update(row.name, { centerline2: v })}
            />
            <NumField
              label={t("businessData.chart.detail.stdDev")}
              value={row.stdDev}
              onChange={(v) => update(row.name, { stdDev: v })}
            />
          </div>
          <Checkbox
            label={t("businessData.chart.operations.autoControlLimits")}
            checked={row.autoControlLimits}
            onChange={() => update(row.name, { autoControlLimits: !row.autoControlLimits })}
          />
        </div>
      ))}
    </div>
  );
}
