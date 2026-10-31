import { useState } from "react";
import {
  Body1Strong,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Field,
  Input,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

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
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 1100, width: "92vw" }}>
        <DialogBody>
          <DialogTitle>{t(titleKey)}</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>🔧 {resourceName}</div>
            <div style={{ display: "flex", columnGap: 16 }}>
              <div style={{ width: 320, flexShrink: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Body1Strong>{t(listLabelKey, { count: list.length })}</Body1Strong>
                  <div style={{ display: "flex", columnGap: 4 }}>
                    <Button size="small" appearance="subtle" onClick={addItem}>
                      +
                    </Button>
                    <Button size="small" appearance="subtle" onClick={() => removeItem(selected)}>
                      🗑
                    </Button>
                  </div>
                </div>
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
                        padding: "8px 12px",
                        cursor: "pointer",
                        backgroundColor: i === selected ? "#e3f2fd" : "transparent",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>{item.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", rowGap: 12 }}>
                <Body1Strong>{t(detailsTitleKey)}</Body1Strong>
                {fields.map((f) => (
                  <Field key={f.key} label={t(f.labelKey)}>
                    {f.type === "checkbox" ? (
                      <Checkbox
                        checked={(fieldValues[f.key] as boolean) ?? false}
                        onChange={(_, d) =>
                          setFieldValues({ ...fieldValues, [f.key]: d.checked === true })
                        }
                      />
                    ) : f.type === "select" ? (
                      <select
                        value={(fieldValues[f.key] as string) ?? ""}
                        onChange={(e) =>
                          setFieldValues({ ...fieldValues, [f.key]: e.target.value })
                        }
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
                        onChange={(_, d) => setFieldValues({ ...fieldValues, [f.key]: d.value })}
                      />
                    )}
                  </Field>
                ))}
              </div>
            </div>
            <Field label={t(commentsKey)}>
              <Input value={comments} onChange={(_, d) => setComments(d.value)} />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button appearance="primary" onClick={onClose}>
              {t(updateKey)}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

const U: TranslationKey = "businessData.resource.dialogs.manage.update";
const C: TranslationKey = "businessData.resource.dialogs.manage.comments";
const K0: TranslationKey = "businessData.resource.dialogs.manage.consumableFeedDetails";
const K1: TranslationKey = "businessData.resource.dialogs.manage.consumableFeeds";
const K2: TranslationKey = "businessData.resource.dialogs.manage.consumableFeedsTitle";
const K3: TranslationKey = "businessData.resource.dialogs.manage.recipeDetails";
const K4: TranslationKey = "businessData.resource.dialogs.manage.recipes";
const K5: TranslationKey = "businessData.resource.dialogs.manage.recipesTitle";
const K6: TranslationKey = "businessData.resource.dialogs.manage.runningModeDetails";
const K7: TranslationKey = "businessData.resource.dialogs.manage.runningModes";
const K8: TranslationKey = "businessData.resource.dialogs.manage.runningModesTitle";
const K9: TranslationKey = "businessData.resource.dialogs.manage.serviceDetails";
const K10: TranslationKey = "businessData.resource.dialogs.manage.services";
const K11: TranslationKey = "businessData.resource.dialogs.manage.servicesTitle";
const K12: TranslationKey = "businessData.resource.dialogs.manage.structure";
const K13: TranslationKey = "businessData.resource.dialogs.manage.structureDetails";
const K14: TranslationKey = "businessData.resource.dialogs.manage.structureTitle";

const ITEMS_0: ManageItem[] = [{ name: "Dispatch Material", detail: "Priority 1" }];
const ITEMS_1: ManageItem[] = [{ name: "Baking Cookies", detail: "Enabled" }];
const ITEMS_2: ManageItem[] = [{ name: "Sub-Resource-1", detail: "Process" }];
const ITEMS_3: ManageItem[] = [{ name: "Normal", detail: "Default" }];
const ITEMS_4: ManageItem[] = [{ name: "Feed-01", detail: "Active" }];

const FIELDS_0: {
  key: string;
  labelKey: TranslationKey;
  type: "text" | "select" | "checkbox";
  options?: string[];
}[] = [
  { key: "service", labelKey: "businessData.resource.dialogs.manage.service", type: "text" },
  { key: "priority", labelKey: "businessData.resource.dialogs.manage.priority", type: "text" },
  {
    key: "requiresRunningMode",
    labelKey: "businessData.resource.dialogs.manage.requiresRunningMode",
    type: "checkbox",
  },
  {
    key: "isEnabled",
    labelKey: "businessData.resource.dialogs.manage.isEnabled",
    type: "checkbox",
  },
  {
    key: "qualificationCheck",
    labelKey: "businessData.resource.dialogs.manage.qualificationCheck",
    type: "text",
  },
];
const FIELDS_1: {
  key: string;
  labelKey: TranslationKey;
  type: "text" | "select" | "checkbox";
  options?: string[];
}[] = [
  { key: "recipe", labelKey: "businessData.resource.dialogs.manage.recipe", type: "text" },
  {
    key: "isEnabled",
    labelKey: "businessData.resource.dialogs.manage.isEnabled",
    type: "checkbox",
  },
  {
    key: "qualificationCheck",
    labelKey: "businessData.resource.dialogs.manage.qualificationCheck",
    type: "text",
  },
];
const FIELDS_2: {
  key: string;
  labelKey: TranslationKey;
  type: "text" | "select" | "checkbox";
  options?: string[];
}[] = [
  { key: "resource", labelKey: "businessData.resource.dialogs.manage.resource", type: "text" },
  {
    key: "parentResource",
    labelKey: "businessData.resource.dialogs.manage.parentResource",
    type: "text",
  },
];
const FIELDS_3: {
  key: string;
  labelKey: TranslationKey;
  type: "text" | "select" | "checkbox";
  options?: string[];
}[] = [
  {
    key: "runningMode",
    labelKey: "businessData.resource.dialogs.manage.runningMode",
    type: "text",
  },
  {
    key: "description",
    labelKey: "businessData.resource.dialogs.manage.description",
    type: "text",
  },
];
const FIELDS_4: {
  key: string;
  labelKey: TranslationKey;
  type: "text" | "select" | "checkbox";
  options?: string[];
}[] = [
  {
    key: "consumableFeed",
    labelKey: "businessData.resource.dialogs.manage.consumableFeed",
    type: "text",
  },
  { key: "isShared", labelKey: "businessData.resource.dialogs.manage.isShared", type: "checkbox" },
];

export function ManageResourceServicesDialog(p: ManageDialogProps) {
  return (
    <ManageDialogBase
      {...p}
      titleKey={K11}
      listLabelKey={K10}
      detailsTitleKey={K9}
      items={ITEMS_0}
      fields={FIELDS_0}
      commentsKey={C}
      updateKey={U}
    />
  );
}

export function ManageResourceRecipesDialog(p: ManageDialogProps) {
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

export function ManageStructureDialog(p: ManageDialogProps) {
  return (
    <ManageDialogBase
      {...p}
      titleKey={K14}
      listLabelKey={K12}
      detailsTitleKey={K13}
      items={ITEMS_2}
      fields={FIELDS_2}
      commentsKey={C}
      updateKey={U}
    />
  );
}

export function ManageRunningModesDialog(p: ManageDialogProps) {
  return (
    <ManageDialogBase
      {...p}
      titleKey={K8}
      listLabelKey={K7}
      detailsTitleKey={K6}
      items={ITEMS_3}
      fields={FIELDS_3}
      commentsKey={C}
      updateKey={U}
    />
  );
}

export function ManageConsumableFeedsDialog(p: ManageDialogProps) {
  return (
    <ManageDialogBase
      {...p}
      titleKey={K2}
      listLabelKey={K1}
      detailsTitleKey={K0}
      items={ITEMS_4}
      fields={FIELDS_4}
      commentsKey={C}
      updateKey={U}
    />
  );
}
