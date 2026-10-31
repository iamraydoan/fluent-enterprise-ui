import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Add24Regular, Delete20Regular } from "@/components/icons";
import {
  Button,
  Input,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Text,
  tokens,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { REPORTING_TYPES } from "../productGroupOptions";
import { Field } from "./DialogPrimitives";
import { useDialogStyles, PARAM_TYPES } from "./dialogShared";
import type { DialogProps } from "./dialogShared";

interface ProductGroupParameter {
  id: string;
  parameter: string;
  unit: string;
  type: "Characteristic" | "Specification";
  value: string;
  lowerSpec: string;
  targetSpec: string;
  upperSpec: string;
  reportingType: string;
  reportingInfo: string;
}

export function ManageProductGroupParametersDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [params, setParams] = useState<ProductGroupParameter[]>([
    {
      id: "1",
      parameter: "Thickness",
      unit: "",
      type: "Characteristic",
      value: "",
      lowerSpec: "",
      targetSpec: "",
      upperSpec: "",
      reportingType: "Non-Critical",
      reportingInfo: "",
    },
  ]);
  const [selectedId, setSelectedId] = useState("1");
  const [comments, setComments] = useState("");

  const selected = params.find((p) => p.id === selectedId);

  const addParam = () => {
    const id = String(Date.now());
    setParams([
      ...params,
      {
        id,
        parameter: "",
        unit: "",
        type: "Characteristic",
        value: "",
        lowerSpec: "",
        targetSpec: "",
        upperSpec: "",
        reportingType: "Non-Critical",
        reportingInfo: "",
      },
    ]);
    setSelectedId(id);
  };

  const removeParam = (id: string) => {
    const next = params.filter((p) => p.id !== id);
    setParams(next);
    if (selectedId === id && next.length > 0) setSelectedId(next[0].id);
  };

  const updateSelected = (patch: Partial<ProductGroupParameter>) => {
    setParams(params.map((p) => (p.id === selectedId ? { ...p, ...patch } : p)));
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    onSubmit?.();
    handleClose();
  };

  return (
    <BaseDialog
      open={open}
      onClose={handleClose}
      title={t("businessData.productGroup.operations.manageParameters.title")}
      width="min(1100px, 100%)"
      footer={
        <DialogFooter
          onCancel={handleClose}
          onConfirm={handleSubmit}
          confirmLabel={t("businessData.productGroup.operations.manageParameters.submit")}
        />
      }
    >
      <div style={{ display: "flex", gap: "20px", minHeight: "420px" }}>
        <div style={{ width: "300px", flexShrink: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <Text weight="semibold">
              {t("businessData.productGroup.operations.manageParameters.parameters")}
            </Text>
            <div style={{ display: "flex", gap: "4px" }}>
              <Button appearance="subtle" icon={<Add24Regular />} onClick={addParam} />
              {selected && (
                <Button
                  appearance="subtle"
                  icon={<Delete20Regular />}
                  onClick={() => removeParam(selected.id)}
                />
              )}
            </div>
          </div>
          <div
            style={{
              border: `1px solid ${tokens.colorNeutralStroke2}`,
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            {params.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                style={{
                  padding: "10px 12px",
                  cursor: "pointer",
                  backgroundColor:
                    p.id === selectedId ? tokens.colorBrandBackground2 : "transparent",
                  borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text>
                  {p.parameter ||
                    t("businessData.productGroup.operations.manageParameters.newParam")}
                </Text>
                <Button
                  appearance="subtle"
                  icon={<Delete20Regular />}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeParam(p.id);
                  }}
                />
              </div>
            ))}
            {params.length === 0 && (
              <div
                style={{
                  padding: "16px",
                  textAlign: "center",
                  color: tokens.colorNeutralForeground3,
                }}
              >
                {t("businessData.productGroup.operations.manageParameters.empty")}
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <Text weight="semibold" style={{ marginBottom: "16px", display: "block" }}>
            {t("businessData.productGroup.operations.manageParameters.parameterDetails")}
          </Text>
          {selected ? (
            <>
              <Field
                label={t("businessData.productGroup.operations.manageParameters.fields.parameter")}
                required
              >
                <Input
                  value={selected.parameter}
                  onChange={(_, d) => updateSelected({ parameter: d.value })}
                  placeholder={t(
                    "businessData.productGroup.operations.create.placeholders.selectParameter",
                  )}
                />
              </Field>
              <Field label={t("businessData.productGroup.operations.manageParameters.fields.unit")}>
                <Input
                  value={selected.unit}
                  onChange={(_, d) => updateSelected({ unit: d.value })}
                />
              </Field>
              <Field label={t("businessData.productGroup.operations.manageParameters.fields.type")}>
                <div style={{ display: "flex", gap: "16px" }}>
                  {PARAM_TYPES.map((opt) => (
                    <label
                      key={opt}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="paramType"
                        checked={selected.type === opt}
                        onChange={() => updateSelected({ type: opt })}
                      />
                      {t(
                        `businessData.productGroup.operations.manageParameters.types.${opt.toLowerCase()}` as never,
                      )}
                    </label>
                  ))}
                </div>
              </Field>
              {selected.type === "Characteristic" ? (
                <Field
                  label={t("businessData.productGroup.operations.manageParameters.fields.value")}
                >
                  <Input
                    value={selected.value}
                    onChange={(_, d) => updateSelected({ value: d.value })}
                    style={{ maxWidth: "280px" }}
                  />
                </Field>
              ) : (
                <>
                  <div className={styles.row}>
                    <div className={styles.col}>
                      <Field
                        label={t(
                          "businessData.productGroup.operations.manageParameters.fields.lowerSpec",
                        )}
                      >
                        <Input
                          value={selected.lowerSpec}
                          onChange={(_, d) => updateSelected({ lowerSpec: d.value })}
                        />
                      </Field>
                    </div>
                    <div className={styles.col}>
                      <Field
                        label={t(
                          "businessData.productGroup.operations.manageParameters.fields.targetSpec",
                        )}
                      >
                        <Input
                          value={selected.targetSpec}
                          onChange={(_, d) => updateSelected({ targetSpec: d.value })}
                        />
                      </Field>
                    </div>
                    <div className={styles.col}>
                      <Field
                        label={t(
                          "businessData.productGroup.operations.manageParameters.fields.upperSpec",
                        )}
                      >
                        <Input
                          value={selected.upperSpec}
                          onChange={(_, d) => updateSelected({ upperSpec: d.value })}
                        />
                      </Field>
                    </div>
                  </div>
                </>
              )}
              <Field
                label={t(
                  "businessData.productGroup.operations.manageParameters.fields.reportingType",
                )}
                hint={t(
                  "businessData.productGroup.operations.manageParameters.hints.reportingType",
                )}
              >
                <Menu>
                  <MenuTrigger disableButtonEnhancement>
                    <Button style={{ width: "100%", justifyContent: "space-between" }}>
                      {selected.reportingType}
                    </Button>
                  </MenuTrigger>
                  <MenuPopover>
                    <MenuList>
                      {REPORTING_TYPES.map((opt) => (
                        <MenuItem key={opt} onClick={() => updateSelected({ reportingType: opt })}>
                          {opt}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </MenuPopover>
                </Menu>
              </Field>
              <Field
                label={t(
                  "businessData.productGroup.operations.manageParameters.fields.reportingInfo",
                )}
              >
                <Input
                  value={selected.reportingInfo}
                  onChange={(_, d) => updateSelected({ reportingInfo: d.value })}
                />
              </Field>
            </>
          ) : (
            <div style={{ color: tokens.colorNeutralForeground3, fontSize: "13px" }}>
              {t("businessData.productGroup.operations.manageParameters.selectPrompt")}
            </div>
          )}
        </div>
      </div>
      <Field label={t("businessData.productGroup.operations.manageParameters.fields.comments")}>
        <Input
          value={comments}
          onChange={(_, d) => setComments(d.value)}
          placeholder={t("businessData.productGroup.operations.create.placeholders.enterComments")}
        />
      </Field>
    </BaseDialog>
  );
}
