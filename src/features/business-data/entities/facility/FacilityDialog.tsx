import { useState } from "react";
import { Button, Checkbox, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { MODE_CREATE, MODE_EDIT } from "./wizardMode";
import type { WizardMode } from "./wizardMode";

const tk = (key: string) => key as TranslationKey;

const L = {
  createTitle: tk("businessData.facility.dialog.createTitle"),
  editTitle: tk("businessData.facility.dialog.editTitle"),
  cloneTitle: tk("businessData.facility.dialog.cloneTitle"),
  step1: tk("businessData.facility.dialog.step1"),
  step2: tk("businessData.facility.dialog.step2"),
  name: tk("businessData.facility.dialog.name"),
  description: tk("businessData.facility.dialog.description"),
  type: tk("businessData.facility.dialog.type"),
  dataGroup: tk("businessData.facility.dialog.dataGroup"),
  displayOrder: tk("businessData.facility.dialog.displayOrder"),
  defaultCalendar: tk("businessData.facility.dialog.defaultCalendar"),
  site: tk("businessData.facility.dialog.site"),
  remote: tk("businessData.facility.dialog.remote"),
  terminateOnShip: tk("businessData.facility.dialog.terminateOnShip"),
  back: tk("businessData.facility.dialog.back"),
  next: tk("businessData.facility.dialog.next"),
  cancel: tk("businessData.facility.dialog.cancel"),
  create: tk("businessData.facility.dialog.create"),
  save: tk("businessData.facility.dialog.save"),
  clone: tk("businessData.facility.dialog.clone"),
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
  steps: {
    display: "flex",
    gap: "16px",
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  step: { fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground3 },
  stepActive: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
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
  field: { display: "grid", gridTemplateColumns: "200px 1fr", gap: "12px", alignItems: "center" },
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

export function FacilityDialog({ mode, initialName, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();
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
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${shared.contentCard} ${styles.surface}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.head}>{t(title)}</div>
        <div className={styles.steps}>
          <span className={step === 1 ? styles.stepActive : styles.step}>{t(L.step1)}</span>
          <span className={step === 2 ? styles.stepActive : styles.step}>{t(L.step2)}</span>
        </div>
        <div className={styles.body}>
          {step === 1 && (
            <>
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
                <label>
                  <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
                  {t(L.type)}
                </label>
                <select
                  className={styles.select}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">{t(tk("common.none"))}</option>
                  <option value="Manufacturing">
                    {t(tk("businessData.facility.dialog.typeManufacturing"))}
                  </option>
                  <option value="Distribution Center">
                    {t(tk("businessData.facility.dialog.typeDistribution"))}
                  </option>
                  <option value="Warehouse">
                    {t(tk("businessData.facility.dialog.typeWarehouse"))}
                  </option>
                </select>
              </div>
              <div className={styles.field}>
                <label>{t(L.dataGroup)}</label>
                <Input value={dataGroup} onChange={(_, d) => setDataGroup(d.value)} />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className={styles.field}>
                <label>
                  <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
                  {t(L.displayOrder)}
                </label>
                <Input value={displayOrder} onChange={(_, d) => setDisplayOrder(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.defaultCalendar)}</label>
                <Input value={defaultCalendar} onChange={(_, d) => setDefaultCalendar(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.site)}</label>
                <Input value={site} onChange={(_, d) => setSite(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.remote)}</label>
                <Checkbox
                  checked={remote === true}
                  onChange={(_, d) => setRemote(d.checked === true)}
                  disabled
                />
              </div>
              <div className={styles.field}>
                <label>{t(L.terminateOnShip)}</label>
                <Checkbox
                  checked={terminateOnShip === true}
                  onChange={(_, d) => setTerminateOnShip(d.checked === true)}
                  disabled={remote}
                />
              </div>
            </>
          )}
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          {step > 1 && <Button onClick={() => setStep(step - 1)}>{t(L.back)}</Button>}
          {step < 2 ? (
            <Button appearance="primary" onClick={() => setStep(step + 1)} disabled={!canSubmit}>
              {t(L.next)}
            </Button>
          ) : (
            <Button appearance="primary" onClick={onClose}>
              {t(mode === MODE_CREATE ? L.create : mode === MODE_EDIT ? L.save : L.clone)}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
