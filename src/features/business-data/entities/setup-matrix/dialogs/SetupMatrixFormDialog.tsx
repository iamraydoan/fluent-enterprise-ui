import { useState } from "react";
import type { SetupMatrixDetail, SetupMatrixRecord } from "@/api";
import {
  Body1Strong,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Field,
  Input,
  Switch,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

interface SetupMatrixFormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  initial?: Partial<SetupMatrixDetail & SetupMatrixRecord>;
  nameReadOnly?: boolean;
  submitLabel: string;
}

const TIME_SCALES = ["Seconds", "Minutes", "Hours", "Days"];

const STEP_KEYS: TranslationKey[] = [
  "businessData.setupMatrix.dialogs.form.step1",
  "businessData.setupMatrix.dialogs.form.step2",
  "businessData.setupMatrix.dialogs.form.step3",
];

export function SetupMatrixFormDialog({
  open,
  onClose,
  title,
  initial,
  nameReadOnly,
  submitLabel,
}: SetupMatrixFormDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.setupMatrix.dialogs.form";
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [timeScale, setTimeScale] = useState(initial?.timeScale ?? "Minutes");
  const [useZeroInDiagonal, setUseZeroInDiagonal] = useState(initial?.useZeroInDiagonal ?? true);
  const [comments, setComments] = useState("");

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 950, width: "92vw" }}>
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            {!nameReadOnly && (
              <div style={{ display: "flex", alignItems: "center", columnGap: 8, marginBottom: 12 }}>
                {STEP_KEYS.map((key, i) => (
                  <span key={key} style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
                    <span style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: step === i + 1 ? "#0078d4" : "#ccc", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{i + 1}</span>
                    <Body1Strong>{t(key)}</Body1Strong>
                    {i < 2 && <span style={{ width: 30, height: 1, backgroundColor: "#ccc" }} />}
                  </span>
                ))}
              </div>
            )}

            {(step === 1 || nameReadOnly) && (
              <div style={{ display: "flex", flexDirection: "column", rowGap: 12 }}>
                <Field label={t(`${k}.name`)} required>
                  <Input value={name} readOnly={nameReadOnly} onChange={(_, d) => setName(d.value)} />
                </Field>
                <Field label={t(`${k}.description`)}>
                  <Input value={description} onChange={(_, d) => setDescription(d.value)} />
                </Field>
                <Field label={t(`${k}.timeScale`)}>
                  <select value={timeScale} onChange={(e) => setTimeScale(e.target.value)}>
                    {TIME_SCALES.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </Field>
                <Field label={t(`${k}.useZeroInDiagonal`)}>
                  <Switch checked={useZeroInDiagonal} onChange={(_, d) => setUseZeroInDiagonal(d.checked)} />
                </Field>
              </div>
            )}

            {step === 2 && !nameReadOnly && (
              <div style={{ padding: "12px 0", color: "#666" }}>
                {t(`${k}.step2Body`)}
              </div>
            )}

            {step === 3 && !nameReadOnly && (
              <div style={{ padding: "12px 0", color: "#666" }}>
                {t(`${k}.step3Body`)}
              </div>
            )}

            <Field label={t(`${k}.comments`)}>
              <Input value={comments} onChange={(_, d) => setComments(d.value)} />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>{t("common.cancel")}</Button>
            {!nameReadOnly && step > 1 && (
              <Button appearance="secondary" onClick={() => setStep(step - 1)}>{t("common.back")}</Button>
            )}
            {!nameReadOnly && step < 3 ? (
              <Button appearance="primary" onClick={() => setStep(step + 1)}>{t("common.next")}</Button>
            ) : (
              <Button appearance="primary" onClick={onClose}>{submitLabel}</Button>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
