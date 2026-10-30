import { useState } from "react";
import { Button, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { MODE_CREATE, MODE_EDIT } from "./wizardMode";
import type { WizardMode } from "./wizardMode";


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

const useDialogStyles = makeStyles({
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  surface: {
    width: "640px",
    maxWidth: "95vw",
    display: "flex",
    flexDirection: "column",
    maxHeight: "90vh",
  },
  head: {
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
  },
  body: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    overflowY: "auto",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    padding: "12px 16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  field: { display: "grid", gridTemplateColumns: "150px 1fr", gap: "12px", alignItems: "center" },
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
  const shared = useSharedStyles();
  const styles = useDialogStyles();
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
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${shared.contentCard} ${styles.surface}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.head}>{t(title)}</div>
        <div className={styles.body}>
          <div className={styles.field}>
            <label>
              <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
              {t(L.name)}
            </label>
            <Input
              value={name}
              onChange={(_, d) => setName(d.value)}
              disabled={mode === MODE_EDIT}
            />
          </div>
          <div className={styles.field}>
            <label>{t(L.description)}</label>
            <Textarea value={description} onChange={(_, d) => setDescription(d.value)} />
          </div>
          <div className={styles.field}>
            <label>{t(L.type)}</label>
            <Input value={type} onChange={(_, d) => setType(d.value)} />
          </div>
          <div className={styles.field}>
            <label>{t(L.sourceType)}</label>
            <select
              className={styles.select}
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value)}
            >
              <option value="Static">{t(L.sourceTypeStatic)}</option>
              <option value="Dynamic">{t(L.sourceTypeDynamic)}</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>{t(L.entityType)}</label>
            <Input value={entityType} onChange={(_, d) => setEntityType(d.value)} />
          </div>
          <div className={styles.field}>
            <label>{t(L.parameter)}</label>
            <Input value={parameter} onChange={(_, d) => setParameter(d.value)} />
          </div>
          <div className={styles.field}>
            <label>{t(L.kpiType)}</label>
            <select
              className={styles.select}
              value={kpiType}
              onChange={(e) => setKpiType(e.target.value)}
            >
              <option value="Maximum">{t(L.kpiTypeMaximum)}</option>
              <option value="Minimum">{t(L.kpiTypeMinimum)}</option>
              <option value="Deviation">{t(L.kpiTypeDeviation)}</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>{t(L.frequency)}</label>
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
          </div>
          <div className={styles.field}>
            <label>{t(L.ownerRole)}</label>
            <Input value={ownerRole} onChange={(_, d) => setOwnerRole(d.value)} />
          </div>
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose} disabled={!canSubmit}>
            {t(mode === MODE_CREATE ? L.create : mode === MODE_EDIT ? L.save : L.clone)}
          </Button>
        </div>
      </div>
    </div>
  );
}
