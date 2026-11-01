import { useState } from "react";
import { BaseDialog, FormField, HStack  } from "@/components/common";
import { Button, Checkbox, Input, Textarea, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";
import { MODE_CREATE, MODE_EDIT } from "../../components/wizardMode";
import type { WizardMode } from "../../components/wizardMode";

const L: Record<string, TranslationKey> = {
  createTitle: "businessData.facility.dialog.createTitle",
  editTitle: "businessData.facility.dialog.editTitle",
  cloneTitle: "businessData.facility.dialog.cloneTitle",
  step1: "businessData.facility.dialog.step1",
  step2: "businessData.facility.dialog.step2",
  name: "businessData.facility.dialog.name",
  description: "businessData.facility.dialog.description",
  type: "businessData.facility.dialog.type",
  dataGroup: "businessData.facility.dialog.dataGroup",
  displayOrder: "businessData.facility.dialog.displayOrder",
  defaultCalendar: "businessData.facility.dialog.defaultCalendar",
  site: "businessData.facility.dialog.site",
  remote: "businessData.facility.dialog.remote",
  terminateOnShip: "businessData.facility.dialog.terminateOnShip",
  back: "businessData.facility.dialog.back",
  next: "businessData.facility.dialog.next",
  cancel: "businessData.facility.dialog.cancel",
  create: "businessData.facility.dialog.create",
  save: "businessData.facility.dialog.save",
  clone: "businessData.facility.dialog.clone",
};

const useStyles = makeStyles({
  steps: {
    padding: "4px 4px 12px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    marginBottom: theme.spacing.xs,
  },
  step: { fontSize: theme.font.sizeSm, color: theme.color.textTertiary },
  stepActive: {
    fontSize: theme.font.sizeSm,
    fontWeight: theme.font.weightSemibold,
    color: theme.color.textBrand,
  },
  select: {
    padding: `6px ${theme.spacing.sm}`,
    border: `1px solid ${theme.color.border}`,
    borderRadius: theme.radius.md,
    fontSize: theme.font.sizeMd,
    backgroundColor: theme.color.surface,
  },
});

interface DialogProps {
  mode: WizardMode;
  initialName?: string;
  onClose: () => void;
}

export function FacilityDialog({ mode, initialName, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initialName ?? "");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [dataGroup, setDataGroup] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [defaultCalendar, setDefaultCalendar] = useState("");
  const [site, setSite] = useState("");
  const [remote, setRemote] = useState(false);
  const [terminateOnShip, setTerminateOnShip] = useState(false);

  const title =
    mode === MODE_CREATE ? L.createTitle : mode === MODE_EDIT ? L.editTitle : L.cloneTitle;
  const canSubmit =
    name.trim().length > 0 && type.trim().length > 0 && displayOrder.trim().length > 0;

  return (
    <BaseDialog
      open
      title={t(title)}
      width="640px"
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          {step > 1 && <Button onClick={() => setStep(step - 1)}>{t(L.back)}</Button>}
          {step < 2 ? (
            <Button variant="primary" onClick={() => setStep(step + 1)} disabled={!canSubmit}>
              {t(L.next)}
            </Button>
          ) : (
            <Button variant="primary" onClick={onClose}>
              {t(mode === MODE_CREATE ? L.create : mode === MODE_EDIT ? L.save : L.clone)}
            </Button>
          )}
        </>
      }
    >
      <HStack gap="16px" className={styles.steps}>
        <span className={step === 1 ? styles.stepActive : styles.step}>{t(L.step1)}</span>
        <span className={step === 2 ? styles.stepActive : styles.step}>{t(L.step2)}</span>
      </HStack>
      {step === 1 && (
        <>
          <FormField
            label={
              <>
                <span style={{ color: theme.color.textDanger }}>* </span>
                {t(L.name)}
              </>
            }
            labelWidth="200px"
          >
            <Input value={name} onChange={setName} disabled={mode === MODE_EDIT} />
          </FormField>
          <FormField label={<>{t(L.description)}</>} labelWidth="200px">
            <Textarea value={description} onChange={setDescription} />
          </FormField>
          <FormField
            label={
              <>
                <span style={{ color: theme.color.textDanger }}>* </span>
                {t(L.type)}
              </>
            }
            labelWidth="200px"
          >
            <select
              className={styles.select}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">{t("common.none")}</option>
              <option value="Manufacturing">
                {t("businessData.facility.dialog.typeManufacturing")}
              </option>
              <option value="Distribution Center">
                {t("businessData.facility.dialog.typeDistribution")}
              </option>
              <option value="Warehouse">{t("businessData.facility.dialog.typeWarehouse")}</option>
            </select>
          </FormField>
          <FormField label={<>{t(L.dataGroup)}</>} labelWidth="200px">
            <Input value={dataGroup} onChange={setDataGroup} />
          </FormField>
        </>
      )}
      {step === 2 && (
        <>
          <FormField
            label={
              <>
                <span style={{ color: theme.color.textDanger }}>* </span>
                {t(L.displayOrder)}
              </>
            }
            labelWidth="200px"
          >
            <Input value={displayOrder} onChange={setDisplayOrder} />
          </FormField>
          <FormField label={<>{t(L.defaultCalendar)}</>} labelWidth="200px">
            <Input value={defaultCalendar} onChange={setDefaultCalendar} />
          </FormField>
          <FormField label={<>{t(L.site)}</>} labelWidth="200px">
            <Input value={site} onChange={setSite} />
          </FormField>
          <FormField label={<>{t(L.remote)}</>} labelWidth="200px">
            <Checkbox checked={remote === true} onChange={setRemote} disabled />
          </FormField>
          <FormField label={<>{t(L.terminateOnShip)}</>} labelWidth="200px">
            <Checkbox
              checked={terminateOnShip === true}
              onChange={setTerminateOnShip}
              disabled={remote}
            />
          </FormField>
        </>
      )}
    </BaseDialog>
  );
}
