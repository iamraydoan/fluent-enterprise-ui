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
  fields: { key: string; labelKey: TranslationKey; type: "text" | "select" | "checkbox"; options?: string[] }[];
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
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Body1Strong>{t(listLabelKey, { count: list.length })}</Body1Strong>
                  <div style={{ display: "flex", columnGap: 4 }}>
                    <Button size="small" appearance="subtle" onClick={addItem}>+</Button>
                    <Button size="small" appearance="subtle" onClick={() => removeItem(selected)}>🗑</Button>
                  </div>
                </div>
                <div style={{ border: "1px solid #ddd", borderRadius: 4, minHeight: 300, overflow: "auto" }}>
                  {list.map((item, i) => (
                    <div
                      key={`${item.name}-${i}`}
                      onClick={() => selectItem(i)}
                      style={{
                        padding: "8px 12px", cursor: "pointer",
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
                        onChange={(_, d) => setFieldValues({ ...fieldValues, [f.key]: d.checked === true })}
                      />
                    ) : f.type === "select" ? (
                      <select
                        value={(fieldValues[f.key] as string) ?? ""}
                        onChange={(e) => setFieldValues({ ...fieldValues, [f.key]: e.target.value })}
                      >
                        {(f.options ?? []).map((o) => (
                          <option key={o} value={o}>{o}</option>
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
            <Button appearance="secondary" onClick={onClose}>{t("common.cancel")}</Button>
            <Button appearance="primary" onClick={onClose}>{t(updateKey)}</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

const U: TranslationKey = "businessData.resource.dialogs.manage.update";
const C: TranslationKey = "businessData.resource.dialogs.manage.comments";
const K0: TranslationKey = "businessData.resource.dialogs.manage.resourceLaneDetails";
const K1: TranslationKey = "businessData.resource.dialogs.manage.resourceLanes";
const K2: TranslationKey = "businessData.resource.dialogs.manage.resourceLanesTitle";
const K3: TranslationKey = "businessData.resource.dialogs.manage.resourceLocationDetails";
const K4: TranslationKey = "businessData.resource.dialogs.manage.resourceLocations";
const K5: TranslationKey = "businessData.resource.dialogs.manage.resourceLocationsTitle";
const K6: TranslationKey = "businessData.resource.dialogs.manage.resourceMaterialConsumableDetails";
const K7: TranslationKey = "businessData.resource.dialogs.manage.resourceMaterialConsumables";
const K8: TranslationKey = "businessData.resource.dialogs.manage.resourceMaterialConsumablesTitle";
const K9: TranslationKey = "businessData.resource.dialogs.manage.resourceMaterialDurableDetails";
const K10: TranslationKey = "businessData.resource.dialogs.manage.resourceMaterialDurables";
const K11: TranslationKey = "businessData.resource.dialogs.manage.resourceMaterialDurablesTitle";
const K12: TranslationKey = "businessData.resource.dialogs.manage.resourcePartDetails";
const K13: TranslationKey = "businessData.resource.dialogs.manage.resourceParts";
const K14: TranslationKey = "businessData.resource.dialogs.manage.resourcePartsTitle";

const ITEMS_0: ManageItem[] = [{ name: "Lane-1", detail: "Active" }];
const ITEMS_1: ManageItem[] = [{ name: "Location-01", detail: "Active" }];
const ITEMS_2: ManageItem[] = [{ name: "Material-Consumable-01", detail: "Active" }];
const ITEMS_3: ManageItem[] = [{ name: "Material-Durable-01", detail: "Active" }];
const ITEMS_4: ManageItem[] = [{ name: "Heating Element", detail: "Active" }];



const FIELDS_0: { key: string; labelKey: TranslationKey; type: "text" | "select" | "checkbox"; options?: string[] }[] = [
        { key: "lane", labelKey: "businessData.resource.dialogs.manage.lane", type: "text" },
        { key: "description", labelKey: "businessData.resource.dialogs.manage.description", type: "text" },
        { key: "currentRecipe", labelKey: "businessData.resource.dialogs.manage.currentRecipe", type: "text" },
      ];
const FIELDS_1: { key: string; labelKey: TranslationKey; type: "text" | "select" | "checkbox"; options?: string[] }[] = [
        { key: "location", labelKey: "businessData.resource.dialogs.manage.location", type: "text" },
        { key: "description", labelKey: "businessData.resource.dialogs.manage.description", type: "text" },
        { key: "barcodeId", labelKey: "businessData.resource.dialogs.manage.barcodeId", type: "text" },
        { key: "locationX", labelKey: "businessData.resource.dialogs.manage.locationX", type: "text" },
        { key: "locationY", labelKey: "businessData.resource.dialogs.manage.locationY", type: "text" },
      ];
const FIELDS_2: { key: string; labelKey: TranslationKey; type: "text" | "select" | "checkbox"; options?: string[] }[] = [
        { key: "material", labelKey: "businessData.resource.dialogs.manage.material", type: "text" },
        { key: "consumable", labelKey: "businessData.resource.dialogs.manage.consumable", type: "text" },
      ];
const FIELDS_3: { key: string; labelKey: TranslationKey; type: "text" | "select" | "checkbox"; options?: string[] }[] = [
        { key: "material", labelKey: "businessData.resource.dialogs.manage.material", type: "text" },
        { key: "durable", labelKey: "businessData.resource.dialogs.manage.durable", type: "text" },
      ];
const FIELDS_4: { key: string; labelKey: TranslationKey; type: "text" | "select" | "checkbox"; options?: string[] }[] = [
        { key: "part", labelKey: "businessData.resource.dialogs.manage.part", type: "text" },
        { key: "description", labelKey: "businessData.resource.dialogs.manage.description", type: "text" },
      ];

export function ManageResourceLanesDialog(p: ManageDialogProps) {
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

export function ManageResourceLocationsDialog(p: ManageDialogProps) {
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

export function ManageResourceMaterialConsumablesDialog(p: ManageDialogProps) {
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

export function ManageResourceMaterialDurablesDialog(p: ManageDialogProps) {
    return (
    <ManageDialogBase
      {...p}
      titleKey={K11}
      listLabelKey={K10}
      detailsTitleKey={K9}
      items={ITEMS_3}
      fields={FIELDS_3}
      commentsKey={C}
      updateKey={U}
    />
  );
}

export function ManageResourcePartsDialog(p: ManageDialogProps) {
    return (
    <ManageDialogBase
      {...p}
      titleKey={K14}
      listLabelKey={K13}
      detailsTitleKey={K12}
      items={ITEMS_4}
      fields={FIELDS_4}
      commentsKey={C}
      updateKey={U}
    />
  );
}
