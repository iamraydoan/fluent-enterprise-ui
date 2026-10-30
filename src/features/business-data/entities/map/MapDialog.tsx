import { useState } from "react";
import { Button, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { MODE_CREATE, MODE_EDIT } from "./wizardMode";
import type { WizardMode } from "./wizardMode";


const L: Record<string, TranslationKey> = {
  createTitle: "businessData.map.dialog.createTitle",
  editTitle: "businessData.map.dialog.editTitle",
  cloneTitle: "businessData.map.dialog.cloneTitle",
  step1: "businessData.map.dialog.step1",
  step2: "businessData.map.dialog.step2",
  name: "businessData.map.dialog.name",
  description: "businessData.map.dialog.description",
  mapDefinition: "businessData.map.dialog.mapDefinition",
  step: "businessData.map.dialog.step",
  resource: "businessData.map.dialog.resource",
  layers: "businessData.map.dialog.layers",
  layersHint: "businessData.map.dialog.layersHint",
  back: "businessData.map.dialog.back",
  next: "businessData.map.dialog.next",
  cancel: "businessData.map.dialog.cancel",
  create: "businessData.map.dialog.create",
  save: "businessData.map.dialog.save",
  clone: "businessData.map.dialog.clone",
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
  step: { fontSize: tokens.fontSizeBase300, color: tokens.colorNeutralForeground3 },
  stepActive: {
    fontSize: tokens.fontSizeBase300,
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
  field: { display: "grid", gridTemplateColumns: "150px 1fr", gap: "12px", alignItems: "center" },
  hint: { fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground3 },
});

interface DialogProps {
  mode: WizardMode;
  initialName?: string;
  onClose: () => void;
}

export function MapDialog({ mode, initialName, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initialName ?? "");
  const [description, setDescription] = useState("");
  const [mapDefinition, setMapDefinition] = useState("");
  const [stepCtx, setStepCtx] = useState("");
  const [resource, setResource] = useState("");

  const title =
    mode === MODE_CREATE ? L.createTitle : mode === MODE_EDIT ? L.editTitle : L.cloneTitle;
  const canSubmit = name.trim().length > 0 && mapDefinition.trim().length > 0;

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
                  {t(L.mapDefinition)}
                </label>
                <Input value={mapDefinition} onChange={(_, d) => setMapDefinition(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.step)}</label>
                <Input value={stepCtx} onChange={(_, d) => setStepCtx(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.resource)}</label>
                <Input value={resource} onChange={(_, d) => setResource(d.value)} />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className={styles.hint}>{t(L.layersHint)}</div>
              <div className={styles.field}>
                <label>{t(L.layers)}</label>
                <input type="file" accept=".g85" multiple />
              </div>
            </>
          )}
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          {step === 2 && <Button onClick={() => setStep(1)}>{t(L.back)}</Button>}
          {step === 1 ? (
            <Button appearance="primary" onClick={() => setStep(2)} disabled={!canSubmit}>
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
