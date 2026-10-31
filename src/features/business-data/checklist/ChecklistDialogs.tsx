import { useState } from "react";
import type { ChecklistInstance, ChecklistItem, ChecklistItemParameter } from "@/api";
import { Dismiss16Regular } from "@/components/icons";
import { Button, Checkbox, Input, Text, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { cardSurface } from "@/styles/shared";
import { MiniSelect } from "../components/MiniSelect";
import type { OperationValues } from "../components/operationTypes";
import {
  ACTIVITY_TYPES,
  CONDITION_TYPES,
  DEVIATION_TYPES,
  ITEM_STATE_COMPLETED,
  ITEM_STATE_NOT_STARTED,
  ITEM_STATE_SKIPPED,
  ITEM_STATE_STARTED,
  PARAMETER_SOURCES,
  PARAMETER_TYPES,
  SHOW_MANDATORY,
  SHOW_OPTIONAL,
  TIME_CATEGORIES,
  TRACKING_TYPES,
  type InstanceItemState,
  joinMeta,
} from "./checklistLookups";

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
    width: "min(920px, calc(100vw - 48px))",
    maxHeight: "min(700px, calc(100vh - 48px))",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    ...cardSurface,
  },
  narrow: {
    width: "min(560px, calc(100vw - 48px))",
    maxHeight: "min(700px, calc(100vh - 48px))",
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
  itemRow: {
    display: "flex",
    flexWrap: "wrap",
    columnGap: "8px",
    rowGap: "8px",
    alignItems: "center",
    marginBottom: "8px",
  },
  itemNameWrap: { flex: "1 1 160px", minWidth: "140px" },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    columnGap: "12px",
    rowGap: "8px",
    margin: "8px 0 16px 0",
    padding: "12px",
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
  toolbar: {
    display: "flex",
    columnGap: "8px",
    marginBottom: "12px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  paramRow: {
    display: "flex",
    flexWrap: "wrap",
    columnGap: "8px",
    rowGap: "8px",
    alignItems: "center",
    marginBottom: "8px",
  },
  paramNameWrap: { flex: "1 1 140px", minWidth: "120px" },
  performRow: {
    display: "grid",
    gridTemplateColumns: "minmax(0,1fr) auto auto",
    columnGap: "12px",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  stateBadge: {
    fontSize: "12px",
    padding: "2px 8px",
    borderRadius: "10px",
    backgroundColor: tokens.colorNeutralBackground3,
  },
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

export interface ChecklistItemRow extends Omit<ChecklistItem, "activityType" | "trackingType"> {
  id: number;
  activityType: string;
  trackingType: string;
}

const EMPTY_ITEM = (id: number): ChecklistItemRow => ({
  id,
  name: "",
  description: "",
  itemType: "",
  documentationUrl: "",
  activityType: "Manual Task",
  trackingType: "End",
  rule: "",
  timeCategory: "",
  standardDuration: "",
  floating: false,
  optional: false,
  executedOutOfOrder: false,
  group: "",
  instructions: "",
  conditionType: "None",
  conditionExpression: "",
  parameters: [],
});

export function ChecklistItemsEditor({
  values,
  onChange,
}: {
  values: OperationValues;
  onChange: (key: string, value: string | number | boolean) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const rows = (values.items as unknown as ChecklistItemRow[] | undefined) ?? [];
  const [expanded, setExpanded] = useState<number | null>(null);
  const setRows = (next: ChecklistItemRow[]) => onChange("items", next as unknown as boolean);
  const addRow = () => setRows([...rows, EMPTY_ITEM(Date.now() + rows.length)]);
  const removeRow = (id: number) => setRows(rows.filter((r) => r.id !== id));
  const update = (id: number, patch: Partial<ChecklistItemRow>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div>
      <div className={styles.hint}>{t("businessData.checklist.operations.itemsHint")}</div>
      {rows.length === 0 && (
        <div className={styles.empty}>{t("businessData.checklist.operations.noItems")}</div>
      )}
      {rows.map((row) => (
        <div key={row.id} style={{ marginBottom: "8px" }}>
          <div className={styles.itemRow}>
            <div className={styles.itemNameWrap}>
              <Input
                placeholder={t("businessData.checklist.operations.itemName")}
                value={row.name}
                onChange={(_, d) => update(row.id, { name: d.value })}
              />
            </div>
            <MiniSelect
              value={row.activityType}
              options={ACTIVITY_TYPES.map((v) => ({ value: v, label: v }))}
              onSelect={(v) => update(row.id, { activityType: v })}
              ariaLabel={t("businessData.checklist.operations.activityType")}
            />
            <MiniSelect
              value={row.trackingType}
              options={TRACKING_TYPES.map((v) => ({ value: v, label: v }))}
              onSelect={(v) => update(row.id, { trackingType: v })}
              ariaLabel={t("businessData.checklist.operations.trackingType")}
            />
            <Checkbox
              label={t("businessData.checklist.operations.floating")}
              checked={row.floating}
              onChange={() => update(row.id, { floating: !row.floating })}
            />
            <Checkbox
              label={t("businessData.checklist.operations.optional")}
              checked={row.optional}
              onChange={() => update(row.id, { optional: !row.optional })}
            />
            <Button
              appearance="secondary"
              onClick={() => setExpanded(expanded === row.id ? null : row.id)}
            >
              {t("businessData.checklist.operations.details")}
            </Button>
            <Button appearance="secondary" onClick={() => removeRow(row.id)}>
              {t("common.remove")}
            </Button>
          </div>
          {expanded === row.id && (
            <div className={styles.detailGrid}>
              <Field label={t("businessData.checklist.detail.description")}>
                <Input
                  value={row.description}
                  onChange={(_, d) => update(row.id, { description: d.value })}
                />
              </Field>
              <Field label={t("businessData.checklist.operations.itemType")}>
                <Input
                  value={row.itemType}
                  onChange={(_, d) => update(row.id, { itemType: d.value })}
                />
              </Field>
              <Field label={t("businessData.checklist.operations.documentationUrl")}>
                <Input
                  value={row.documentationUrl}
                  onChange={(_, d) => update(row.id, { documentationUrl: d.value })}
                />
              </Field>
              <Field label={t("businessData.checklist.operations.rule")}>
                <Input value={row.rule} onChange={(_, d) => update(row.id, { rule: d.value })} />
              </Field>
              <Field label={t("businessData.checklist.operations.timeCategory")}>
                <MiniSelect
                  value={row.timeCategory}
                  options={TIME_CATEGORIES.map((v) => ({ value: v, label: v }))}
                  onSelect={(v) => update(row.id, { timeCategory: v })}
                />
              </Field>
              <Field label={t("businessData.checklist.detail.standardDuration")}>
                <Input
                  value={row.standardDuration}
                  onChange={(_, d) => update(row.id, { standardDuration: d.value })}
                />
              </Field>
              <Field label={t("businessData.checklist.operations.group")}>
                <Input value={row.group} onChange={(_, d) => update(row.id, { group: d.value })} />
              </Field>
              <Field label={t("businessData.checklist.operations.conditionType")}>
                <MiniSelect
                  value={row.conditionType}
                  options={CONDITION_TYPES.map((v) => ({ value: v, label: v }))}
                  onSelect={(v) => update(row.id, { conditionType: v })}
                />
              </Field>
              <Field label={t("businessData.checklist.operations.conditionExpression")}>
                <Input
                  value={row.conditionExpression}
                  onChange={(_, d) => update(row.id, { conditionExpression: d.value })}
                />
              </Field>
              <div className={styles.fieldRow}>
                <Checkbox
                  label={t("businessData.checklist.operations.executedOutOfOrder")}
                  checked={row.executedOutOfOrder}
                  onChange={() => update(row.id, { executedOutOfOrder: !row.executedOutOfOrder })}
                />
              </div>
              <div className={styles.fieldRow} style={{ gridColumn: "1 / -1" }}>
                <span className={styles.fieldLabel}>
                  {t("businessData.checklist.operations.instructions")}
                </span>
                <Textarea
                  value={row.instructions}
                  onChange={(_, d) => update(row.id, { instructions: d.value })}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <ItemParametersEditor
                  parameters={row.parameters}
                  onChange={(parameters) => update(row.id, { parameters })}
                />
              </div>
            </div>
          )}
        </div>
      ))}
      <Button appearance="secondary" onClick={addRow}>
        {t("businessData.checklist.operations.addItem")}
      </Button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const styles = useDialogStyles();
  return (
    <div className={styles.fieldRow}>
      <span className={styles.fieldLabel}>{label}</span>
      {children}
    </div>
  );
}

function ItemParametersEditor({
  parameters,
  onChange,
}: {
  parameters: ChecklistItemParameter[];
  onChange: (next: ChecklistItemParameter[]) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const addParam = () =>
    onChange([
      ...parameters,
      { name: "", optional: false, source: "Free", dataType: "String", defaultValue: "" },
    ]);
  const removeParam = (idx: number) => onChange(parameters.filter((_, i) => i !== idx));
  const update = (idx: number, patch: Partial<ChecklistItemParameter>) =>
    onChange(parameters.map((p, i) => (i === idx ? { ...p, ...patch } : p)));

  return (
    <div>
      <div className={styles.fieldLabel} style={{ marginBottom: "8px" }}>
        {t("businessData.checklist.operations.parameters")}
      </div>
      {parameters.length === 0 && (
        <div className={styles.empty}>{t("businessData.checklist.operations.noParameters")}</div>
      )}
      {parameters.map((p, idx) => (
        <div key={idx} className={styles.paramRow}>
          <div className={styles.paramNameWrap}>
            <Input
              placeholder={t("businessData.checklist.operations.parameterName")}
              value={p.name}
              onChange={(_, d) => update(idx, { name: d.value })}
            />
          </div>
          <Checkbox
            label={t("businessData.checklist.operations.optional")}
            checked={p.optional}
            onChange={() => update(idx, { optional: !p.optional })}
          />
          <MiniSelect
            value={p.source}
            options={PARAMETER_SOURCES.map((v) => ({ value: v, label: v }))}
            onSelect={(v) => update(idx, { source: v as ChecklistItemParameter["source"] })}
          />
          <MiniSelect
            value={p.dataType}
            options={PARAMETER_TYPES.map((v) => ({ value: v, label: v }))}
            onSelect={(v) => update(idx, { dataType: v })}
          />
          <Input
            placeholder={t("businessData.checklist.operations.defaultValue")}
            value={p.defaultValue}
            onChange={(_, d) => update(idx, { defaultValue: d.value })}
          />
          <Button appearance="secondary" onClick={() => removeParam(idx)}>
            {t("common.remove")}
          </Button>
        </div>
      ))}
      <Button appearance="secondary" onClick={addParam}>
        {t("common.add")}
      </Button>
    </div>
  );
}

export function PreviewChecklistDialog({
  open,
  checklistName,
  items,
  onClose,
}: {
  open: boolean;
  checklistName: string;
  items: ChecklistItem[];
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [date, setDate] = useState("");
  const [material, setMaterial] = useState("");
  const [product, setProduct] = useState("");
  if (!open) return null;
  return (
    <DialogShell
      wide
      title={t("businessData.checklist.operations.previewTitle")}
      onClose={onClose}
      footer={
        <Button appearance="secondary" onClick={onClose}>
          {t("common.close")}
        </Button>
      }
    >
      <div className={styles.hint}>
        {t("businessData.checklist.operations.previewHint", { name: checklistName })}
      </div>
      <div className={styles.toolbar}>
        <Field label={t("businessData.checklist.operations.conditionDate")}>
          <Input type="date" value={date} onChange={(_, d) => setDate(d.value)} />
        </Field>
        <Field label={t("businessData.checklist.operations.conditionMaterial")}>
          <Input value={material} onChange={(_, d) => setMaterial(d.value)} />
        </Field>
        <Field label={t("businessData.checklist.operations.conditionProduct")}>
          <Input value={product} onChange={(_, d) => setProduct(d.value)} />
        </Field>
      </div>
      {items.length === 0 ? (
        <div className={styles.empty}>{t("businessData.checklist.operations.noItems")}</div>
      ) : (
        items.map((item, i) => (
          <div key={i} className={styles.performRow}>
            <div>
              <div style={{ fontWeight: 600 }}>{item.name}</div>
              <div className={styles.hint} style={{ margin: 0 }}>
                {joinMeta([
                  item.activityType,
                  item.trackingType,
                  item.optional ? t("businessData.checklist.operations.optional") : false,
                  item.floating ? t("businessData.checklist.operations.floating") : false,
                ])}
              </div>
            </div>
            <span className={styles.stateBadge}>{item.conditionType}</span>
            <span />
          </div>
        ))
      )}
    </DialogShell>
  );
}

export interface CloneChecklistRow {
  id: number;
  name: string;
  revision: string;
  comment: string;
}

export function CloneChecklistDialog({
  open,
  checklistName,
  onClose,
  onClone,
}: {
  open: boolean;
  checklistName: string;
  onClose: () => void;
  onClone: (rows: CloneChecklistRow[]) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [rows, setRows] = useState<CloneChecklistRow[]>([]);
  if (!open) return null;
  const addRow = () =>
    setRows([
      ...rows,
      { id: Date.now() + rows.length, name: `${checklistName} - Clone`, revision: "", comment: "" },
    ]);
  const removeRow = (id: number) => setRows(rows.filter((r) => r.id !== id));
  const update = (id: number, patch: Partial<CloneChecklistRow>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <DialogShell
      wide
      title={t("businessData.checklist.operations.cloneTitle")}
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
            {t("businessData.checklist.operations.clone")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.checklist.operations.cloneHint", { name: checklistName })}
      </div>
      {rows.length === 0 && (
        <div className={styles.empty}>{t("businessData.checklist.operations.noCloneRows")}</div>
      )}
      {rows.map((row) => (
        <div key={row.id} className={styles.paramRow}>
          <div className={styles.paramNameWrap}>
            <Input
              placeholder={t("businessData.checklist.detail.name")}
              value={row.name}
              onChange={(_, d) => update(row.id, { name: d.value })}
            />
          </div>
          <div className={styles.paramNameWrap}>
            <Input
              placeholder={t("businessData.checklist.operations.revision")}
              value={row.revision}
              onChange={(_, d) => update(row.id, { revision: d.value })}
            />
          </div>
          <div className={styles.paramNameWrap}>
            <Input
              placeholder={t("businessData.checklist.operations.comment")}
              value={row.comment}
              onChange={(_, d) => update(row.id, { comment: d.value })}
            />
          </div>
          <Button appearance="secondary" onClick={() => removeRow(row.id)}>
            {t("common.remove")}
          </Button>
        </div>
      ))}
      <Button appearance="secondary" onClick={addRow}>
        {t("common.add")}
      </Button>
    </DialogShell>
  );
}

export function OpenChecklistInstanceDialog({
  open,
  checklistName,
  onClose,
  onConfirm,
}: {
  open: boolean;
  checklistName: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  if (!open) return null;
  return (
    <DialogShell
      title={t("businessData.checklist.operations.openInstanceTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={onConfirm}>
            {t("businessData.checklist.operations.open")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.checklist.operations.openInstanceMessage", { name: checklistName })}
      </div>
    </DialogShell>
  );
}

export function OpenForMaterialDialog({
  open,
  checklistName,
  onClose,
  onConfirm,
}: {
  open: boolean;
  checklistName: string;
  onClose: () => void;
  onConfirm: (material: string) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [material, setMaterial] = useState("");
  if (!open) return null;
  return (
    <DialogShell
      title={t("businessData.checklist.operations.openForMaterialTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            disabled={material.trim() === ""}
            onClick={() => onConfirm(material)}
          >
            {t("businessData.checklist.operations.open")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.checklist.operations.openForMaterialHint", { name: checklistName })}
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.checklist.operations.material")}</span>
        <Input value={material} onChange={(_, d) => setMaterial(d.value)} />
      </div>
    </DialogShell>
  );
}

export function PauseChecklistInstanceDialog({
  open,
  instanceName,
  onClose,
  onConfirm,
}: {
  open: boolean;
  instanceName: string;
  onClose: () => void;
  onConfirm: (reason: string, comment: string) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  if (!open) return null;
  return (
    <DialogShell
      title={t("businessData.checklist.operations.pauseTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            disabled={reason.trim() === ""}
            onClick={() => onConfirm(reason, comment)}
          >
            {t("businessData.checklist.operations.pause")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.checklist.operations.pauseMessage", { name: instanceName })}
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.checklist.operations.pauseReason")} *
        </span>
        <Input
          placeholder={t("businessData.checklist.operations.pauseReasonPlaceholder")}
          value={reason}
          onChange={(_, d) => setReason(d.value)}
        />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.checklist.operations.comment")}</span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </DialogShell>
  );
}

function SignItemDialog({
  open,
  itemName,
  onClose,
  onSign,
}: {
  open: boolean;
  itemName: string;
  onClose: () => void;
  onSign: (username: string, password: string) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  if (!open) return null;
  return (
    <DialogShell
      title={t("businessData.checklist.operations.signTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            disabled={username.trim() === "" || password === ""}
            onClick={() => onSign(username, password)}
          >
            {t("businessData.checklist.operations.sign")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.checklist.operations.signHint", { name: itemName })}
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.checklist.operations.username")}</span>
        <Input value={username} onChange={(_, d) => setUsername(d.value)} />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.checklist.operations.password")}</span>
        <Input type="password" value={password} onChange={(_, d) => setPassword(d.value)} />
      </div>
    </DialogShell>
  );
}

export function PerformChecklistDialog({
  open,
  instance,
  immediate,
  onClose,
  onPerform,
}: {
  open: boolean;
  instance: ChecklistInstance | null;
  immediate: boolean;
  onClose: () => void;
  onPerform: (items: { name: string; state: InstanceItemState }[], close: boolean) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [states, setStates] = useState<Record<string, InstanceItemState>>({});
  const [show, setShow] = useState<string>(SHOW_MANDATORY);
  const [signItem, setSignItem] = useState<string | null>(null);
  if (!open || !instance) return null;

  const stateOf = (name: string): InstanceItemState =>
    states[name] ?? instance.items.find((i) => i.name === name)?.state ?? ITEM_STATE_NOT_STARTED;
  const setState = (name: string, state: InstanceItemState) =>
    setStates((s) => ({ ...s, [name]: state }));

  const visibleItems = instance.items.filter((i) =>
    show === SHOW_MANDATORY ? !i.optional : i.optional,
  );
  const allDone = instance.items.every((i) => {
    const s = stateOf(i.name);
    return s === ITEM_STATE_COMPLETED || s === ITEM_STATE_SKIPPED;
  });

  const completeItem = (name: string) => {
    const item = instance.items.find((i) => i.name === name);
    if (item?.activityType === "Signature") {
      setSignItem(name);
    } else {
      setState(name, ITEM_STATE_COMPLETED);
    }
  };

  const snapshot = () => instance.items.map((i) => ({ name: i.name, state: stateOf(i.name) }));

  return (
    <DialogShell
      wide
      title={t(
        immediate
          ? "businessData.checklist.operations.performImmediateTitle"
          : "businessData.checklist.operations.performTitle",
      )}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          {!immediate && (
            <Button appearance="secondary" onClick={() => onPerform(snapshot(), false)}>
              {t("businessData.checklist.operations.saveAndClose")}
            </Button>
          )}
          <Button
            appearance="primary"
            disabled={!allDone}
            onClick={() => onPerform(snapshot(), true)}
          >
            {t(immediate ? "businessData.checklist.operations.perform" : "common.close")}
          </Button>
        </>
      }
    >
      <div className={styles.toolbar}>
        <Button
          appearance={show === SHOW_MANDATORY ? "primary" : "secondary"}
          onClick={() => setShow(SHOW_MANDATORY)}
        >
          {t("businessData.checklist.operations.mandatory")}
        </Button>
        <Button
          appearance={show === SHOW_OPTIONAL ? "primary" : "secondary"}
          onClick={() => setShow(SHOW_OPTIONAL)}
        >
          {t("businessData.checklist.operations.optionalList")}
        </Button>
      </div>
      {visibleItems.length === 0 && (
        <div className={styles.empty}>{t("businessData.checklist.operations.noItems")}</div>
      )}
      {visibleItems.map((item) => {
        const s = stateOf(item.name);
        return (
          <div key={item.name} className={styles.performRow}>
            <div>
              <div style={{ fontWeight: 600 }}>{item.name}</div>
              <div className={styles.hint} style={{ margin: 0 }}>
                {item.activityType}
                {item.floating ? ` · ${t("businessData.checklist.operations.floating")}` : ""}
              </div>
            </div>
            <span className={styles.stateBadge}>{s}</span>
            <div style={{ display: "flex", columnGap: "4px" }}>
              {s === ITEM_STATE_NOT_STARTED && (
                <Button
                  appearance="secondary"
                  size="small"
                  onClick={() => setState(item.name, ITEM_STATE_STARTED)}
                >
                  {t("businessData.checklist.operations.start")}
                </Button>
              )}
              {(s === ITEM_STATE_STARTED || s === ITEM_STATE_NOT_STARTED) && (
                <Button appearance="secondary" size="small" onClick={() => completeItem(item.name)}>
                  {t("businessData.checklist.operations.complete")}
                </Button>
              )}
              {item.optional && (s === ITEM_STATE_NOT_STARTED || s === ITEM_STATE_STARTED) && (
                <Button
                  appearance="secondary"
                  size="small"
                  onClick={() => setState(item.name, ITEM_STATE_SKIPPED)}
                >
                  {t("businessData.checklist.operations.skip")}
                </Button>
              )}
            </div>
          </div>
        );
      })}
      <SignItemDialog
        open={signItem !== null}
        itemName={signItem ?? ""}
        onClose={() => setSignItem(null)}
        onSign={() => {
          if (signItem) setState(signItem, ITEM_STATE_COMPLETED);
          setSignItem(null);
        }}
      />
    </DialogShell>
  );
}

export function OpenMaterialDeviationDialog({
  open,
  instance,
  onClose,
  onConfirm,
}: {
  open: boolean;
  instance: ChecklistInstance | null;
  onClose: () => void;
  onConfirm: (input: {
    itemName: string;
    deviationType: string;
    product: string;
    quantity?: number;
    units: string;
    color: string;
    comment: string;
  }) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [itemName, setItemName] = useState(instance?.items[0]?.name ?? "");
  const [deviationType, setDeviationType] = useState(DEVIATION_TYPES[0]);
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [units, setUnits] = useState("");
  const [color, setColor] = useState("");
  const [comment, setComment] = useState("");
  if (!open || !instance) return null;
  const isBom = deviationType.includes("BOM");

  return (
    <DialogShell
      wide
      title={t("businessData.checklist.operations.openDeviationTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            disabled={itemName === ""}
            onClick={() =>
              onConfirm({
                itemName,
                deviationType,
                product,
                quantity: quantity === "" ? undefined : Number(quantity),
                units,
                color,
                comment,
              })
            }
          >
            {t("businessData.checklist.operations.openDeviation")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.checklist.operations.openDeviationHint", { name: instance.name })}
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.checklist.operations.checklistItem")}
        </span>
        <MiniSelect
          value={itemName}
          options={instance.items.map((i) => ({ value: i.name, label: i.name }))}
          onSelect={setItemName}
        />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.checklist.operations.deviationType")}
        </span>
        <MiniSelect
          value={deviationType}
          options={DEVIATION_TYPES.map((v) => ({ value: v, label: v }))}
          onSelect={setDeviationType}
        />
      </div>
      {isBom && (
        <>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>
              {t("businessData.checklist.operations.product")}
            </span>
            <Input value={product} onChange={(_, d) => setProduct(d.value)} />
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>
              {t("businessData.checklist.operations.quantity")}
            </span>
            <Input type="number" value={quantity} onChange={(_, d) => setQuantity(d.value)} />
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>
              {t("businessData.checklist.operations.units")}
            </span>
            <Input value={units} onChange={(_, d) => setUnits(d.value)} />
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>
              {t("businessData.checklist.operations.color")}
            </span>
            <Input value={color} onChange={(_, d) => setColor(d.value)} />
          </div>
        </>
      )}
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.checklist.operations.comment")}</span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </DialogShell>
  );
}
