import { useState } from "react";
import { BaseDialog, FormField } from "@/components/common";
import { Button, Input, Textarea, makeStyles} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";

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
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    marginBottom: "4px",
  },
  step: { fontSize: theme.font.sizeSm, color: theme.color.textTertiary },
  stepActive: {
    fontSize: theme.font.sizeSm,
    fontWeight: theme.font.weightSemibold,
    color: theme.color.textBrand,
  },
  select: {
    padding: "6px 8px",
    border: `1px solid ${theme.color.border}`,
    borderRadius: theme.radius.md,
    fontSize: theme.font.sizeMd,
    backgroundColor: theme.color.surface,
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
              variant="primary"
              onClick={() => setStep(step + 1)}
              disabled={!entity.trim()}
            >
              {t(L.next)}
            </Button>
          ) : (
            <Button variant="primary" onClick={onClose}>
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
                <span style={{ color: theme.color.textDanger }}>* </span>
                {t(L.entity)}
              </>
            }
            labelWidth="160px"
          >
            <Input value={entity} onChange={setEntity} />
          </FormField>
        </>
      )}
      {step === 2 && (
        <>
          <FormField label={<>{t(L.scheduleDate)}</>} labelWidth="160px">
            <Input value={scheduleDate} onChange={setScheduleDate} />
          </FormField>
          <FormField label={<>{t(L.comment)}</>} labelWidth="160px">
            <Textarea value={comment} onChange={setComment} />
          </FormField>
        </>
      )}
    </BaseDialog>
  );
}
