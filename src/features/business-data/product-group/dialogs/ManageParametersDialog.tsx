import { useState } from "react";
import { BaseDialog, DialogFooter, HStack } from "@/components/common";
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
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";
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
      <HStack gap="20px" style={{ minHeight: "420px" }}>
        <div style={{ width: "300px", flexShrink: 0 }}>
          <HStack align="center" justify="space-between" style={{ marginBottom: theme.spacing.md }}>
            <Text weight="semibold">
              {t("businessData.productGroup.operations.manageParameters.parameters")}
            </Text>
            <HStack gap="4px">
              <Button variant="subtle" icon={<Add24Regular />} onClick={addParam} />
              {selected && (
                <Button
                  variant="subtle"
                  icon={<Delete20Regular />}
                  onClick={() => removeParam(selected.id)}
                />
              )}
            </HStack>
          </HStack>
          <div
            style={{
              border: `1px solid ${theme.color.borderSubtle}`,
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            {params.map((p) => (
              <HStack
                align="center"
                justify="space-between"
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                style={{
                  padding: "10px 12px",
                  cursor: "pointer",
                  backgroundColor: p.id === selectedId ? theme.color.brandSubtle : "transparent",
                  borderBottom: `1px solid ${theme.color.borderSubtle}`,
                }}
              >
                <Text>
                  {p.parameter ||
                    t("businessData.productGroup.operations.manageParameters.newParam")}
                </Text>
                <Button
                  variant="subtle"
                  icon={<Delete20Regular />}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeParam(p.id);
                  }}
                />
              </HStack>
            ))}
            {params.length === 0 && (
              <div
                style={{
                  padding: theme.spacing.lg,
                  textAlign: "center",
                  color: theme.color.textTertiary,
                }}
              >
                {t("businessData.productGroup.operations.manageParameters.empty")}
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <Text weight="semibold" style={{ marginBottom: theme.spacing.lg, display: "block" }}>
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
                  onChange={(value) => updateSelected({ parameter: value })}
                  placeholder={t(
                    "businessData.productGroup.operations.create.placeholders.selectParameter",
                  )}
                />
              </Field>
              <Field label={t("businessData.productGroup.operations.manageParameters.fields.unit")}>
                <Input
                  value={selected.unit}
                  onChange={(value) => updateSelected({ unit: value })}
                />
              </Field>
              <Field label={t("businessData.productGroup.operations.manageParameters.fields.type")}>
                <HStack gap="16px">
                  {PARAM_TYPES.map((opt) => (
                    <label key={opt} style={{ fontSize: "13px", cursor: "pointer" }}>
                      <HStack align="center" gap="6px">
                        <input
                          type="radio"
                          name="paramType"
                          checked={selected.type === opt}
                          onChange={() => updateSelected({ type: opt })}
                        />
                        {t(
                          `businessData.productGroup.operations.manageParameters.types.${opt.toLowerCase()}` as never,
                        )}
                      </HStack>
                    </label>
                  ))}
                </HStack>
              </Field>
              {selected.type === "Characteristic" ? (
                <Field
                  label={t("businessData.productGroup.operations.manageParameters.fields.value")}
                >
                  <Input
                    value={selected.value}
                    onChange={(value) => updateSelected({ value: value })}
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
                          onChange={(value) => updateSelected({ lowerSpec: value })}
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
                          onChange={(value) => updateSelected({ targetSpec: value })}
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
                          onChange={(value) => updateSelected({ upperSpec: value })}
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
                  onChange={(value) => updateSelected({ reportingInfo: value })}
                />
              </Field>
            </>
          ) : (
            <div style={{ color: theme.color.textTertiary, fontSize: "13px" }}>
              {t("businessData.productGroup.operations.manageParameters.selectPrompt")}
            </div>
          )}
        </div>
      </HStack>
      <Field label={t("businessData.productGroup.operations.manageParameters.fields.comments")}>
        <Input
          value={comments}
          onChange={setComments}
          placeholder={t("businessData.productGroup.operations.create.placeholders.enterComments")}
        />
      </Field>
    </BaseDialog>
  );
}
