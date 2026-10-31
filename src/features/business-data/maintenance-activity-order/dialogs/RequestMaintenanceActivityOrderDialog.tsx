import { useState } from "react";
import { BaseDialog, FormField } from "@/components/common";
import { Button, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const L: Record<string, TranslationKey> = {
  title: "businessData.maintenanceActivityOrder.request.title",
  step1: "businessData.maintenanceActivityOrder.request.step1",
  step2: "businessData.maintenanceActivityOrder.request.step2",
  entityType: "businessData.maintenanceActivityOrder.request.entityType",
  entity: "businessData.maintenanceActivityOrder.request.entity",
  scheduleDate: "businessData.maintenanceActivityOrder.request.scheduleDate",
  comment: "businessData.maintenanceActivityOrder.request.comment",
  cancel: "businessData.maintenanceActivityOrder.request.cancel",
  request: "businessData.maintenanceActivityOrder.request.request",
  back: "businessData.maintenanceActivityOrder.request.back",
  next: "businessData.maintenanceActivityOrder.request.next",
};

const useStyles = makeStyles({
  steps: {
    display: "flex",
    gap: "16px",
    padding: "4px 4px 12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    marginBottom: "4px",
  },
  step: { fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground3 },
  stepActive: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
  },
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
  const styles = useStyles();
  const [step, setStep] = useState(1);
  const [entityType, setEntityType] = useState("Resource");
  const [entity, setEntity] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [comment, setComment] = useState("");

  return (
    <BaseDialog
      open
      title={t(L.title)}
      width="640px"
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          {step > 1 && <Button onClick={() => setStep(step - 1)}>{t(L.back)}</Button>}
          {step < 2 ? (
            <Button
              appearance="primary"
              onClick={() => setStep(step + 1)}
              disabled={!entity.trim()}
            >
              {t(L.next)}
            </Button>
          ) : (
            <Button appearance="primary" onClick={onClose}>
              {t(L.request)}
            </Button>
          )}
        </>
      }
    >
      <div className={styles.steps}>
        <span className={step === 1 ? styles.stepActive : styles.step}>{t(L.step1)}</span>
        <span className={step === 2 ? styles.stepActive : styles.step}>{t(L.step2)}</span>
      </div>
      {step === 1 && (
        <>
          <FormField label={<>{t(L.entityType)}</>} labelWidth="160px">
            <select
              className={styles.select}
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
            >
              {ENTITY_TYPES.map((et) => (
                <option key={et} value={et}>
                  {et}
                </option>
              ))}
            </select>
          </FormField>
          <FormField
            label={
              <>
                <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
                {t(L.entity)}
              </>
            }
            labelWidth="160px"
          >
            <Input value={entity} onChange={(_, d) => setEntity(d.value)} />
          </FormField>
        </>
      )}
      {step === 2 && (
        <>
          <FormField label={<>{t(L.scheduleDate)}</>} labelWidth="160px">
            <Input value={scheduleDate} onChange={(_, d) => setScheduleDate(d.value)} />
          </FormField>
          <FormField label={<>{t(L.comment)}</>} labelWidth="160px">
            <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
          </FormField>
        </>
      )}
    </BaseDialog>
  );
}
