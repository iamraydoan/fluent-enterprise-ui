import { useState } from "react";
import type { ScheduleDetail, ScheduleRecord } from "@/api";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Body1Strong, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

interface AdjustScheduleJobDialogProps {
  open: boolean;
  onClose: () => void;
  scheduleName: string;
  initial?: Partial<ScheduleDetail & ScheduleRecord>;
}

export function AdjustScheduleJobDialog({
  open,
  onClose,
  scheduleName,
}: AdjustScheduleJobDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.schedule.dialogs.adjust";
  const [resource, setResource] = useState("");
  const [plannedStart, setPlannedStart] = useState("");
  const [plannedEnd, setPlannedEnd] = useState("");

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.title`)}
      onClose={onClose}
      width="min(700px, 85vw)"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(`${k}.adjust`)} />
      }
    >
      <div style={{ marginBottom: 12, color: "#0078d4" }}>📊 {scheduleName}</div>
      <div style={{ display: "flex", flexDirection: "column", rowGap: 12 }}>
        <Body1Strong>{t(`${k}.jobBody`)}</Body1Strong>
        <Field label={t(`${k}.resource`)}>
          <Input value={resource} onChange={(_, d) => setResource(d.value)} />
        </Field>
        <Field label={t(`${k}.plannedStart`)}>
          <Input
            value={plannedStart}
            type="datetime-local"
            onChange={(_, d) => setPlannedStart(d.value)}
          />
        </Field>
        <Field label={t(`${k}.plannedEnd`)}>
          <Input
            value={plannedEnd}
            type="datetime-local"
            onChange={(_, d) => setPlannedEnd(d.value)}
          />
        </Field>
      </div>
    </BaseDialog>
  );
}
