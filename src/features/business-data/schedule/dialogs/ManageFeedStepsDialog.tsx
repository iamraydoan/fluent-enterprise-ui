import { useState } from "react";
import { BaseDialog, DialogFooter, DialogEntityBanner } from "@/components/common";
import { Body1Strong, Button, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";

interface ManageFeedStepsDialogProps {
  open: boolean;
  onClose: () => void;
  scheduleName: string;
}

interface FeedStep {
  facility: string;
  step: string;
}

const INITIAL: FeedStep[] = [{ facility: "Fab1", step: "Photolithography" }];

const FIELDS: { key: keyof FeedStep; labelKey: TranslationKey }[] = [
  { key: "facility", labelKey: "businessData.schedule.dialogs.feedStep.facility" },
  { key: "step", labelKey: "businessData.schedule.dialogs.feedStep.step" },
];

export function ManageFeedStepsDialog({ open, onClose, scheduleName }: ManageFeedStepsDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.schedule.dialogs.feedStep";
  const [steps, setSteps] = useState<FeedStep[]>(INITIAL);
  const [selected, setSelected] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});

  const addStep = () => {
    const next = [...steps, { facility: "", step: "" }];
    setSteps(next);
    setSelected(next.length - 1);
    setValues({});
  };

  const removeStep = (index: number) => {
    const next = steps.filter((_, i) => i !== index);
    setSteps(next.length > 0 ? next : [{ facility: "", step: "" }]);
    setSelected(0);
    setValues({});
  };

  const selectStep = (index: number) => {
    setSelected(index);
    setValues({});
  };

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.title`)}
      onClose={onClose}
      width="min(1000px, 90vw)"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(`${k}.manage`)} />
      }
    >
      <DialogEntityBanner icon="📊" name={scheduleName} />
      <div style={{ display: "flex", columnGap: 16 }}>
        <div style={{ width: 300, flexShrink: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Body1Strong>{t(`${k}.steps`, { count: steps.length })}</Body1Strong>
            <div style={{ display: "flex", columnGap: 4 }}>
              <Button size="sm" variant="subtle" onClick={addStep}>
                +
              </Button>
              <Button size="sm" variant="subtle" onClick={() => removeStep(selected)}>
                🗑
              </Button>
            </div>
          </div>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 4,
              minHeight: 280,
              overflow: "auto",
            }}
          >
            {steps.map((fs, i) => (
              <div
                key={`${fs.step}-${i}`}
                onClick={() => selectStep(i)}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  backgroundColor: i === selected ? theme.color.brandSubtle : "transparent",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div style={{ fontWeight: 600 }}>{fs.step || t(`${k}.newStep`)}</div>
                <div style={{ fontSize: 12, color: "#666" }}>{fs.facility}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", rowGap: 12 }}>
          <Body1Strong>{t(`${k}.detailsTitle`)}</Body1Strong>
          {FIELDS.map((f) => (
            <Field key={f.key} label={t(f.labelKey)}>
              <Input
                value={values[f.key] ?? steps[selected]?.[f.key] ?? ""}
                onChange={(value) => setValues({ ...values, [f.key]: value })}
              />
            </Field>
          ))}
        </div>
      </div>
    </BaseDialog>
  );
}
