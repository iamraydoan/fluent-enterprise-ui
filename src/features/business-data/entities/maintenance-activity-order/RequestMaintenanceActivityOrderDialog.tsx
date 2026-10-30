import { useState } from "react";
import { Button, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const tk = (key: string) => key as TranslationKey;

const L = {
  title: tk("businessData.maintenanceActivityOrder.request.title"),
  step1: tk("businessData.maintenanceActivityOrder.request.step1"),
  step2: tk("businessData.maintenanceActivityOrder.request.step2"),
  entityType: tk("businessData.maintenanceActivityOrder.request.entityType"),
  entity: tk("businessData.maintenanceActivityOrder.request.entity"),
  scheduleDate: tk("businessData.maintenanceActivityOrder.request.scheduleDate"),
  comment: tk("businessData.maintenanceActivityOrder.request.comment"),
  cancel: tk("businessData.maintenanceActivityOrder.request.cancel"),
  request: tk("businessData.maintenanceActivityOrder.request.request"),
  back: tk("businessData.maintenanceActivityOrder.request.back"),
  next: tk("businessData.maintenanceActivityOrder.request.next"),
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
  surface: { width: "640px", maxWidth: "95vw", display: "flex", flexDirection: "column", maxHeight: "90vh" },
  head: {
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
  },
  steps: { display: "flex", gap: "16px", padding: "12px 16px", borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  step: { fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground3 },
  stepActive: { fontSize: tokens.fontSizeBase200, fontWeight: tokens.fontWeightSemibold, color: tokens.colorBrandForeground1 },
  body: { padding: "16px", display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto" },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    padding: "12px 16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  field: { display: "grid", gridTemplateColumns: "160px 1fr", gap: "12px", alignItems: "center" },
  select: {
    padding: "6px 8px",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase300,
    backgroundColor: tokens.colorNeutralBackground1,
  },
});

const ENTITY_TYPES = ["Area", "Container", "Resource", "Material"];

export function RequestMaintenanceActivityOrderDialog({ onClose }: { onClose: () => void }) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();
  const [step, setStep] = useState(1);
  const [entityType, setEntityType] = useState("Resource");
  const [entity, setEntity] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [comment, setComment] = useState("");

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={`${shared.contentCard} ${styles.surface}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.head}>{t(L.title)}</div>
        <div className={styles.steps}>
          <span className={step === 1 ? styles.stepActive : styles.step}>{t(L.step1)}</span>
          <span className={step === 2 ? styles.stepActive : styles.step}>{t(L.step2)}</span>
        </div>
        <div className={styles.body}>
          {step === 1 && (
            <>
              <div className={styles.field}>
                <label>{t(L.entityType)}</label>
                <select className={styles.select} value={entityType} onChange={(e) => setEntityType(e.target.value)}>
                  {ENTITY_TYPES.map((et) => (
                    <option key={et} value={et}>
                      {et}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>
                  <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
                  {t(L.entity)}
                </label>
                <Input value={entity} onChange={(_, d) => setEntity(d.value)} />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className={styles.field}>
                <label>{t(L.scheduleDate)}</label>
                <Input value={scheduleDate} onChange={(_, d) => setScheduleDate(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.comment)}</label>
                <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
              </div>
            </>
          )}
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          {step > 1 && <Button onClick={() => setStep(step - 1)}>{t(L.back)}</Button>}
          {step < 2 ? (
            <Button appearance="primary" onClick={() => setStep(step + 1)} disabled={!entity.trim()}>
              {t(L.next)}
            </Button>
          ) : (
            <Button appearance="primary" onClick={onClose}>
              {t(L.request)}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
