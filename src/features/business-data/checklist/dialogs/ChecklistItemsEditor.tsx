import { useState } from "react";
import type { ChecklistItem, ChecklistItemParameter } from "@/api";
import { Empty } from "@/components/common";
import { Button, Checkbox, Input, Textarea } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";
import { MiniSelect } from "../../components/MiniSelect";
import type { OperationOnChange, OperationValues } from "../../components/operationTypes";
import {
  ACTIVITY_TYPES,
  CONDITION_TYPES,
  PARAMETER_SOURCES,
  PARAMETER_TYPES,
  TIME_CATEGORIES,
  TRACKING_TYPES,
} from "../checklistLookups";
import { Field } from "./dialogShared";
import { useDialogStyles } from "./dialogStyles";

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
  onChange: OperationOnChange;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const rows = (values.items as unknown as ChecklistItemRow[] | undefined) ?? [];
  const [expanded, setExpanded] = useState<number | null>(null);
  const setRows = (next: ChecklistItemRow[]) => onChange("items", next);
  const addRow = () => setRows([...rows, EMPTY_ITEM(Date.now() + rows.length)]);
  const removeRow = (id: number) => setRows(rows.filter((r) => r.id !== id));
  const update = (id: number, patch: Partial<ChecklistItemRow>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div>
      <div className={styles.hint}>{t("businessData.checklist.operations.itemsHint")}</div>
      {rows.length === 0 && <Empty>{t("businessData.checklist.operations.noItems")}</Empty>}
      {rows.map((row) => (
        <div key={row.id} style={{ marginBottom: theme.spacing.sm }}>
          <div className={styles.itemRow}>
            <div className={styles.itemNameWrap}>
              <Input
                placeholder={t("businessData.checklist.operations.itemName")}
                value={row.name}
                onChange={(value) => update(row.id, { name: value })}
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
              variant="secondary"
              onClick={() => setExpanded(expanded === row.id ? null : row.id)}
            >
              {t("businessData.checklist.operations.details")}
            </Button>
            <Button variant="secondary" onClick={() => removeRow(row.id)}>
              {t("common.remove")}
            </Button>
          </div>
          {expanded === row.id && (
            <div className={styles.detailGrid}>
              <Field label={t("businessData.checklist.detail.description")}>
                <Input
                  value={row.description}
                  onChange={(value) => update(row.id, { description: value })}
                />
              </Field>
              <Field label={t("businessData.checklist.operations.itemType")}>
                <Input
                  value={row.itemType}
                  onChange={(value) => update(row.id, { itemType: value })}
                />
              </Field>
              <Field label={t("businessData.checklist.operations.documentationUrl")}>
                <Input
                  value={row.documentationUrl}
                  onChange={(value) => update(row.id, { documentationUrl: value })}
                />
              </Field>
              <Field label={t("businessData.checklist.operations.rule")}>
                <Input value={row.rule} onChange={(value) => update(row.id, { rule: value })} />
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
                  onChange={(value) => update(row.id, { standardDuration: value })}
                />
              </Field>
              <Field label={t("businessData.checklist.operations.group")}>
                <Input value={row.group} onChange={(value) => update(row.id, { group: value })} />
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
                  onChange={(value) => update(row.id, { conditionExpression: value })}
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
                  onChange={(value) => update(row.id, { instructions: value })}
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
      <Button variant="secondary" onClick={addRow}>
        {t("businessData.checklist.operations.addItem")}
      </Button>
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
      <div className={styles.fieldLabel} style={{ marginBottom: theme.spacing.sm }}>
        {t("businessData.checklist.operations.parameters")}
      </div>
      {parameters.length === 0 && (
        <Empty>{t("businessData.checklist.operations.noParameters")}</Empty>
      )}
      {parameters.map((p, idx) => (
        <div key={idx} className={styles.paramRow}>
          <div className={styles.paramNameWrap}>
            <Input
              placeholder={t("businessData.checklist.operations.parameterName")}
              value={p.name}
              onChange={(value) => update(idx, { name: value })}
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
            onChange={(value) => update(idx, { defaultValue: value })}
          />
          <Button variant="secondary" onClick={() => removeParam(idx)}>
            {t("common.remove")}
          </Button>
        </div>
      ))}
      <Button variant="secondary" onClick={addParam}>
        {t("common.add")}
      </Button>
    </div>
  );
}
