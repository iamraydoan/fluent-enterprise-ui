import { useState } from "react";
import {
  Body1Strong,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

interface GenerateScheduleScenarioDialogProps {
  open: boolean;
  onClose: () => void;
  scenarioName: string;
}

const STEP_KEYS: TranslationKey[] = [
  "businessData.scheduleScenario.dialogs.generate.step1",
  "businessData.scheduleScenario.dialogs.generate.step2",
  "businessData.scheduleScenario.dialogs.generate.step3",
];

const BODIES: TranslationKey[] = [
  "businessData.scheduleScenario.dialogs.generate.step1Body",
  "businessData.scheduleScenario.dialogs.generate.step2Body",
  "businessData.scheduleScenario.dialogs.generate.step3Body",
];

export function GenerateScheduleScenarioDialog({ open, onClose, scenarioName }: GenerateScheduleScenarioDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.scheduleScenario.dialogs.generate";
  const [step, setStep] = useState(1);

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 900, width: "90vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.title`)}</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>📊 {scenarioName}</div>
            <div style={{ display: "flex", alignItems: "center", columnGap: 8, marginBottom: 12 }}>
              {STEP_KEYS.map((key, i) => (
                <span key={key} style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: step === i + 1 ? "#0078d4" : "#ccc", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{i + 1}</span>
                  <Body1Strong>{t(key)}</Body1Strong>
                  {i < 2 && <span style={{ width: 30, height: 1, backgroundColor: "#ccc" }} />}
                </span>
              ))}
            </div>
            <div style={{ padding: "12px 0", color: "#666" }}>
              {t(BODIES[step - 1])}
            </div>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>{t("common.cancel")}</Button>
            {step > 1 && (
              <Button appearance="secondary" onClick={() => setStep(step - 1)}>{t("common.back")}</Button>
            )}
            {step < 3 ? (
              <Button appearance="primary" onClick={() => setStep(step + 1)}>{t("common.next")}</Button>
            ) : (
              <Button appearance="primary" onClick={onClose}>{t(`${k}.generate`)}</Button>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
