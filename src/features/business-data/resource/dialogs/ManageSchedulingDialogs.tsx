import { useState } from "react";
import { BaseDialog, DialogEntityBanner, DialogFooter, HStack, VStack } from "@/components/common";
import { Body1Strong, Button, Checkbox, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";

interface ManageDialogProps {
  open: boolean;
  onClose: () => void;
  resourceName: string;
}

interface ManageItem {
  name: string;
  detail: string;
}

function ManageDialogBase({
  open,
  onClose,
  resourceName,
  titleKey,
  listLabelKey,
  detailsTitleKey,
  items,
  fields,
  commentsKey,
  updateKey,
}: ManageDialogProps & {
  titleKey: TranslationKey;
  listLabelKey: TranslationKey;
  detailsTitleKey: TranslationKey;
  items: ManageItem[];
  fields: {
    key: string;
    labelKey: TranslationKey;
    type: "text" | "select" | "checkbox";
    options?: string[];
  }[];
  commentsKey: TranslationKey;
  updateKey: TranslationKey;
}) {
  const { t } = useAppTranslation();
  const [list, setList] = useState<ManageItem[]>(items);
  const [selected, setSelected] = useState(0);
  const [fieldValues, setFieldValues] = useState<Record<string, string | boolean>>({});
  const [comments, setComments] = useState("");

  const addItem = () => {
    const next = [...list, { name: `New Item ${list.length + 1}`, detail: "" }];
    setList(next);
    setSelected(next.length - 1);
    setFieldValues({});
  };

  const removeItem = (index: number) => {
    const next = list.filter((_, i) => i !== index);
    setList(next.length > 0 ? next : [{ name: "New Item 1", detail: "" }]);
    setSelected(0);
    setFieldValues({});
  };

  const selectItem = (index: number) => {
    setSelected(index);
    setFieldValues({});
  };

  return (
    <BaseDialog
      open={open}
      title={t(titleKey)}
      onClose={onClose}
      width="min(1100px, 92vw)"
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(updateKey)} />}
    >
      <DialogEntityBanner icon="🔧" name={resourceName} />
      <HStack gap={16}>
        <div style={{ width: 320, flexShrink: 0 }}>
          <HStack align="center" justify="between" style={{ marginBottom: theme.spacing.sm }}>
            <Body1Strong>{t(listLabelKey, { count: list.length })}</Body1Strong>
            <HStack gap={theme.spacing.xs}>
              <Button size="sm" variant="subtle" onClick={addItem}>
                +
              </Button>
              <Button size="sm" variant="subtle" onClick={() => removeItem(selected)}>
                🗑
              </Button>
            </HStack>
          </HStack>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 4,
              minHeight: 300,
              overflow: "auto",
            }}
          >
            {list.map((item, i) => (
              <div
                key={`${item.name}-${i}`}
                onClick={() => selectItem(i)}
                style={{
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  cursor: "pointer",
                  backgroundColor: i === selected ? theme.color.brandSubtle : "transparent",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: theme.color.textSecondary }}>{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
        <VStack grow gap={theme.spacing.md}>
          <Body1Strong>{t(detailsTitleKey)}</Body1Strong>
          {fields.map((f) => (
            <Field key={f.key} label={t(f.labelKey)}>
              {f.type === "checkbox" ? (
                <Checkbox
                  checked={(fieldValues[f.key] as boolean) ?? false}
                  onChange={(checked) =>
                    setFieldValues({ ...fieldValues, [f.key]: checked === true })
                  }
                />
              ) : f.type === "select" ? (
                <select
                  value={(fieldValues[f.key] as string) ?? ""}
                  onChange={(e) => setFieldValues({ ...fieldValues, [f.key]: e.target.value })}
                >
                  {(f.options ?? []).map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  value={(fieldValues[f.key] as string) ?? ""}
                  onChange={(value) => setFieldValues({ ...fieldValues, [f.key]: value })}
                />
              )}
            </Field>
          ))}
        </VStack>
      </HStack>
      <Field label={t(commentsKey)}>
        <Input value={comments} onChange={setComments} />
      </Field>
    </BaseDialog>
  );
}

const U: TranslationKey = "businessData.resource.dialogs.manage.update";
const C: TranslationKey = "businessData.resource.dialogs.manage.comments";
const K0: TranslationKey = "businessData.resource.dialogs.manage.resourceStorageBinDetails";
const K1: TranslationKey = "businessData.resource.dialogs.manage.resourceStorageBins";
const K2: TranslationKey = "businessData.resource.dialogs.manage.resourceStorageBinsTitle";
const K3: TranslationKey = "businessData.resource.dialogs.manage.resourceTraineeDetails";
const K4: TranslationKey = "businessData.resource.dialogs.manage.resourceTrainees";
const K5: TranslationKey = "businessData.resource.dialogs.manage.resourceTraineesTitle";
const K6: TranslationKey = "businessData.resource.dialogs.manage.runAtRiskMaterialDetails";
const K7: TranslationKey = "businessData.resource.dialogs.manage.runAtRiskMaterials";
const K8: TranslationKey = "businessData.resource.dialogs.manage.runAtRiskMaterialsTitle";
const K9: TranslationKey = "businessData.resource.dialogs.manage.schedulingBatching";
const K10: TranslationKey = "businessData.resource.dialogs.manage.schedulingBatchingDetails";
const K11: TranslationKey = "businessData.resource.dialogs.manage.schedulingBatchingTitle";

const ITEMS_0: ManageItem[] = [{ name: "Bin-01", detail: "Enabled" }];
const ITEMS_1: ManageItem[] = [{ name: "Jane Smith", detail: "In Training" }];
const ITEMS_2: ManageItem[] = [{ name: "Material-001", detail: "At Risk" }];
const ITEMS_3: ManageItem[] = [{ name: "Schedule-01", detail: "Planned" }];

const FIELDS_0: {
  key: string;
  labelKey: TranslationKey;
  type: "text" | "select" | "checkbox";
  options?: string[];
}[] = [
  { key: "bin", labelKey: "businessData.resource.dialogs.manage.storageBin", type: "text" },
  {
    key: "description",
    labelKey: "businessData.resource.dialogs.manage.description",
    type: "text",
  },
  {
    key: "isEnabled",
    labelKey: "businessData.resource.dialogs.manage.isEnabled",
    type: "checkbox",
  },
];
const FIELDS_1: {
  key: string;
  labelKey: TranslationKey;
  type: "text" | "select" | "checkbox";
  options?: string[];
}[] = [
  { key: "trainee", labelKey: "businessData.resource.dialogs.manage.trainee", type: "text" },
  { key: "trainer", labelKey: "businessData.resource.dialogs.manage.trainer", type: "text" },
];
const FIELDS_2: {
  key: string;
  labelKey: TranslationKey;
  type: "text" | "select" | "checkbox";
  options?: string[];
}[] = [
  { key: "material", labelKey: "businessData.resource.dialogs.manage.material", type: "text" },
];
const FIELDS_3: {
  key: string;
  labelKey: TranslationKey;
  type: "text" | "select" | "checkbox";
  options?: string[];
}[] = [
  { key: "schedule", labelKey: "businessData.resource.dialogs.manage.schedule", type: "text" },
  { key: "startDate", labelKey: "businessData.resource.dialogs.manage.startDate", type: "text" },
  { key: "endDate", labelKey: "businessData.resource.dialogs.manage.endDate", type: "text" },
];

export function ManageResourceStorageBinsDialog(p: ManageDialogProps) {
  return (
    <ManageDialogBase
      {...p}
      titleKey={K2}
      listLabelKey={K1}
      detailsTitleKey={K0}
      items={ITEMS_0}
      fields={FIELDS_0}
      commentsKey={C}
      updateKey={U}
    />
  );
}

export function ManageResourceTraineesDialog(p: ManageDialogProps) {
  return (
    <ManageDialogBase
      {...p}
      titleKey={K5}
      listLabelKey={K4}
      detailsTitleKey={K3}
      items={ITEMS_1}
      fields={FIELDS_1}
      commentsKey={C}
      updateKey={U}
    />
  );
}

export function ManageRunAtRiskMaterialsDialog(p: ManageDialogProps) {
  return (
    <ManageDialogBase
      {...p}
      titleKey={K8}
      listLabelKey={K7}
      detailsTitleKey={K6}
      items={ITEMS_2}
      fields={FIELDS_2}
      commentsKey={C}
      updateKey={U}
    />
  );
}

export function ManageSchedulingBatchingDialog(p: ManageDialogProps) {
  return (
    <ManageDialogBase
      {...p}
      titleKey={K11}
      listLabelKey={K9}
      detailsTitleKey={K10}
      items={ITEMS_3}
      fields={FIELDS_3}
      commentsKey={C}
      updateKey={U}
    />
  );
}
