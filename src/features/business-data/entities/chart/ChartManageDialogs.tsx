import { useState } from "react";
import type { ChartContextElement, ChartDataPoint, ChartDetail, ChartRuleRow } from "@/api";
import { Dismiss16Regular } from "@/components/icons";
import {
  Button,
  Checkbox,
  Input,
  Menu,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  Textarea,
  makeStyles,
  tokens,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { cardSurface } from "@/styles/shared";
import type { OperationValues } from "../../components/operationTypes";
import {
  DATA_POINT_ACTION_KEYS,
  ELEMENT_TYPE_OPTIONS,
  RULE_SCOPE_OPTIONS,
  SPC_RULES,
} from "./chartLookups";
import type { DataPointAction } from "./chartLookups";

const useDialogStyles = makeStyles({
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "grid",
    placeItems: "center",
    padding: "24px",
    boxSizing: "border-box",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  surface: {
    width: "min(860px, calc(100vw - 48px))",
    maxHeight: "min(680px, calc(100vh - 48px))",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    ...cardSurface,
  },
  narrow: {
    width: "min(560px, calc(100vw - 48px))",
    maxHeight: "min(680px, calc(100vh - 48px))",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    ...cardSurface,
  },
  head: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "52px",
    padding: "0 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  closeButton: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    padding: "6px",
    borderRadius: tokens.borderRadiusMedium,
    display: "flex",
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  body: { flexGrow: 1, minHeight: 0, overflowY: "auto", padding: "16px 24px" },
  foot: {
    display: "flex",
    justifyContent: "flex-end",
    columnGap: "8px",
    padding: "12px 24px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  hint: { fontSize: "13px", color: tokens.colorNeutralForeground2, marginBottom: "12px" },
  fieldRow: { display: "flex", flexDirection: "column", rowGap: "4px", marginBottom: "12px" },
  fieldLabel: { fontSize: "13px", fontWeight: tokens.fontWeightSemibold },
  empty: { padding: "16px", textAlign: "center", color: tokens.colorNeutralForeground3 },
  ruleRow: {
    display: "grid",
    gridTemplateColumns: "110px 150px minmax(0,1fr) 130px 130px auto",
    columnGap: "8px",
    alignItems: "center",
    marginBottom: "8px",
  },
  contextRow: {
    display: "grid",
    gridTemplateColumns: "64px 70px minmax(0,1fr) minmax(0,1fr) 130px minmax(0,1fr) auto",
    columnGap: "8px",
    alignItems: "center",
    marginBottom: "8px",
  },
  readingRow: { display: "flex", columnGap: "8px", alignItems: "center", marginBottom: "8px" },
  toolbar: { display: "flex", columnGap: "8px", marginBottom: "12px", flexWrap: "wrap" },
  preview: {
    marginTop: "12px",
    padding: "12px",
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: "13px",
  },
  selectedRow: { backgroundColor: tokens.colorNeutralBackground1Selected },
});

function DialogShell({
  title,
  onClose,
  wide,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  wide?: boolean;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const styles = useDialogStyles();
  const { t } = useAppTranslation();
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={wide ? styles.surface : styles.narrow} onClick={(e) => e.stopPropagation()}>
        <div className={styles.head}>
          <Text weight="semibold">{title}</Text>
          <button className={styles.closeButton} onClick={onClose} aria-label={t("common.close")}>
            <Dismiss16Regular />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        <div className={styles.foot}>{footer}</div>
      </div>
    </div>
  );
}

function MiniSelect({
  value,
  options,
  onSelect,
  ariaLabel,
}: {
  value: string;
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
  ariaLabel?: string;
}) {
  const selected = options.find((o) => o.value === value);
  return (
    <Menu
      positioning="below-start"
      checkedValues={{ selected: value === "" ? [] : [value] }}
      onCheckedValueChange={(_, data) => onSelect(data.checkedItems[0] ?? "")}
    >
      <MenuTrigger disableButtonEnhancement>
        <Button appearance="secondary" aria-label={ariaLabel}>
          {selected?.label ?? value}
        </Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {options.map((o) => (
            <MenuItemRadio key={o.value} name="selected" value={o.value}>
              {o.label}
            </MenuItemRadio>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}

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

export function EnableDisableChartDialog({
  open,
  chartName,
  enabling,
  onClose,
  onConfirm,
}: {
  open: boolean;
  chartName: string;
  enabling: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [comment, setComment] = useState("");
  if (!open) return null;
  return (
    <DialogShell
      title={t(
        enabling
          ? "businessData.chart.operations.enableTitle"
          : "businessData.chart.operations.disableTitle",
      )}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={() => onConfirm(comment)}>
            {t(
              enabling
                ? "businessData.chart.operations.enable"
                : "businessData.chart.operations.disable",
            )}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t(
          enabling
            ? "businessData.chart.operations.enableMessage"
            : "businessData.chart.operations.disableMessage",
          {
            name: chartName,
          },
        )}
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.chart.operations.comment")}</span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </DialogShell>
  );
}

export interface ManageRuleRow {
  id: number;
  scope: string;
  rule: string;
  protocol: string;
  actionRule: string;
  comment: string;
}

export function ManageChartRulesDialog({
  open,
  chartName,
  initialRules,
  onClose,
  onSave,
}: {
  open: boolean;
  chartName: string;
  initialRules: ChartRuleRow[];
  onClose: () => void;
  onSave: (rules: ChartRuleRow[]) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [rows, setRows] = useState<ManageRuleRow[]>(() =>
    initialRules.map((r, i) => ({
      id: Date.now() + i,
      scope: r.scope,
      rule: r.rule,
      protocol: r.protocol,
      actionRule: r.actionRule,
      comment: r.comment,
    })),
  );
  if (!open) return null;
  const descriptionOf = (rule: string) =>
    SPC_RULES.find((r) => r.value === rule)?.description ?? "";
  const addRow = () =>
    setRows([
      ...rows,
      {
        id: Date.now() + rows.length,
        scope: "Chart",
        rule: "Nelson 1",
        protocol: "",
        actionRule: "",
        comment: "",
      },
    ]);
  const removeRow = (id: number) => setRows(rows.filter((r) => r.id !== id));
  const update = (id: number, patch: Partial<ManageRuleRow>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <DialogShell
      wide
      title={t("businessData.chart.operations.manageRules")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            onClick={() =>
              onSave(
                rows.map((r) => ({
                  scope: r.scope,
                  rule: r.rule,
                  description: descriptionOf(r.rule),
                  protocol: r.protocol,
                  actionRule: r.actionRule,
                  comment: r.comment,
                  enabled: true,
                })),
              )
            }
          >
            {t("common.update")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.chart.operations.manageRulesHint", { name: chartName })}
      </div>
      {rows.length === 0 && (
        <div className={styles.empty}>{t("businessData.chart.operations.noRules")}</div>
      )}
      {rows.map((row) => (
        <div key={row.id}>
          <div className={styles.ruleRow}>
            <MiniSelect
              value={row.scope}
              options={RULE_SCOPE_OPTIONS}
              onSelect={(v) => update(row.id, { scope: v })}
              ariaLabel={t("businessData.chart.operations.scope")}
            />
            <MiniSelect
              value={row.rule}
              options={SPC_RULES.map((r) => ({ value: r.value, label: r.value }))}
              onSelect={(v) => update(row.id, { rule: v })}
              ariaLabel={t("businessData.chart.operations.rule")}
            />
            <Input
              placeholder={t("businessData.chart.operations.protocol")}
              value={row.protocol}
              onChange={(_, d) => update(row.id, { protocol: d.value })}
            />
            <Input
              placeholder={t("businessData.chart.operations.actionRule")}
              value={row.actionRule}
              onChange={(_, d) => update(row.id, { actionRule: d.value })}
            />
            <Input
              placeholder={t("businessData.chart.operations.comment")}
              value={row.comment}
              onChange={(_, d) => update(row.id, { comment: d.value })}
            />
            <Button appearance="secondary" onClick={() => removeRow(row.id)}>
              {t("common.remove")}
            </Button>
          </div>
          <div className={styles.hint}>{descriptionOf(row.rule)}</div>
        </div>
      ))}
      <Button appearance="secondary" onClick={addRow}>
        {t("common.add")}
      </Button>
    </DialogShell>
  );
}

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
  onChange: (key: string, value: string | number | boolean) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const rows = (values.logicalChartLimits as unknown as LogicalChartLimitRow[] | undefined) ?? [];
  const setRows = (next: LogicalChartLimitRow[]) =>
    onChange("logicalChartLimits", next as unknown as boolean);
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
            marginBottom: "16px",
            paddingBottom: "12px",
            borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <Text weight="semibold">{row.name}</Text>
            <Button appearance="secondary" onClick={() => copyChartLimits(row.name)}>
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

function numOrUndef(v: string | number | boolean | undefined): number | undefined {
  if (v === undefined || v === "" || typeof v === "boolean") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
}) {
  return (
    <div className="num-field" style={{ display: "flex", flexDirection: "column", rowGap: "4px" }}>
      <span style={{ fontSize: "12px", color: tokens.colorNeutralForeground3 }}>{label}</span>
      <Input
        type="number"
        value={value === undefined ? "" : String(value)}
        onChange={(_, d) => onChange(d.value === "" ? undefined : Number(d.value))}
      />
    </div>
  );
}

export function RecalculateCenterlinesDialog({
  open,
  logicalChartName,
  defaultPoints,
  dataPoints,
  onClose,
  onRecalculate,
}: {
  open: boolean;
  logicalChartName: string;
  defaultPoints: number;
  dataPoints: ChartDataPoint[];
  onClose: () => void;
  onRecalculate: (points: number) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [points, setPoints] = useState(defaultPoints);
  const [comment, setComment] = useState("");
  const [preview, setPreview] = useState<{ centerline1: number; stdDev: number } | null>(null);
  if (!open) return null;
  const doPreview = () => {
    const considered = dataPoints
      .filter((d) => d.status === "Active" || d.status === "Edited")
      .slice(-points);
    const all = considered.flatMap((d) => d.readings);
    const avg = all.length > 0 ? all.reduce((a, b) => a + b, 0) / all.length : 0;
    const variance =
      all.length > 0 ? all.reduce((a, b) => a + (b - avg) * (b - avg), 0) / all.length : 0;
    setPreview({
      centerline1: Number(avg.toFixed(4)),
      stdDev: Number(Math.sqrt(variance).toFixed(4)),
    });
  };
  return (
    <DialogShell
      title={t("businessData.chart.operations.recalculateTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="secondary" onClick={doPreview}>
            {t("businessData.chart.operations.preview")}
          </Button>
          <Button appearance="primary" onClick={() => onRecalculate(points)}>
            {t("businessData.chart.operations.recalculateSet")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.chart.operations.recalculateHint", { name: logicalChartName })}
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.chart.operations.numberOfPoints")}
        </span>
        <Input
          type="number"
          value={String(points)}
          onChange={(_, d) => setPoints(Number(d.value) || 0)}
        />
      </div>
      {preview && (
        <div className={styles.preview}>
          {t("businessData.chart.operations.previewResult", {
            centerline1: String(preview.centerline1),
            stdDev: String(preview.stdDev),
          })}
        </div>
      )}
      <div className={styles.fieldRow} style={{ marginTop: "12px" }}>
        <span className={styles.fieldLabel}>{t("businessData.chart.operations.comment")}</span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </DialogShell>
  );
}

export function RemoveLogicalChartDialog({
  open,
  logicalChartName,
  onClose,
  onConfirm,
}: {
  open: boolean;
  logicalChartName: string;
  onClose: () => void;
  onConfirm: (comment: string) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [comment, setComment] = useState("");
  if (!open) return null;
  return (
    <DialogShell
      title={t("businessData.chart.operations.removeLogicalChartTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={() => onConfirm(comment)}>
            {t("common.remove")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.chart.operations.removeLogicalChartMessage", { name: logicalChartName })}
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.chart.operations.comment")}</span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </DialogShell>
  );
}

export function AnnotateDataPointDialog({
  open,
  dataPoint,
  onClose,
  onConfirm,
}: {
  open: boolean;
  dataPoint: ChartDataPoint | null;
  onClose: () => void;
  onConfirm: (input: { annotation: string; annotationCode: string; comment: string }) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [code, setCode] = useState("");
  const [annotation, setAnnotation] = useState("");
  const [comment, setComment] = useState("");
  if (!open || !dataPoint) return null;
  return (
    <DialogShell
      title={t("businessData.chart.operations.annotateTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            disabled={annotation.trim() === ""}
            onClick={() => onConfirm({ annotation, annotationCode: code, comment })}
          >
            {t("businessData.chart.operations.annotate")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.chart.operations.annotateHint", { id: dataPoint.sampleId })}
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.chart.operations.annotationCode")}
        </span>
        <Input value={code} onChange={(_, d) => setCode(d.value)} />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.chart.operations.annotation")} *</span>
        <Textarea value={annotation} onChange={(_, d) => setAnnotation(d.value)} />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.chart.operations.comment")}</span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </DialogShell>
  );
}

export function EditDataPointDialog({
  open,
  dataPoint,
  onClose,
  onConfirm,
}: {
  open: boolean;
  dataPoint: ChartDataPoint | null;
  onClose: () => void;
  onConfirm: (input: { readings: number[]; comment: string }) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [readings, setReadings] = useState<string[]>(dataPoint?.readings.map(String) ?? []);
  const [comment, setComment] = useState("");
  if (!open || !dataPoint) return null;
  const setAt = (i: number, raw: string) => {
    const next = [...readings];
    next[i] = raw;
    setReadings(next);
  };
  return (
    <DialogShell
      title={t("businessData.chart.operations.editDataPointTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            onClick={() =>
              onConfirm({
                readings: readings.map((r) => Number(r)).filter((n) => !Number.isNaN(n)),
                comment,
              })
            }
          >
            {t("common.save")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.chart.operations.editDataPointHint", { id: dataPoint.sampleId })}
      </div>
      {readings.map((r, i) => (
        <div key={i} className={styles.readingRow}>
          <span style={{ minWidth: "110px", fontSize: "13px" }}>
            {t("businessData.chart.operations.reading", { index: i + 1 })}
          </span>
          <Input type="number" value={r} onChange={(_, d) => setAt(i, d.value)} />
        </div>
      ))}
      <div className={styles.fieldRow} style={{ marginTop: "12px" }}>
        <span className={styles.fieldLabel}>{t("businessData.chart.operations.comment")}</span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </DialogShell>
  );
}

export function DataPointConfirmDialog({
  open,
  titleKey,
  message,
  confirmLabel,
  onClose,
  onConfirm,
}: {
  open: boolean;
  titleKey:
    | "businessData.chart.operations.excludeTitle"
    | "businessData.chart.operations.includeTitle"
    | "businessData.chart.operations.removeDataPointTitle";
  message: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: (comment: string) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [comment, setComment] = useState("");
  if (!open) return null;
  return (
    <DialogShell
      title={t(titleKey)}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={() => onConfirm(comment)}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>{message}</div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.chart.operations.comment")}</span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </DialogShell>
  );
}

export function OpenProtocolDialog({
  open,
  dataPoint,
  protocols,
  onClose,
  onConfirm,
}: {
  open: boolean;
  dataPoint: ChartDataPoint | null;
  protocols: string[];
  onClose: () => void;
  onConfirm: (protocol: string, comment: string) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [protocol, setProtocol] = useState(protocols[0] ?? "");
  const [comment, setComment] = useState("");
  if (!open || !dataPoint) return null;
  return (
    <DialogShell
      title={t("businessData.chart.operations.openProtocolTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            disabled={protocol === ""}
            onClick={() => onConfirm(protocol, comment)}
          >
            {t("businessData.chart.operations.openProtocol")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.chart.operations.openProtocolHint", { id: dataPoint.sampleId })}
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.chart.operations.protocol")}</span>
        <MiniSelect
          value={protocol}
          options={protocols.map((p) => ({ value: p, label: p }))}
          onSelect={setProtocol}
        />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.chart.operations.comment")}</span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </DialogShell>
  );
}

export function DataPointsDialog({
  open,
  logicalChartName,
  dataPoints,
  onClose,
  onAction,
  onPost,
}: {
  open: boolean;
  logicalChartName: string;
  dataPoints: ChartDataPoint[];
  onClose: () => void;
  onAction: (action: DataPointAction, dp: ChartDataPoint) => void;
  onPost: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [selected, setSelected] = useState<string | null>(null);
  if (!open) return null;
  const dp = dataPoints.find((d) => d.id === selected) ?? null;
  const canAct = dp !== null;
  return (
    <DialogShell
      wide
      title={t("businessData.chart.operations.dataPointsTitle", { name: logicalChartName })}
      onClose={onClose}
      footer={
        <Button appearance="secondary" onClick={onClose}>
          {t("common.close")}
        </Button>
      }
    >
      <div className={styles.toolbar}>
        <Button appearance="secondary" onClick={onPost}>
          {t("businessData.chart.operations.postDataPoint")}
        </Button>
        <Button
          appearance="secondary"
          disabled={!canAct}
          onClick={() => dp && onAction(DATA_POINT_ACTION_KEYS.annotate, dp)}
        >
          {t("businessData.chart.operations.annotate")}
        </Button>
        <Button
          appearance="secondary"
          disabled={!canAct || dp?.aggregated}
          onClick={() => dp && onAction(DATA_POINT_ACTION_KEYS.edit, dp)}
        >
          {t("businessData.chart.operations.editDataPoint")}
        </Button>
        <Button
          appearance="secondary"
          disabled={!canAct || (dp?.status !== "Active" && dp?.status !== "Edited")}
          onClick={() => dp && onAction(DATA_POINT_ACTION_KEYS.exclude, dp)}
        >
          {t("businessData.chart.operations.exclude")}
        </Button>
        <Button
          appearance="secondary"
          disabled={!canAct || dp?.status !== "Excluded"}
          onClick={() => dp && onAction(DATA_POINT_ACTION_KEYS.include, dp)}
        >
          {t("businessData.chart.operations.include")}
        </Button>
        <Button
          appearance="secondary"
          disabled={!canAct}
          onClick={() => dp && onAction(DATA_POINT_ACTION_KEYS.remove, dp)}
        >
          {t("businessData.chart.operations.removeDataPoint")}
        </Button>
        <Button
          appearance="secondary"
          disabled={!canAct}
          onClick={() => dp && onAction(DATA_POINT_ACTION_KEYS.protocol, dp)}
        >
          {t("businessData.chart.operations.openProtocol")}
        </Button>
      </div>
      {dataPoints.length === 0 ? (
        <div className={styles.empty}>{t("businessData.chart.operations.noDataPoints")}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>{t("businessData.chart.operations.sampleId")}</TableHeaderCell>
              <TableHeaderCell>{t("businessData.chart.operations.timestamp")}</TableHeaderCell>
              <TableHeaderCell>{t("businessData.chart.operations.readingsCount")}</TableHeaderCell>
              <TableHeaderCell>
                {t("businessData.chart.operations.dataPointStatus")}
              </TableHeaderCell>
              <TableHeaderCell>{t("businessData.chart.operations.annotation")}</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataPoints.map((d) => (
              <TableRow
                key={d.id}
                className={selected === d.id ? styles.selectedRow : undefined}
                onClick={() => setSelected(d.id)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{d.sampleId}</TableCell>
                <TableCell>{d.timestamp}</TableCell>
                <TableCell>
                  {d.aggregated
                    ? `${d.sampleSize} (${t("businessData.chart.operations.aggregated")})`
                    : String(d.readings.length)}
                </TableCell>
                <TableCell>{d.status}</TableCell>
                <TableCell>{d.annotation ?? ""}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </DialogShell>
  );
}

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
  if (!open) return null;
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
