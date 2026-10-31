import { useState } from "react";
import { BaseDialog, FormField } from "@/components/common";
import { Button, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { MODE_CREATE, MODE_EDIT } from "../../components/wizardMode";
import type { WizardMode } from "../../components/wizardMode";

const L: Record<string, TranslationKey> = {
  createTitle: "businessData.kpi.dialog.createTitle",
  editTitle: "businessData.kpi.dialog.editTitle",
  cloneTitle: "businessData.kpi.dialog.cloneTitle",
  name: "businessData.kpi.dialog.name",
  description: "businessData.kpi.dialog.description",
  type: "businessData.kpi.dialog.type",
  sourceType: "businessData.kpi.dialog.sourceType",
  sourceTypeStatic: "businessData.kpi.dialog.sourceTypeStatic",
  sourceTypeDynamic: "businessData.kpi.dialog.sourceTypeDynamic",
  entityType: "businessData.kpi.dialog.entityType",
  parameter: "businessData.kpi.dialog.parameter",
  kpiType: "businessData.kpi.dialog.kpiType",
  kpiTypeMaximum: "businessData.kpi.dialog.kpiTypeMaximum",
  kpiTypeMinimum: "businessData.kpi.dialog.kpiTypeMinimum",
  kpiTypeDeviation: "businessData.kpi.dialog.kpiTypeDeviation",
  frequency: "businessData.kpi.dialog.frequency",
  frequencyDaily: "businessData.kpi.dialog.frequencyDaily",
  frequencyWeekly: "businessData.kpi.dialog.frequencyWeekly",
  frequencyMonthly: "businessData.kpi.dialog.frequencyMonthly",
  frequencyYearly: "businessData.kpi.dialog.frequencyYearly",
  ownerRole: "businessData.kpi.dialog.ownerRole",
  cancel: "businessData.kpi.dialog.cancel",
  create: "businessData.kpi.dialog.create",
  save: "businessData.kpi.dialog.save",
  clone: "businessData.kpi.dialog.clone",
};

const useStyles = makeStyles({
  select: {
    padding: "6px 8px",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase300,
    backgroundColor: tokens.colorNeutralBackground1,
  },
});

interface DialogProps {
  mode: WizardMode;
  initialName?: string;
  onClose: () => void;
}

export function KpiDialog({ mode, initialName, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const [name, setName] = useState(initialName ?? "");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [sourceType, setSourceType] = useState("Static");
  const [entityType, setEntityType] = useState("");
  const [parameter, setParameter] = useState("");
  const [kpiType, setKpiType] = useState("Maximum");
  const [frequency, setFrequency] = useState("Daily");
  const [ownerRole, setOwnerRole] = useState("");

  const title =
    mode === MODE_CREATE ? L.createTitle : mode === MODE_EDIT ? L.editTitle : L.cloneTitle;
  const canSubmit = name.trim().length > 0;

  return (
    <BaseDialog
      open
      title={t(title)}
      width="640px"
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t(L.cancel)}
          </Button>
          <Button appearance="primary" onClick={onClose} disabled={!canSubmit}>
            {t(mode === MODE_CREATE ? L.create : mode === MODE_EDIT ? L.save : L.clone)}
          </Button>
        </>
      }
    >
      <FormField
        label={
          <>
            <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
            {t(L.name)}
          </>
        }
        labelWidth="150px"
      >
        <Input value={name} onChange={(_, d) => setName(d.value)} disabled={mode === MODE_EDIT} />
      </FormField>
      <FormField label={<>{t(L.description)}</>} labelWidth="150px">
        <Textarea value={description} onChange={(_, d) => setDescription(d.value)} />
      </FormField>
      <FormField label={<>{t(L.type)}</>} labelWidth="150px">
        <Input value={type} onChange={(_, d) => setType(d.value)} />
      </FormField>
      <FormField label={<>{t(L.sourceType)}</>} labelWidth="150px">
        <select
          className={styles.select}
          value={sourceType}
          onChange={(e) => setSourceType(e.target.value)}
        >
          <option value="Static">{t(L.sourceTypeStatic)}</option>
          <option value="Dynamic">{t(L.sourceTypeDynamic)}</option>
        </select>
      </FormField>
      <FormField label={<>{t(L.entityType)}</>} labelWidth="150px">
        <Input value={entityType} onChange={(_, d) => setEntityType(d.value)} />
      </FormField>
      <FormField label={<>{t(L.parameter)}</>} labelWidth="150px">
        <Input value={parameter} onChange={(_, d) => setParameter(d.value)} />
      </FormField>
      <FormField label={<>{t(L.kpiType)}</>} labelWidth="150px">
        <select
          className={styles.select}
          value={kpiType}
          onChange={(e) => setKpiType(e.target.value)}
        >
          <option value="Maximum">{t(L.kpiTypeMaximum)}</option>
          <option value="Minimum">{t(L.kpiTypeMinimum)}</option>
          <option value="Deviation">{t(L.kpiTypeDeviation)}</option>
        </select>
      </FormField>
      <FormField label={<>{t(L.frequency)}</>} labelWidth="150px">
        <select
          className={styles.select}
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="Daily">{t(L.frequencyDaily)}</option>
          <option value="Weekly">{t(L.frequencyWeekly)}</option>
          <option value="Monthly">{t(L.frequencyMonthly)}</option>
          <option value="Yearly">{t(L.frequencyYearly)}</option>
        </select>
      </FormField>
      <FormField label={<>{t(L.ownerRole)}</>} labelWidth="150px">
        <Input value={ownerRole} onChange={(_, d) => setOwnerRole(d.value)} />
      </FormField>
    </BaseDialog>
  );
}
