import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import {
  Button,
  Checkbox,
  Input,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  tokens,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { TERMINATE_LEVELS } from "../productGroupOptions";
import { WizardSteps, Field } from "./DialogPrimitives";
import type { DialogProps } from "./dialogShared";

export function TerminateProductGroupDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const [level, setLevel] = useState("Revision");

  const handleClose = () => {
    setLevel("Revision");
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
      title={t("businessData.productGroup.operations.terminate.title")}
      size="xl"
      footer={
        <DialogFooter
          onCancel={handleClose}
          onConfirm={handleSubmit}
          confirmLabel={t("businessData.productGroup.operations.terminate.submit")}
        />
      }
    >
      <Field label={t("businessData.productGroup.operations.terminate.fields.level")}>
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button style={{ width: "100%", justifyContent: "space-between" }}>{level}</Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {TERMINATE_LEVELS.map((opt) => (
                <MenuItem key={opt} onClick={() => setLevel(opt)}>
                  {opt}
                </MenuItem>
              ))}
            </MenuList>
          </MenuPopover>
        </Menu>
      </Field>
      <div
        style={{
          padding: "12px",
          backgroundColor: tokens.colorPaletteYellowBackground1,
          borderRadius: "4px",
          fontSize: "13px",
          marginTop: "8px",
        }}
      >
        {t("businessData.productGroup.operations.terminate.warning")}
      </div>
    </BaseDialog>
  );
}

export function UnterminateProductGroupDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const [step, setStep] = useState(0);
  const [useAutoChangeSet, setUseAutoChangeSet] = useState(false);

  const handleClose = () => {
    setStep(0);
    setUseAutoChangeSet(false);
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
      title={t("businessData.productGroup.operations.unterminate.title")}
      size="xl"
      footer={
        <>
          <Button onClick={handleClose}>
            {t("businessData.productGroup.operations.unterminate.cancel")}
          </Button>
          {step > 0 && (
            <Button onClick={() => setStep(step - 1)}>
              {t("businessData.productGroup.operations.unterminate.back")}
            </Button>
          )}
          {step < 1 ? (
            <Button appearance="primary" onClick={() => setStep(step + 1)}>
              {t("businessData.productGroup.operations.unterminate.next")}
            </Button>
          ) : (
            <Button appearance="primary" onClick={handleSubmit}>
              {t("businessData.productGroup.operations.unterminate.submit")}
            </Button>
          )}
        </>
      }
    >
      <WizardSteps
        steps={[
          t("businessData.productGroup.operations.unterminate.steps.changeSet"),
          t("businessData.productGroup.operations.unterminate.steps.details"),
        ]}
        current={step}
      />
      <div style={{ paddingTop: "16px" }}>
        {step === 0 && (
          <>
            <Field label={t("businessData.productGroup.operations.unterminate.fields.changeSet")}>
              <Input
                placeholder={t(
                  "businessData.productGroup.operations.create.placeholders.selectChangeSet",
                )}
                disabled={useAutoChangeSet}
              />
            </Field>
            <Field
              label={t("businessData.productGroup.operations.unterminate.fields.approvalRole")}
            >
              <Input
                placeholder={t(
                  "businessData.productGroup.operations.create.placeholders.selectApprovalRole",
                )}
              />
            </Field>
            <Checkbox
              checked={useAutoChangeSet}
              onChange={(_, d) => setUseAutoChangeSet(d.checked === true)}
              label={t(
                "businessData.productGroup.operations.unterminate.fields.useAutomaticChangeSet",
              )}
            />
          </>
        )}
        {step === 1 && (
          <div style={{ fontSize: "13px", color: tokens.colorNeutralForeground2 }}>
            {t("businessData.productGroup.operations.unterminate.detailsText")}
          </div>
        )}
      </div>
    </BaseDialog>
  );
}
