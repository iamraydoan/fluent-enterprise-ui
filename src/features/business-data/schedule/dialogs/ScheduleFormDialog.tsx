import { useState } from "react";
import type { ScheduleDetail, ScheduleRecord } from "@/api";
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
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

interface ScheduleFormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  initial?: Partial<ScheduleDetail & ScheduleRecord>;
  nameReadOnly?: boolean;
  submitLabel: string;
}

const STEPS = ["General Data", "Optimization Criteria", "Untie Sort Rules", "Automatic Scheduling"];

const VIEW_OPTIONS = ["Gantt", "Table"];
const TYPE_OPTIONS = ["Forwards", "Backwards"];

const STEP_KEYS: TranslationKey[] = [
  "businessData.schedule.dialogs.form.step1",
  "businessData.schedule.dialogs.form.step2",
  "businessData.schedule.dialogs.form.step3",
  "businessData.schedule.dialogs.form.step4",
];

export function ScheduleFormDialog({
  open,
  onClose,
  title,
  initial,
  nameReadOnly,
  submitLabel,
}: ScheduleFormDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.schedule.dialogs.form";
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [defaultView, setDefaultView] = useState(initial?.defaultView ?? "Gantt");
  const [defaultFrozenPeriod, setDefaultFrozenPeriod] = useState(
    String(initial?.defaultFrozenPeriod ?? 4),
  );
  const [timeQuantum, setTimeQuantum] = useState(String(initial?.timeQuantum ?? 5));
  const [schedulingType, setSchedulingType] = useState("Forwards");
  const [comments, setComments] = useState("");

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 950, width: "92vw" }}>
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            {!nameReadOnly && (
              <div
                style={{ display: "flex", alignItems: "center", columnGap: 8, marginBottom: 12 }}
              >
                {STEPS.map((_, i) => (
                  <span
                    key={STEP_KEYS[i]}
                    style={{ display: "flex", alignItems: "center", columnGap: 8 }}
                  >
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        backgroundColor: step === i + 1 ? "#0078d4" : "#ccc",
                        color: "#fff",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                      }}
                    >
                      {i + 1}
                    </span>
                    <Body1Strong>{t(STEP_KEYS[i])}</Body1Strong>
                    {i < 3 && <span style={{ width: 30, height: 1, backgroundColor: "#ccc" }} />}
                  </span>
                ))}
              </div>
            )}

            {(step === 1 || nameReadOnly) && (
              <div style={{ display: "flex", flexDirection: "column", rowGap: 12 }}>
                <Field label={t(`${k}.name`)} required>
                  <Input
                    value={name}
                    readOnly={nameReadOnly}
                    onChange={(_, d) => setName(d.value)}
                  />
                </Field>
                <Field label={t(`${k}.description`)}>
                  <Input value={description} onChange={(_, d) => setDescription(d.value)} />
                </Field>
                <Field label={t(`${k}.defaultView`)}>
                  <select value={defaultView} onChange={(e) => setDefaultView(e.target.value)}>
                    {VIEW_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t(`${k}.defaultFrozenPeriod`)}>
                  <Input
                    value={defaultFrozenPeriod}
                    onChange={(_, d) => setDefaultFrozenPeriod(d.value)}
                  />
                </Field>
                <Field label={t(`${k}.timeQuantum`)}>
                  <Input value={timeQuantum} onChange={(_, d) => setTimeQuantum(d.value)} />
                </Field>
              </div>
            )}

            {step === 2 && !nameReadOnly && (
              <div style={{ display: "flex", flexDirection: "column", rowGap: 12 }}>
                <Body1Strong>{t(`${k}.schedulingType`)}</Body1Strong>
                <Field label={t(`${k}.type`)}>
                  <select
                    value={schedulingType}
                    onChange={(e) => setSchedulingType(e.target.value)}
                  >
                    {TYPE_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>
                <div style={{ padding: "12px 0", color: "#666" }}>{t(`${k}.optimizationBody`)}</div>
              </div>
            )}

            {step === 3 && !nameReadOnly && (
              <div style={{ padding: "12px 0", color: "#666" }}>{t(`${k}.untieBody`)}</div>
            )}

            {step === 4 && !nameReadOnly && (
              <div style={{ padding: "12px 0", color: "#666" }}>{t(`${k}.automaticBody`)}</div>
            )}

            <Field label={t(`${k}.comments`)}>
              <Input value={comments} onChange={(_, d) => setComments(d.value)} />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            {!nameReadOnly && step > 1 && (
              <Button appearance="secondary" onClick={() => setStep(step - 1)}>
                {t("common.back")}
              </Button>
            )}
            {!nameReadOnly && step < 4 ? (
              <Button appearance="primary" onClick={() => setStep(step + 1)}>
                {t("common.next")}
              </Button>
            ) : (
              <Button appearance="primary" onClick={onClose}>
                {submitLabel}
              </Button>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
